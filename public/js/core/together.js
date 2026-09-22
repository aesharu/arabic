// "Together for 172 days, 3:39:15" — and, when you tap it, the same moment read as months and days.
// The months reading follows the calendar (a month is a month, not thirty days), so 3 April → 22 September
// is five months and nineteen days. No DOM here: tests/together.test.mjs checks it directly.

const DAY_MS = 86400000;

export function elapsed(since, now = Date.now()) {
  const start = new Date(since);
  const ms = Math.max(0, now - start.getTime());
  const days = Math.floor(ms / DAY_MS);

  // The same span read as calendar months: step whole months forward from the start until one step too far.
  // A month that hasn't got the start's day in it stops at its last day — one month after 31 January
  // is 28 February, not 3 March (which is what setMonth would give).
  const end = new Date(now);
  const stepTo = n => {
    const d = new Date(start.getFullYear(), start.getMonth() + n, 1, start.getHours(), start.getMinutes(), start.getSeconds(), start.getMilliseconds());
    const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    d.setDate(Math.min(start.getDate(), lastDay));
    return d;
  };
  let months = Math.max(0, (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()));
  while (months > 0 && stepTo(months) > end) months--;
  const anchor = stepTo(months);
  const restDays = Math.max(0, Math.floor((end - anchor) / DAY_MS));

  // The clock part is the same either way: what's left after the whole days.
  const rest = ms - days * DAY_MS;
  return {
    days,
    months,
    restDays,
    hours: Math.floor(rest / 3600000),
    minutes: Math.floor((rest % 3600000) / 60000),
    seconds: Math.floor((rest % 60000) / 1000),
  };
}

// 3:39:15
export const clock = ({ hours, minutes, seconds }) =>
  `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
