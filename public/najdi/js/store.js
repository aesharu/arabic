// IndexedDB: this device's copy of the deck and of his progress.
//
// On the Mac app this was the only copy there was. On the site it is a copy: the deck comes from his
// own database (cloud.js) and his progress goes back to it (sync.js), so every device he signs in on
// is the same deck at the same place. Nothing here is shared with anyone else.
const DB_NAME = "najdi";
const DB_VERSION = 1;
let dbPromise = null;

function open() {
  dbPromise ??= new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      db.createObjectStore("meta");                         // key → value: deck info, settings, day counters
      db.createObjectStore("notes", { keyPath: "guid" });   // imported notes
      db.createObjectStore("media");                        // filename → Blob
      db.createObjectStore("cards");                        // cardId → scheduling state
      db.createObjectStore("user");                         // note guid → { star, note, suspended }
      db.createObjectStore("revlog", { autoIncrement: true });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

const request = req => new Promise((resolve, reject) => {
  req.onsuccess = () => resolve(req.result);
  req.onerror = () => reject(req.error);
});
const finished = tx => new Promise((resolve, reject) => {
  tx.oncomplete = () => resolve();
  tx.onerror = tx.onabort = () => reject(tx.error || new Error("Storage transaction failed"));
});

export async function get(store, key) {
  const db = await open();
  return request(db.transaction(store).objectStore(store).get(key));
}

export async function set(store, key, value) {
  const db = await open();
  const tx = db.transaction(store, "readwrite");
  const os = tx.objectStore(store);
  if (os.keyPath) os.put(value); else os.put(value, key);
  return finished(tx);
}

export async function remove(store, key) {
  const db = await open();
  const tx = db.transaction(store, "readwrite");
  tx.objectStore(store).delete(key);
  return finished(tx);
}

// Returns the auto-generated key (used by revlog so a review can be undone).
export async function add(store, value) {
  const db = await open();
  const tx = db.transaction(store, "readwrite");
  const key = await request(tx.objectStore(store).add(value));
  await finished(tx);
  return key;
}

export async function all(store) {
  const db = await open();
  return request(db.transaction(store).objectStore(store).getAll());
}

export async function entries(store) {
  const db = await open();
  const os = db.transaction(store).objectStore(store);
  const [keys, values] = await Promise.all([request(os.getAllKeys()), request(os.getAll())]);
  return new Map(keys.map((k, i) => [k, values[i]]));
}

// items: array of [key, value] (or plain values for keyPath stores)
export async function putMany(store, items) {
  const db = await open();
  const tx = db.transaction(store, "readwrite");
  const os = tx.objectStore(store);
  for (const item of items) {
    if (os.keyPath) os.put(item); else os.put(item[1], item[0]);
  }
  return finished(tx);
}

export async function clear(...stores) {
  const db = await open();
  const tx = db.transaction(stores, "readwrite");
  for (const s of stores) tx.objectStore(s).clear();
  return finished(tx);
}

// Ask the browser not to evict our data under storage pressure (matters on iPhone).
export async function persist() {
  try { return await navigator.storage?.persist?.(); } catch { return false; }
}
