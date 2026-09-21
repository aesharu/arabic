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
- **Sun/moon button** (`#sky-toggle`, top-right of every page; in the top bar on iPad/iPhone): crescent + star like on the flags; tap flips light ↔ dark with a soft oud note (`music.chime`). Only two palettes now (Saudi green, Mud brick — `data-palette`); language buttons show 🇺🇸, 🇺🇦, a heart for Najdi, ض for MSA.
- **American English** everywhere (spelling, US date format `en-US`, 🇺🇸 flag). Round badges on the language buttons.
- **Cards look like the deck picture**: the study card is a paper card with gold crenellations and a tilted card behind it; the deck list is a grid of such cards with each deck's first word on its face. Colors follow the theme (`--art-*` tokens).
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
  - **Record** page `#/record` (her profile only; replaces Letters in her iPad tab bar): tap a word → the **voice studio** (`core/studio.js`, `core/audiotools.js`): record (≤10 s, live level, the mic is released after each take so the iPad plays loud), hear it at once, listen normal or slow, several takes, drag the gold edges to cut silence (auto-cut on arrival), Save or "Save, next word". Saved as a trimmed, loudness-evened 24 kHz WAV. Nothing uploads before Save. Words recorded during a visit stay in the list. Leaving with an unsaved take asks "Close without saving / Stay".
  - Stored in D1 `audio` (key = hash of the Arabic without vowel marks, `content.audioKey`); D1 `audio_prev` keeps the version before the last change → Undo after save/delete (toast), and "Earlier recording · Bring it back" in the studio (`POST /api/audio/<key> {action:"restore"}` swaps them). Audio URLs carry `?v=<time>` so a new take never plays the old one from cache. Server: only her token may upload/delete/restore.
  - **Slow playback everywhere**: tap a speaker twice within 5 s → 0.65× with natural pitch (`speech.say(text, {tap})`); the study card has a turtle button (key S).
  - Every speaker button plays her recording when one exists (`core/speech.js` → `core/content.js`); otherwise the computer voice plays with a note "Computer voice — formal Arabic, not Najdi".
  - **✎ Correct this word** (Word list, Record page, either profile): Najdi, pronunciation, English, Ukrainian, MSA, and "this is correct Najdi" (removes the tutor flag). D1 table `edits`, laid over the plan's words at runtime (`content.apply`). NAJDI-PLAN.md is not changed — later, turn her corrections into proposed plan changes for Volodymyr to approve.
  - Not yet covered by her corrections: the Phrases/Today pages (they read `data/phrases.js` directly) and letter names.

- **Grammar** `#/grammar` (`data/grammar.js`, `views/grammar.js`): the plan's nine Part 5 patterns as lessons — explanation in four languages, examples to hear (her voice when recorded), "to her" forms marked, ⚠ flags kept, a 5-question quiz. `tests/grammar.test.mjs` checks every example against Part 5.

- **Weekly lessons** `#/lessons` (`data/weeks.js`, `views/lessons.js`), weeks 3–67, "This week's lesson" link on Today: the stage goal, that week's words from the plan (big topics split over 2–3 weeks; review weeks), a grammar lesson, a speaking task per stage, and a short conversation (weeks 3–10 so far). Conversation lines are Claude-written — each flagged, ✎-correctable (ids `d<week>x<line>`). `tests/weeks.test.mjs` checks weeks, topics, four languages and dialect traps.

- **Saudi life** `#/saudi` (`data/saudi.js`, `core/prayer.js`, `views/saudi.js`): Hijri date (Umm al-Qura via Intl), prayer times + next-prayer countdown + Qibla compass for Riyadh, Buraidah, Ha'il, Sakaka, Arar, Tabuk (calculated in the browser; `tests/saudi.test.mjs` checks Riyadh), the year's occasions, 19 culture stories (region tags all / Najd / north) with words to hear (flagged unless in the plan), 15 facts.

- **Edit mode + Suggestions** (`core/editmode.js`, `core/editor.js`, `views/review.js`): the **Edit** button is under the sun/moon on the computer and in the top bar on iPad/iPhone (turns gold, reads "Done"). While on, everything editable is tinted gold (`[data-editable]`, marked from `i18n.sourceOf`), words/lines get a dashed gold outline. Tap any text — every `t()` / `tx()` output remembers its source while editing; words, conversation lines, grammar examples and Saudi words open the word editor (`data-edit` / `data-edit-id`), which also shows the word's voice (listen, slow, and for Dima "Record" → studio). Overrides: `s.<string key>`, `x.<fnv of English>`, or the item id, in D1 `edits`. Dima's saves go to D1 `suggestions` (pending; she sees them already); Volodymyr approves/rejects on `#/review` (badge count in the menu); his own edits go live directly. Every save shows a toast with **Undo** (hers: withdraw; his: back to the previous value). `#/review` also lists the last 40 decided (Approved / Not accepted) from `/api/content` `history`.
- **Log out** (menu, next to Switch profile; `welcome.logOut`): sends unsaved progress, forgets both sign-ins and cloud keys on this device, shows the welcome screen (name must be typed again). Progress stays in the cloud and on the device.
- **Fixed 21 Sept**: Progress page "today" marker was positioned against the whole window (`.stage-bar` had no `position: relative`) → a line down the left edge of the screen.

## Next (in this order)

0. **Conversations for weeks 19–21 and 27–67** (weeks 3–18 and 22–26 are written; the Record page has a Conversations tab). Same rules: plan words, "to her" forms, every line flagged until Dima ticks it.
1. Tell Volodymyr which recordings/corrections exist; a script to export `edits` from D1 as proposed changes to NAJDI-PLAN.md.
2. Next prayer + fact of the day on Today and the welcome screen. (Maybe: recording from the Word list / lesson pages directly — for now via Edit → tap a word → Record.) Make the Phrases/Today phrase items and letter names editable in edit mode too (they use data/phrases.js / letters.js directly).
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
  - Studio/slow wording: شوي شوي (Slow), شيليه (Discard), رجّعيه (Bring it back), اللي انحسمت (Decided), خليني هنا (Stay).

## Decisions made

- The Saudi flag is **not** drawn as decoration (it carries the Shahada); its green is used instead.
- The ui-ux-pro-max suggestion (claymorphism, purple) was not followed; the Saudi identity stays.
- The name sign-in is convenience, not strong security: anyone who types "Volodymyr" can write his progress. The D1 `snapshots` table keeps one copy per day (his days as `YYYY-MM-DD`, hers as `dima:YYYY-MM-DD`).

## Working notes

- Card IDs are `<noteId>.r` / `.p`; note ID = FNV-1a of `"ar|en"`. Default 8 new cards a day; Dima's default is every deck open.
- Cloud merge: per card and card settings, the newest `mod` wins; per day, the version with more answers wins.
- Screenshots: serve `public/` with a small Node static server (Python's drops connections under 38 module preloads). The welcome screen covers the page unless `sessionStorage["najdi-welcomed"] = "reload"` is set first. For `/api/*` locally: `npx wrangler dev --port 8788` (local D1, `.dev.vars` has a test SYNC_KEY, gitignored). Headless Chrome with `--use-fake-device-for-media-stream --use-fake-ui-for-media-stream` tests the studio.
- Before deploying, check desktop (1440), iPhone (390) and iPad (820), in light and dark.
