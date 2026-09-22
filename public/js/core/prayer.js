// Prayer times and the direction of Mecca, calculated in the browser — no service, works offline.
// Method: Umm al-Qura, the one Saudi Arabia uses — Fajr at the sun 18.5° below the horizon, Isha 90 minutes after
// Maghrib (120 in Ramadan), Asr when a shadow equals its object plus its noon shadow. Times can differ from the
// mosque's by a minute or two. Saudi Arabia is UTC+3 all year (no summer time).

export const CITIES = [
  { id: "hafar", lat: 28.4328, lng: 45.9708, name: { en: "Hafar al-Batin", uk: "Хафр-ель-Батін", najdi: "حفر الباطن", msa: "حفر الباطن" } },
  { id: "riyadh", lat: 24.7136, lng: 46.6753, name: { en: "Riyadh", uk: "Ер-Ріяд", najdi: "الرياض", msa: "الرياض" } },
  { id: "buraidah", lat: 26.326, lng: 43.975, name: { en: "Buraidah", uk: "Бурайда", najdi: "بريدة", msa: "بريدة" } },
  { id: "hail", lat: 27.5114, lng: 41.7208, name: { en: "Ha'il", uk: "Хаїль", najdi: "حايل", msa: "حائل" } },
  { id: "sakaka", lat: 29.9697, lng: 40.2064, name: { en: "Sakaka (Al-Jouf)", uk: "Сакака (Ель-Джауф)", najdi: "سكاكا (الجوف)", msa: "سكاكا (الجوف)" } },
  { id: "arar", lat: 30.9753, lng: 41.0381, name: { en: "Arar", uk: "Арар", najdi: "عرعر", msa: "عرعر" } },
  { id: "tabuk", lat: 28.3835, lng: 36.5662, name: { en: "Tabuk", uk: "Табук", najdi: "تبوك", msa: "تبوك" } },
];
export const MECCA = { lat: 21.4225, lng: 39.8262 }; // the Kaaba
const TZ = 3;

export const PRAYERS = [
  { id: "fajr", ar: "الفجر", say: "al-fajr", en: "Fajr (dawn)", uk: "Фаджр (світанок)", msa: "صلاة الفجر" },
  { id: "sunrise", ar: "الشروق", say: "ash-shurūg", en: "Sunrise", uk: "Схід сонця", msa: "الشروق", notPrayer: true },
  { id: "dhuhr", ar: "الظهر", say: "aẓ-ẓuhr", en: "Dhuhr (noon)", uk: "Зухр (полудень)", msa: "صلاة الظهر" },
  { id: "asr", ar: "العصر", say: "al-ʿaṣr", en: "Asr (afternoon)", uk: "Аср (пообідня)", msa: "صلاة العصر" },
  { id: "maghrib", ar: "المغرب", say: "al-maghrib", en: "Maghrib (sunset)", uk: "Магриб (захід сонця)", msa: "صلاة المغرب" },
  { id: "isha", ar: "العشاء", say: "al-ʿisha", en: "Isha (night)", uk: "Іша (нічна)", msa: "صلاة العشاء" },
];

const rad = d => (d * Math.PI) / 180;
const deg = r => (r * 180) / Math.PI;
const fix = (a, b) => ((a % b) + b) % b;

function julian(y, m, d) {
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5;
}

// The sun's declination and the equation of time for a Julian day.
function sun(jd) {
  const D = jd - 2451545;
  const g = fix(357.529 + 0.98560028 * D, 360);
  const q = fix(280.459 + 0.98564736 * D, 360);
  const L = fix(q + 1.915 * Math.sin(rad(g)) + 0.02 * Math.sin(rad(2 * g)), 360);
  const e = 23.439 - 0.00000036 * D;
  const RA = deg(Math.atan2(Math.cos(rad(e)) * Math.sin(rad(L)), Math.cos(rad(L)))) / 15;
  return { decl: deg(Math.asin(Math.sin(rad(e)) * Math.sin(rad(L)))), eqt: q / 15 - fix(RA, 24) };
}

// Is this date in Ramadan (Umm al-Qura)? Isha is then two hours after Maghrib.
let hijriFormat = null;
export function hijriParts(date) {
  hijriFormat ??= new Intl.DateTimeFormat("en-u-ca-islamic-umalqura-nu-latn", { day: "numeric", month: "numeric", year: "numeric", timeZone: "UTC" });
  const parts = hijriFormat.formatToParts(date);
  const get = type => +parts.find(p => p.type === type)?.value;
  return { day: get("day"), month: get("month"), year: parseInt(parts.find(p => p.type === "year")?.value, 10) };
}

// Times for one day ("YYYY-MM-DD", Saudi date) as Date objects.
export function prayerTimes(key, city = CITIES[0]) {
  const [y, m, d] = key.split("-").map(Number);
  const jd = julian(y, m, d) - city.lng / (15 * 24);
  const noon = t => fix(12 - sun(jd + t).eqt, 24);
  const angleTime = (angle, t, before) => {
    const { decl } = sun(jd + t);
    const cos = (-Math.sin(rad(angle)) - Math.sin(rad(decl)) * Math.sin(rad(city.lat))) / (Math.cos(rad(decl)) * Math.cos(rad(city.lat)));
    const T = deg(Math.acos(Math.max(-1, Math.min(1, cos)))) / 15;
    return noon(t) + (before ? -T : T);
  };
  const asrTime = t => {
    const { decl } = sun(jd + t);
    return angleTime(-deg(Math.atan(1 / (1 + Math.tan(rad(Math.abs(city.lat - decl)))))), t, false);
  };
  // Two passes: estimate, then recompute with the sun's position at the estimated time.
  let h = { fajr: 5, sunrise: 6, dhuhr: 12, asr: 13, maghrib: 18 };
  for (let pass = 0; pass < 2; pass++) {
    h = {
      fajr: angleTime(18.5, h.fajr / 24, true),
      sunrise: angleTime(0.833, h.sunrise / 24, true),
      dhuhr: noon(h.dhuhr / 24),
      asr: asrTime(h.asr / 24),
      maghrib: angleTime(0.833, h.maghrib / 24, false),
    };
  }
  // The hours above are local solar time; minus longitude/15 gives UTC.
  const base = Date.UTC(y, m - 1, d);
  const ramadan = hijriParts(new Date(base + 12 * 3600e3)).month === 9;
  const out = {};
  for (const k of Object.keys(h)) out[k] = new Date(base + (h[k] - city.lng / 15) * 3600e3);
  out.isha = new Date(out.maghrib.getTime() + (ramadan ? 120 : 90) * 60e3);
  return out;
}

// The Saudi date now, as "YYYY-MM-DD".
export const saudiToday = (now = Date.now()) => new Date(now + TZ * 3600e3).toISOString().slice(0, 10);

// The prayer just past and the next one (Sunrise is shown but isn't a prayer).
export function around(city, now = Date.now()) {
  const day = saudiToday(now);
  const shift = n => new Date(Date.parse(day) + n * 864e5).toISOString().slice(0, 10);
  const list = [-1, 0, 1].flatMap(n => {
    const t = prayerTimes(shift(n), city);
    return PRAYERS.filter(p => !p.notPrayer).map(p => ({ p, at: t[p.id] }));
  });
  const nextIdx = list.findIndex(x => x.at.getTime() > now);
  return { prev: list[nextIdx - 1], next: list[nextIdx], today: prayerTimes(day, city) };
}

// Direction of the Kaaba from a city: degrees clockwise from north, and the distance in km.
export function qibla(city) {
  const φ1 = rad(city.lat);
  const φ2 = rad(MECCA.lat);
  const Δλ = rad(MECCA.lng - city.lng);
  const bearing = fix(deg(Math.atan2(Math.sin(Δλ), Math.cos(φ1) * Math.tan(φ2) - Math.sin(φ1) * Math.cos(Δλ))), 360);
  const a = Math.sin((φ2 - φ1) / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  const km = 6371 * 2 * Math.asin(Math.sqrt(a));
  return { bearing, km };
}
