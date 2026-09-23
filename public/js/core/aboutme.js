// "Talk about yourself": your details → your introduction in her dialect, your answers to the questions her family
// and friends will ask, and questions to ask her back. No DOM, so the tests use it too.
import { NAMES, CITIES, COUNTRIES, JOBS, LANGUAGES, HOBBIES, FOODS, MORE_QA, ASK_HER } from "../data/me.js";
import { spoken } from "../data/numbers.js";
import { diffDays, todayKey } from "./dates.js";
import { START } from "../config.js";

export const DEFAULT_ME = { name: "volodka", age: "", city: "", country: "ukraine", job: "computers", langs: ["uk", "en"], hobbies: [], brothers: 0, sisters: 0, food: "kabsa" };

const find = (list, id) => list.find(x => x.id === id);
const line = (ar, say, en) => ({ ar, say, en, check: true });
// After a vowel the article loses its a: fi as-saʿūdiyya → fi s-saʿūdiyya.
const afterVowel = say => say.replace(/^a([a-zʿḥṣṭẓḍ]{1,2}-)/, "$1");
const SMALL = { 3: ["ثلاث", "thalāth", "three"], 4: ["أربع", "arbaʿ", "four"], 5: ["خمس", "khams", "five"], 6: ["ست", "sitt", "six"], 7: ["سبع", "sabiʿ", "seven"], 8: ["ثمان", "thamān", "eight"], 9: ["تسع", "tisiʿ", "nine"], 10: ["عشر", "ʿashr", "ten"] };

// "X, Y and Z" in each language; Arabic joins every word after the first with و.
function joined(items) {
  return {
    ar: items.map((x, i) => (i ? "و" : "") + x.ar).join(" "),
    say: items.map((x, i) => (i ? "w-" : "") + x.say).join(" "),
    en: items.length > 1 ? `${items.slice(0, -1).map(x => x.en).join(", ")} and ${items.at(-1).en}` : items[0].en,
  };
}

function siblings(b, s) {
  const bro = b === 1 ? ["أخ واحد", "akh wāḥid", "one brother"] : b === 2 ? ["أخوين", "akhawēn", "two brothers"]
    : b > 2 ? [`${SMALL[b][0]} إخوان`, `${SMALL[b][1]} ikhwān`, `${SMALL[b][2]} brothers`] : null;
  const sis = s === 1 ? ["أخت وحدة", "ukht waḥda", "one sister"] : s === 2 ? ["أختين", "ukhtēn", "two sisters"]
    : s > 2 ? [`${SMALL[s][0]} خوات`, `${SMALL[s][1]} khawāt`, `${SMALL[s][2]} sisters`] : null;
  const parts = [bro, sis].filter(Boolean);
  if (!parts.length) return line("ما عندي إخوان.", "ma ʿindi ikhwān.", "I don't have any brothers or sisters.");
  return line(`عندي ${parts.map(p => p[0]).join(" و")}.`, `ʿindi ${parts.map(p => p[1]).join(" w-")}.`, `I have ${parts.map(p => p[2]).join(" and ")}.`);
}

function learning(today = todayKey()) {
  const m = Math.floor(Math.max(0, diffDays(START, today)) / 30.4);
  if (m < 1) return line("توني بديت أتعلم عربي.", "tawwni badēt atʿallam ʿarabi.", "I've only just started learning Arabic.");
  if (m === 1) return line("صار لي شهر أتعلم عربي.", "ṣār li shahr atʿallam ʿarabi.", "I've been learning Arabic for a month.");
  if (m === 2) return line("صار لي شهرين أتعلم عربي.", "ṣār li shahrēn atʿallam ʿarabi.", "I've been learning Arabic for two months.");
  if (m <= 10) return line(`صار لي ${SMALL[m][0]} شهور أتعلم عربي.`, `ṣār li ${SMALL[m][1]} shuhūr atʿallam ʿarabi.`, `I've been learning Arabic for ${m} months.`);
  const n = spoken(m);
  return line(`صار لي ${n.ar} شهر أتعلم عربي.`, `ṣār li ${n.say} shahr atʿallam ʿarabi.`, `I've been learning Arabic for ${m} months.`);
}

export function aboutMe(me = DEFAULT_ME, today) {
  const m = { ...DEFAULT_ME, ...me };
  const name = find(NAMES, m.name) ?? NAMES[0];
  const city = find(CITIES, m.city);
  const country = find(COUNTRIES, m.country) ?? COUNTRIES[0];
  const job = find(JOBS, m.job) ?? JOBS[0];
  const langs = LANGUAGES.filter(l => m.langs.includes(l.id));
  const hobbies = HOBBIES.filter(h => m.hobbies.includes(h.id));
  const food = find(FOODS, m.food);
  const age = Number.isInteger(+m.age) && +m.age >= 14 && +m.age <= 99 ? +m.age : null;

  const S = {
    name: line(`سلام، أنا ${name.ar}.`, `salām, ana ${name.say}.`, `Hi, I'm ${name.en}.`),
    myName: line(`اسمي ${name.ar}.`, `ismi ${name.say}.`, `My name is ${name.en}.`),
    age: age && line(`عمري ${spoken(age).ar}.`, `ʿumri ${spoken(age).say}.`, `I'm ${age}.`),
    from: city
      ? line(`أنا من أوكرانيا، من ${city.ar}.`, `ana min Ukrānya, min ${city.say}.`, `I'm from Ukraine, from ${city.en}.`)
      : line("أنا من أوكرانيا.", "ana min Ukrānya.", "I'm from Ukraine."),
    live: line(`ساكن في ${country.ar}.`, `sākin fi ${afterVowel(country.say)}.`, `I live in ${country.en}.`),
    job: line(`${job.ar}.`, `${job.say}.`, `${job.en}.`),
    langs: langs.length
      ? (l => line(`أتكلم ${l.ar}، وشوي عربي.`, `atkallam ${l.say}, w-shwayy ʿarabi.`, `I speak ${l.en}, and a little Arabic.`))(joined(langs))
      : line("أتكلم شوي عربي.", "atkallam shwayy ʿarabi.", "I speak a little Arabic."),
    hobbies: hobbies.length
      ? (h => line(`أحب ${h.ar}.`, `aḥibb ${h.say}.`, `I like ${h.en}.`))(joined(hobbies))
      : line("أحب أتعلم عربي!", "aḥibb atʿallam ʿarabi!", "I like learning Arabic!"),
    siblings: siblings(+m.brothers || 0, +m.sisters || 0),
    food: food && line(`أكثر أكلة أحبها ${food.ar}.`, `akthar akla aḥibbha ${afterVowel(food.say)}.`, `My favorite food is ${food.en}.`),
    learning: learning(today),
    najdi: line("أحب اللهجة السعودية، وأتعلمها كل يوم.", "aḥibb al-lahja s-saʿūdiyya, w-atʿallamha kill yōm.", "I love the Saudi dialect, and I study it every day."),
  };
  const Q = (ar, say, en) => line(ar, say, en);
  const qa = [
    [Q("وش اسمك؟", "wesh ismak?", "What's your name?"), S.myName],
    [Q("كم عمرك؟", "kam ʿumrak?", "How old are you?"), S.age],
    [Q("من وين انت؟", "min wēn int?", "Where are you from?"), S.from],
    [Q("وين ساكن؟", "wēn sākin?", "Where do you live?"), S.live],
    [Q("وش تشتغل؟", "wesh tishtaghil?", "What do you do for work?"), S.job],
    [Q("وش اللغات اللي تعرفها؟", "wesh al-lughāt illi tiʿrifha?", "What languages do you know?"), S.langs],
    [Q("عندك إخوان؟", "ʿindak ikhwān?", "Do you have brothers and sisters?"), S.siblings],
    [Q("وش تحب تسوي بوقت فراغك؟", "wesh tḥibb tsawwi b-wagt farāghak?", "What do you like doing in your free time?"), S.hobbies],
    [Q("وش أكثر أكلة تحبها؟", "wesh akthar akla tḥibbha?", "What's your favorite food?"), S.food],
    [Q("من متى تتعلم عربي؟", "min mita titʿallam ʿarabi?", "How long have you been learning Arabic?"), S.learning],
    ...MORE_QA.map(x => [line(...x.q), line(...x.a)]),
  ].filter(([, a]) => a).map(([q, a]) => ({ q, a }));
  const intro = [S.name, S.age, S.from, S.live, S.job, S.langs, S.hobbies, S.siblings, S.food, S.learning, S.najdi].filter(Boolean);
  return { intro, qa, askHer: ASK_HER };
}
