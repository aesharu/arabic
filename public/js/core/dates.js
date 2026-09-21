// Dates are plain "YYYY-MM-DD" strings in local time. They sort and compare as strings,
// and all arithmetic goes through UTC so daylight-saving changes never shift a day.
const DAY_MS = 86400000;
const pad = n => String(n).padStart(2, "0");
const utc = key => {
  const [y, m, d] = key.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
};
const fromUtc = ms => {
  const d = new Date(ms);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
};

export function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export const diffDays = (a, b) => Math.round((utc(b) - utc(a)) / DAY_MS);
export const addDays = (key, n) => fromUtc(utc(key) + n * DAY_MS);
export const monthKey = key => key.slice(0, 7); // "YYYY-MM"
export const addMonths = (month, n) => {
  const [y, m] = month.split("-").map(Number);
  return fromUtc(Date.UTC(y, m - 1 + n, 1)).slice(0, 7);
};
export const daysInMonth = month => {
  const [y, m] = month.split("-").map(Number);
  return new Date(Date.UTC(y, m, 0)).getUTCDate();
};
// 0 = Monday … 6 = Sunday (weeks start on Monday, as in Ukraine)
export const weekdayMon = key => (new Date(utc(key)).getUTCDay() + 6) % 7;

export const format = (key, opts, loc = "en-GB") =>
  new Date(utc(key)).toLocaleDateString(loc, { timeZone: "UTC", ...opts });
export const longDate = (key, loc) => format(key, { weekday: "long", day: "numeric", month: "long", year: "numeric" }, loc);
export const shortDate = (key, loc) => format(key, { day: "numeric", month: "short", year: "numeric" }, loc);
