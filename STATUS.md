# Status — what's built, what's next

Read this first in a new session, instead of re-reading the code. Keep it short and update it after every deploy.
Last updated: 21 Sept 2026 (commit `22bd8a4`).

## Done and live (https://arabic.aesdvi.workers.dev)

- **Phase 1** — site in `public/`, GitHub, Cloudflare Worker `arabic`, cloud save (D1 `arabic-db`, secret `SYNC_KEY`).
- **Phase 2** — vocabulary: `npm run vocab` builds `public/data/vocab.json` + one Anki CSV per deck from `NAJDI-PLAN.md` and `NAJDI-WORDS.md`. 1,038 entries, 691 flagged "check with tutor".
- **Phase 3** — printables page `#/print` (letter tracing, word writing, fold-and-test, phrase cards, weekly tracker), A4, self-hosted fonts. *Missing: `npm run pdf`.*
- **Phase 4** — Plan page, Today page (daily checklist), Calendar, Progress.
- **Backlog "phrase deck"** — built as **Cards** `#/cards`: Anki SM-2 scheduling, both directions (recognise → say), decks open by stage, syncs to the cloud.
- **Look** — Saudi green theme, hand-drawn Najdi scene (sky follows the clock), Sadu weave, icons, page illustrations.
- **iPhone/iPad** — top bar + bottom tab bar + "More" sheet at ≤860px, safe areas, home-screen icon.

- **Welcome screen** (every page load, `core/welcome.js`, `css/welcome.css`): day sky 6:00–18:00, night otherwise. Choose **Volodymyr · student** or **Dima · teacher**; Dima types her name (Dima/Діма/ديما) the first time on a device. Then greeting + 5 s of oud and drum in maqam Hijaz (`core/music.js`, synthesised — no audio files; sound needs a tap, browsers block it before).
- **Teacher profile** (`najdi-profile` in localStorage): read-only — nothing she does is saved or pushed; her device pulls his progress from the cloud every 5 min (needs the sync key once, Calendar → Your data). "Switch profile" in the menu.
- **Sky follows the theme** on Today: dark theme = night with moon, light = sun.

## In progress

- **Prayer times and Qibla** (asked 21 Sept): today's five prayers for Riyadh (Umm al-Qura method), previous/next prayer with countdown, direction of Mecca.

## To do (in this order)

1. `npm run pdf` — `scripts/print-pdf.mjs`, Playwright + installed Chrome, waits for `body[data-print-ready]`, writes `print/pdf/` (gitignored).
2. Progress page: cards answered per day + words-known meter.
3. Calendar: arrow keys between days (roving tabindex).
4. Backup restore: confirm first, inline message instead of `alert()`.
5. Letters: group chips as real links.
6. `public/_headers`: security headers + CSP.
7. Tests for `srs.js`, `cards.js`, `search.js`; a test that `index.html` preloads every module.

## Waiting on a native speaker

- All 678 Stage 4–5 words in `NAJDI-WORDS.md` (tick ✓ in the last column to remove the flag). First to check: أحضّر, أشغّل, أسكّر, أصوّر, and whether سناب is what people say for Snapchat.
- Najdi/MSA wording of the Cards page (Show answer, Again/Hard/Good/Easy) and the welcome screen (منهو هنا؟, مهوب هذا الاسم, معلّمة vs أبلة).

## Decisions made

- The Saudi flag is **not** drawn as decoration (it carries the Shahada); its green is used instead.
- The ui-ux-pro-max suggestion (claymorphism, purple) was not followed; the Saudi identity stays.
- The welcome "login" is a friendly gate, not security — anyone can read the name in the code. Real privacy would need an account system (ask first).

## Key facts

- Card IDs `<noteId>.r` / `.p`; note ID = FNV-1a of `"ar|en"`. New cards/day default 8.
- Cloud merge: per card and card settings, newest `mod` wins; per day, more answers wins.
- Local server for screenshots: any static server on `public/` (Python's drops connections under 35 module preloads; use a Node one).
