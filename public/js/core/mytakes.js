// Volodymyr's own practice takes, kept in this browser (IndexedDB) and nowhere else: they are for hearing
// himself against Dima's voice, not for anyone to listen to. One take per phrase — the newest.
// Her recordings live in the cloud (core/content.js); these never leave the computer.
const DB = "najdi-takes";
const STORE = "takes";
let opening = null;

function open() {
  opening ??= new Promise((resolve, reject) => {
    if (!self.indexedDB) return reject(new Error("no-indexeddb"));
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE, { keyPath: "key" });
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  }).catch(err => {
    opening = null; // a private window or blocked storage: try again next time, and work without it meanwhile
    throw err;
  });
  return opening;
}

const run = async (mode, fn) => {
  const db = await open();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, mode);
    const req = fn(tx.objectStore(STORE));
    tx.onerror = () => reject(tx.error);
    if (req) req.onsuccess = () => resolve(req.result);
    else tx.oncomplete = () => resolve();
  });
};

export const save = (key, blob, seconds) =>
  run("readwrite", s => s.put({ key, blob, seconds, at: Date.now() })).catch(() => {});

export const load = key => run("readonly", s => s.get(key)).catch(() => null);

// Which phrases already have a take, so the list can mark them.
export const keys = () => run("readonly", s => s.getAllKeys()).catch(() => []);

export const remove = key => run("readwrite", s => s.delete(key)).catch(() => {});
