# Status — what's built, what's next

**Read this first in a new session** instead of re-reading the code. Keep it short; update it after every deploy.
Last updated: 21 Sept 2026. Live: https://arabic.aesdvi.workers.dev

## Who uses it

- **Volodymyr (student)**: learns Najdi, mostly on his computer. His account is the real progress.
- **Dima (teacher)**: his girlfriend, a Saudi native Najdi speaker, mostly on her **iPad** (also an iPhone). She has her own separate account, with every lesson open. She can do anything there, and it never touches his progress. She can also view his progress read-only. She's the one who can verify Najdi ("check with tutor" items).

## Done and live

- **Phase 1**: `public/` site, GitHub (aesharu/arabic), Cloudflare Worker `arabic`, D1 `arabic-db`, secret `SYNC_KEY`.
- **Phase 2 (vocabulary)**: `npm run vocab` builds `public/data/vocab.json` and the Anki CSVs from `NAJDI-PLAN.md` and `NAJDI-WORDS.md`. 1,038 entries, 691 flagged "check with tutor". Word list page with search in any language.
- **Phase 3 (printables)**: `#/print` has letter tracing, word writing, fold-and-test, phrase cards and a weekly tracker, all A4 with self-hosted fonts. *Missing: `npm run pdf`.*
- **Phase 4**: the Plan, Today (daily checklist), Calendar and Progress pages.
- **Cards** `#/cards`: Anki SM-2 scheduling, in both directions (recognise, then say). Decks open by stage. Syncs to the cloud.
- **Look**: Saudi green theme, a hand-drawn Najdi scene, Sadu weave, icons, page illustrations. The Today sky follows the theme: dark themes show the moon, light themes the sun, low at dawn and dusk.
- **Sun/moon button** (`#sky-toggle`, top-right of every page; in the top bar on iPad/iPhone): tap flips light ↔ dark (saudi ↔ saudi-dark, light ↔ dark).
- **iPhone/iPad**: at ≤860 px, a top bar, bottom tab bar and "More" sheet. Safe areas, home-screen icon.
- **Welcome screen, on every page load** (`core/welcome.js`, `css/welcome.css`):
  - Day sky 6:00–18:00, night otherwise.
  - Choose **Volodymyr · student** or **Dima · teacher**. The first time on a device, the name must be typed (Volodymyr/Володимир/فولوديمير or Dima/Діма/ديما), which signs in to cloud save.
  - Then a greeting and 5 s of oud and drum in maqam Hijaz (`core/music.js`, synthesised with no audio files; browsers need a tap before sound plays).
- **Profiles and cloud save**:
  - `POST /api/login {name}` returns a token (HMAC of the role with SYNC_KEY), stored in `najdi-logins`.
  - D1 row `main` = Volodymyr and row `dima` = Dima. Each token writes only its own row.
  - Dima can `GET ?who=student`, which powers the "See Volodymyr's progress" switch in her banner (read-only, `store.watch()`).
  - localStorage keys: `najdi-v2` (his) and `najdi-v2-dima` (hers). `najdi-profile` holds the current profile. "Switch profile" is in the menu.
  - The old SYNC_KEY still works as Volodymyr's key.

- **Dima's voice and corrections** (21 Sept — she said the computer voice is wrong: browser TTS reads formal Arabic, q not g):
  - **Record** page `#/record` (her profile only; replaces Letters in her iPad tab bar): record each word (MediaRecorder, ≤10 s), deck by deck, "not recorded yet" filter. Stored in D1 table `audio` (key = hash of the Arabic without vowel marks, `content.audioKey`). Server: only her token may upload/delete.
  - Every speaker button plays her recording when one exists (`core/speech.js` → `core/content.js`); otherwise the computer voice plays with a note "Computer voice — formal Arabic, not Najdi".
  - **✎ Correct this word** (Word list, Record page, either profile): Najdi, pronunciation, English, Ukrainian, MSA, and "this is correct Najdi" (removes the tutor flag). D1 table `edits`, laid over the plan's words at runtime (`content.apply`). NAJDI-PLAN.md is not changed — later, turn her corrections into proposed plan changes for Volodymyr to approve.
  - Not yet covered by her corrections: the Phrases/Today pages (they read `data/phrases.js` directly) and letter names.

- **Grammar** `#/grammar` (`data/grammar.js`, `views/grammar.js`): the plan's nine Part 5 patterns as lessons — explanation in four languages, examples to hear (her voice when recorded), "to her" forms marked, ⚠ flags kept, a 5-question quiz. `tests/grammar.test.mjs` checks every example against Part 5.

- **Weekly lessons** `#/lessons` (`data/weeks.js`, `views/lessons.js`), weeks 3–67, "This week's lesson" link on Today: the stage goal, that week's words from the plan (big topics split over 2–3 weeks; review weeks), a grammar lesson, a speaking task per stage, and a short conversation (weeks 3–10 so far). Conversation lines are Claude-written — each flagged, ✎-correctable (ids `d<week>x<line>`). `tests/weeks.test.mjs` checks weeks, topics, four languages and dialect traps.

## Next (in this order)

0. **Conversations for weeks 19–21 and 27–67** (weeks 3–18 and 22–26 are written; the Record page has a Conversations tab). Same rules: plan words, "to her" forms, every line flagged until Dima ticks it.
1. Tell Volodymyr which recordings/corrections exist; a script to export `edits` from D1 as proposed changes to NAJDI-PLAN.md.
2. **Prayer times and Qibla** (he asked on 21 Sept):
   - today's five prayers for Riyadh, Umm al-Qura method (Fajr 18.5°, Isha = Maghrib + 90 min, 120 in Ramadan), Asr standard;
   - the previous prayer and the next one with a countdown;
   - a compass arrow to Mecca (≈244° from Riyadh, ≈790 km);
   - on Today, plus a "next prayer" line on the welcome screen;
   - names in four languages with pronunciation.
3. Optional PIN for Volodymyr's sign-in (right now the name is the password; offered, not asked for yet).
4. `npm run pdf`: `scripts/print-pdf.mjs`, Playwright with the installed Chrome, waits for `body[data-print-ready]`, writes to `print/pdf/` (gitignored).
5. Progress page: cards answered per day, plus the words-known meter.
6. Calendar: arrow keys between days. Backup restore: ask for confirmation and show an inline message instead of `alert()`. Letters: make the chips real links.
7. `public/_headers`: security headers and CSP. Tests for `srs.js`, `cards.js`, `search.js`, `welcome.js` name matching and worker login.

## Waiting on Dima (native speaker)

- All 678 Stage 4–5 words in `NAJDI-WORDS.md`: a ✓ in the last column removes the flag. Check these first: أحضّر, أشغّل, أسكّر, أصوّر, سناب.
- UI wording:
  - Cards page: Show answer, Again / Hard / Good / Easy.
  - Welcome screen: منهو هنا؟, مهوب هذا الاسم, and معلّمة vs أبلة.
  - Teacher banner: تشوفين, تسوّينه.
  - Ukrainian vocative "Дімо".

## Decisions made

- The Saudi flag is **not** drawn as decoration (it carries the Shahada); its green is used instead.
- The ui-ux-pro-max suggestion (claymorphism, purple) was not followed; the Saudi identity stays.
- The name sign-in is convenience, not strong security: anyone who types "Volodymyr" can write his progress. The D1 `snapshots` table keeps one copy per day (his days as `YYYY-MM-DD`, hers as `dima:YYYY-MM-DD`).

## Working notes

- Card IDs are `<noteId>.r` / `.p`; note ID = FNV-1a of `"ar|en"`. Default 8 new cards a day; Dima's default is every deck open.
- Cloud merge: per card and card settings, the newest `mod` wins; per day, the version with more answers wins.
- Screenshots: serve `public/` with a small Node static server (Python's drops connections under 38 module preloads). The welcome screen covers the page unless `sessionStorage["najdi-welcomed"] = "reload"` is set first. `/api/*` only exists on Cloudflare, not locally.
- Before deploying, check desktop (1440), iPhone (390) and iPad (820), in light and dark.
