# Saudi — my Arabic learning website

## Who I am and what this is

I'm Volodia, a Ukrainian speaker (English as my second language) learning **her spoken dialect** — **modern everyday Saudi Arabic**, the way young Saudis talk and the way Dima (from Hafar al-Batin) talks — from zero, to talk with her and only her. Saudis call it سعودي, not "Najdi" (Dima, 22 Sept 2026). Day 1 was **Monday 21 September 2026**; the plan runs 15 months to **31 December 2027**. My goal is comfortable everyday conversation, studying about 1–2 hours a day.

This project is my personal learning website: the tools I study with every day, hosted on Cloudflare. I study on my computer. My girlfriend **Dima** — a Saudi, native speaker; I'm learning Saudi Arabic for her — uses it on her **iPad** and iPhone with her own profile (see `STATUS.md`). Every page must work on all three. I'm self-taught in code and work mostly through you, so **explain what you're doing in plain language before each step**, and tell me when something needs me to act (logins, accounts, clicking in a dashboard).

## Sources of truth

- **`NAJDI-PLAN.md`** is the curriculum and the single source of truth for vocabulary and the roadmap. Never silently "fix" Arabic in it — propose the change and let me decide. Anything marked ⚠ there must show a "check with tutor" flag on the site.
- The site lives in `public/` (plain HTML/CSS/JS modules, no build step). See `README.md` for the structure.
- `npm test` checks dates and plan logic, that every Saudi word matches `NAJDI-PLAN.md`, and that nothing is missing a language. It must pass before every commit.

## LANGUAGES — ALWAYS, ON EVERY CHANGE

**Everything must ALWAYS be in both languages. Every time you change or add anything, write it in both languages below — never add or change text in only one.**

- **Interface text** (menus, buttons, instructions, notes): **English AND Saudi Arabic (the `najdi` key in the code).** My girlfriend reads English and Arabic and checks the site to help me; I learn Saudi through English. Texts live in `public/js/i18n/strings.js` (both side by side); content data uses `{ en, najdi }`. The Arabic interface runs right-to-left.
- **Every Arabic word, phrase and example**: **her Saudi Arabic (with pronunciation) AND English.**
- **Ukrainian and formal Arabic (MSA) meanings are gone** (23 Sept 2026, my decision): no `uk` and no `msa` anywhere on the site — not in the interface, not in the data, not in the tests. Never add either back. `NAJDI-PLAN.md` and `NAJDI-WORDS.md` still have a Ukrainian and an MSA column in their tables; `npm run vocab` reads past them and throws them away.
- **But the pronunciation is in Ukrainian letters as well** (23 Sept 2026, my decision — I tried it with Dima and it works far better than English spelling): under every Latin pronunciation the site shows the same sounds in Ukrainian, worked out by `public/js/core/ua.js` and locked down by `tests/ua.test.mjs`. It's an extra line, never a replacement, and only in my profile — Dima is the native speaker and doesn't need it.
  - **Every Arabic consonant has a Ukrainian letter of its own — no two may ever share one** (24 Sept 2026), or I'd learn to say them the same. ق = **ґ** · خ = **х**, ح = **ҳ** · ه = **г**, غ = **ғ** · س = **с**, ث = **ҫ**, ص = **сʹ** · ز = **з**, ذ = **ҙ**, ظ and ض = **ҙʹ** (one sound in Saudi) · ت = **т**, ط = **тʹ** · ع = **ъ**, ء = **ʼ** · ل before a consonant = **ль**. A tick (ʹ, U+02B9) after с т ҙ means heavy; a tail or a bar means the Arabic letter, not the Ukrainian one it grew from.
  - Only single codepoints the site's own subset font carries. **Never use a combining accent** (х̣, а̄, с̇): they are not in the subset, fall back to another font and break the line. `tests/ua.test.mjs` pins every letter; a headless check of `CSS.getPlatformFontsForNode` is how to prove a new one renders.
  - Vowel length is the one thing the Ukrainian line doesn't carry (Ukrainian has none) — the Latin line above shows it with ā ī ū ē ō.
  - **The key that explains this line is in Ukrainian too** (25 Sept 2026, my request): a pronunciation key like a dictionary's, at the front of the book and on the Letters page. It lives in `UA_KEY` (`public/js/core/ua.js`): every letter with `en` and `uk` descriptions and an example. That is the one place Ukrainian sentences belong — it explains how to read, it never translates a meaning.
  - Any single word's Ukrainian can be corrected in the ✎ form ("How to say it, in Ukrainian letters"); the correction wins over the worked-out one.
- **Double- and triple-check every translation:**
  1. Proofread each translation yourself — natural English, correct everyday Saudi (her dialect).
  2. Run `npm test` — it fails if either language is missing, if the Saudi text isn't in Arabic script, or if a Saudi word doesn't match `NAJDI-PLAN.md`.
  3. Tell me (in chat, not on the site) which translations you're unsure of, so she can check them. If a Saudi word itself is uncertain, use the "check with tutor" flag.
- **No behind-the-scenes notes on the site.** My girlfriend uses it too: never show who translated what, file names like NAJDI-PLAN.md, or notes addressed to me about the build. Study content only.

## The book (the `#/read` page)

The most important page: **«أقرا وأتكلم» — a book you turn page by page**, cover first, 118 pages (`public/js/data/book.js`, `views/book.js`, `css/book.css`). It goes: a pronunciation key · the 28 letters, one to a page, each with its four shapes and pictured words · the seven marks · 26 pictured word pages · then reading that grows — first sentences, whole days, her messages, and full pages at the end.

Rules it keeps, all checked by `tests/book.test.mjs`:
- **Five hundred words, no more** — and every word on a word page comes from the plan's own vocabulary (`public/data/vocab.json`), so none of it is invented Arabic.
- **Every letter has its own colour and keeps it through the whole book.** The numbers in `HUE` are worked out from the book's own text so that no two letters that ever touch share a colour, and no two letters that look alike (ب/ث, ج/ح) either. Change the words and the test will tell you to recolour (the working script is a DSATUR colouring of the adjacency graph).
- The marks are written through the first four parts and gone after that; the reading gets longer part by part and page by page.
- The old ladder of 140 texts still lives at **`#/texts`** ("More texts to read", `views/texts.js`, `data/read.js`).

## The words you need, and the voice files

**The four hundred words for talking to her** (`#/essentials`, in the "Learn to read" menu under the book): `data/essentials.js`, `views/essentials.js`, `tests/essentials.test.mjs`. Thirty-four groups, from hello and yes/no to the weather, the body, the road and the forms of a verb. Every word is from the plan's vocabulary or from her. **Two hundred and thirteen of them have a Saudi voice of their own**; the other 187 are listed in `VOICE_WAITING` (`data/voices.js`) and speak in the browser's voice until their file is made — speechgen gives a thousand characters to a visitor and then refuses the address, and that is where it stopped on 25 Sept 2026. The marked spelling each one needs is already kept, so they can be made the moment a voice is available. Tapping a word counts it as heard (`store.essentials.done`); there is a search box because four hundred is a lot to scroll.

Each word carries three spellings: `ar` (how it is really written), `said` (fully marked, and what the voice engine was given), `show` (the same, with ق back in place of گ).

**Marking a new word**: `scripts/vocalise.mjs` works the marks out from the plan's own pronunciation — `vocalise("زين", "zēn")` → `زَيْن` — and returns null rather than guessing when the Arabic and the Latin don't line up. The first hundred were marked by hand; of the next three hundred it marked 450 of 486 candidates and refused 36, which were done by hand. Never ship a word it refused without marking it yourself.

`tests/essentials.test.mjs` checks all of it — provenance, that the marks don't change the word, that no consonant is left bare, that ē is written ay and ō aw, that nothing ends in -ak, that the Arabic and the pronunciation are the same word, that every word with a voice has its file, and that the waiting list is exactly what the folder is missing.

## Najdi A1–B2 — his own flashcard deck (`/najdi/`)

**The first thing in the menu**, and his alone. The Anki app built for his Mac (`AnkiCardsTryOne/`, not in git) now also runs on the site at `public/najdi/` — same code, same FSRS scheduler, opened full screen with nothing of the site around it, and it works on the phone.

**The deck is not in this repository and is not a public file.** It is Eidetic's *Saudi Arabic* course, 1,744 words (A1–B2, 43 themes) and 6,976 recordings, licensed to one person: their terms allow him to use it on his own devices, not to republish it. So it lives in his own D1 database (`najdi_deck`, `najdi_media` — 231 MB) and `/api/najdi` hands it over **only to the student profile**: Dima's profile gets 403, no sign-in gets 401. Never serve any of it from `public/`, and never commit the `.apkg`.

- `GET /api/najdi/deck` — the notes, stored as nine text slices and joined without parsing.
- `GET /api/najdi/media/<file>` — one recording, cached for a year by the browser.
- `PUT` on both — the upload, from `scripts/najdi-deck.mjs` (signs in by name, resumable, never prints a key).
- Rebuild the deck: extract with `AnkiCardsTryOne/scripts/extract_apkg.py`, then `node scripts/najdi-deck.mjs <dir>`.

The page reads the site's own sign-in from `localStorage` (same domain) and then **sets itself up**: any device he is signed in on fetches the notes by itself (2.4 MB, once per device — never ask him to "get the deck"), and **each recording is fetched the first time he hears that word** and kept. Nothing big is ever downloaded, and it plays with no signal afterwards.

**The settings travel too** (`meta.settingsAt`, newest change wins) — new cards a day, card types, levels, voice, theme are one account's settings, not one device's. And **coming back to a device pulls** (`visibilitychange`), so picking up the iPad after the phone shows the same deck at the same place — never while a card is open, which would move the answer under his thumb.

**Starting over travels.** A merge only ever adds, so "Reset progress" and restoring a backup stamp `meta.resetAt`; a device seeing a newer stamp throws its own cards and reviews away. And every save carries `x-base-at` — the version it started from — so the server answers 409 if the other device has saved since, and the device looks first and saves again. Without that, a phone that hadn't caught up would hand back everything he had just reset on the Mac.

**Words on a narrow screen** open as a sheet over the list (`body.detail-open`), because below 900px the two columns stack and tapping a word used to throw him to the bottom of the page.

**His progress is in the database too** (`najdi_progress`, one gzipped row): which cards are due when, his stars and notes, the day's counters and the review log. `js/sync.js` pulls it when a device opens and pushes a few seconds after each answer and whenever the page is hidden. Two devices are **merged, not overwritten** — a card is taken from whichever side reviewed it last, reviews are kept from both, the day's counters take the higher. So the phone, the iPad and the Mac are one deck at one place. Never write copy saying the deck or the progress lives "only on this device" — that was the Mac app, and it is no longer true.

His **Cards tab** in the bottom bar opens this deck (`body.is-teacher` gets the site's own cards instead, and the menu keeps "The site's own cards" for both).

**Both voices, the way he listens**: the default voice setting is `both` — the man, then the woman. On the front of a card the word plays in both; when the answer is shown, the word plays in both again and then the example sentence in both. Each card also has ♂ and ♀ buttons to hear one speaker again, and `V` cycles both → ♂ → ♀.

`tests/najdi.test.mjs` keeps all of that honest: no deck file under `public/`, the 403 for anyone but him, the menu entry first and in both languages, hidden for Dima, and the both-voices behaviour.

## The sheets he prints (`npm run sheets`)

Five A4 booklets for learning to **write** the letters by hand, in `public/worksheets` — built by `scripts/sheets-html.mjs` and printed to PDF by the Chrome on this Mac (`scripts/sheets.mjs`), no library and no service:

1. **1-letters** — the 28 letters, one a sheet: the letter, its sound in English and in Ukrainian letters, its example word, the four shapes it wears, and about seventy letters to trace plus empty lines.
2. **2-in-a-word** — the same letters joined up, every shape line after line, then a real word from `vocab.json` with the letter at the start, in the middle and at the end.
3. **3-look-alike** — the six shape families (ب ت ث ن ي, ج ح خ, د ذ …): side by side, one line each, all of them mixed, then a row of bare bodies for him to put the dots on.
4. **4-marks** — the seven marks from the book, with the syllables and words that show them.
5. **5-practice-paper** — nothing but ruled lines.

**Every booklet is printed twice**: the colour one (the letter in ink, its dots picked out in green) and `-bw` for his **black-and-white printer**, where nothing he writes over may be solid — a solid letter prints the same black as his pen and he cannot see his own hand. On the grey sheets the lead letter is the same dashes drawn heavier.

Rules: **a sheet must hold a lot of writing** (he asked twice), and **nothing may overflow 297mm** — a page that runs long pushes its footer onto the next sheet, so `scripts/sheets.mjs` measures every page in the browser and refuses to print if one is too tall; it also reports how much space the emptiest sheet still has. `tests/sheets.test.mjs` checks the letters, both languages, the Ukrainian letters, that the mono set has nothing solid, and that all ten PDFs are there. The font is Noto Naskh Arabic, the site's own (his choice, 25 Sept 2026).

## Her words, in a Saudi voice

The ten words she taught him (`data/hers.js`) have audio of their own: `public/audio/saudi/*.mp3`, the ar-SA voice **Hamed** from speechgen.io's free page, 320 kbps / 48 kHz. `data/voices.js` maps the word to the file and keeps the exact text that was typed in; `core/speech.js` plays **her recording first, this second, the browser voice last**, and says "A Saudi voice — a computer, not Dima" when it plays, so neither of them can mistake it for her.

Making another one: **always type it in fully marked**, and spell it so that a formal reading lands on her sound — bare زين came out *zīn*, marked زَيْن comes out *zēn*. **ay** where she says ē, **aw** where she says ō, a sukun where the dialect drops the vowel (بْخَيْر), and a kasra on the final ك because he is speaking to her (شَخْبَارِكْ, -ik, never -ak). A word with **ق** in it should not be made this way at all: the engine says *qahwa*, she says *gahwa* — that one needs her voice.

## Status

**Read `STATUS.md` first**: what's built, what's next, open questions and decisions. Update it after every deploy.

## Phase 1 — get it live (done)

1. ✅ Project set up and restructured: `public/` site, `.gitignore`, `README.md`, git history.
2. ✅ GitHub repository: https://github.com/aesharu/arabic
3. ✅ Deployed to Cloudflare **Workers with static assets** as `arabic` → https://saudiarabic.online (also https://arabic.aesdvi.workers.dev). Deploy with `npx wrangler deploy` (Wrangler is logged in on this Mac). Auto-deploy on push is not connected yet — it needs the dashboard: Worker → Settings → Build → Connect.
4. ✅ Cloud save: D1 database `arabic-db` (binding `DB`), API in `worker/index.js`, secret `SYNC_KEY` set with `wrangler secret put` — never commit it. Sign-in is by typing the profile's name on the welcome screen (`/api/login`); "Log out" in the menu forgets it. My progress is row `main`, Dima's is row `dima`. Dima's recordings, corrections and suggestions are in D1 too (see `STATUS.md`).

Phases 2–4 of Part 9 of `NAJDI-PLAN.md` are built too (only `npm run pdf` is missing). Deploy in small parts as each is ready, so I can see it live.

## How to work with me

- One step at a time. Before running a command, say in one sentence what it does.
- Keep it simple: plain HTML/CSS/JS, no framework and no build step, until a feature genuinely needs one. If you think we need one, explain why and ask first.
- Never commit secrets, API keys or tokens. No accounts or payments without asking me.
- I study on my computer; my girlfriend uses an **iPhone and an iPad**. Every page must look good on desktop, iPhone (~390px) and iPad (~820px), in light and dark — check screenshots at those widths before deploying.
- Defaults: English interface and the Saudi theme (green and white, dark green when the computer is in dark mode).
- **My account is the real progress.** Nothing in Dima's profile may ever change my progress; she can view mine read-only. Address her in feminine Arabic forms.
- When I say "commit", "push" or "so I can see it": run `npm test`, commit, push, `npx wrangler deploy`, and update `STATUS.md`.
- When I report a bug, find the cause before changing code.

## Arabic content rules — important

- Everything targets **her spoken dialect: modern everyday Saudi** — the way she and young Saudis really talk today. **Saudi and only Saudi**: not formal Arabic (MSA), not old-fashioned village or Bedouin speech, and nothing from other countries — not Egyptian, Levantine, or Gulf/Kuwaiti/Iraqi (e.g. never the -ich ending أحبچ, وايد, چذي). Show the spoken form and pronunciation (e.g. ق = "g": قهوة = gahwa).
- "Your" is **-ak to him, -ik to her** (كيفك = kēfak / kēfik — same letter, different vowel). Lines she says to him use -ak.
- Everyday modern words first: مرة (very) over the older حيل, كثير (a lot) over واجد, مو (not) over مب, شلونك over وش لونك. The older forms may be taught for recognizing, marked as older.
- **Her words come first.** What she teaches me goes in `public/js/data/hers.js` (no flag — she's the native speaker). When her form differs from the plan, the site shows hers; propose the matching change to `NAJDI-PLAN.md` instead of editing it (22 Sept 2026: the plan now uses her شلونك, شخبارك, مو and سلام).
- **Don't invent Saudi content confidently.** If you're not sure a word, phrase or pronunciation is genuinely everyday Saudi (and not Egyptian, Levantine, Gulf or formal Arabic), mark it with a visible "check with tutor" flag in the data so I can verify it with a native speaker.
- Always keep the **"to her"** forms from the plan.
- Arabic text must always render right-to-left and use a proper Arabic font with fallbacks.

## Backlog — later, NOT now

Ideas for after Phase 1, in rough order. Don't start any of these without me asking:

- ✅ **Phrase deck** — built as the Cards page (spaced repetition, like Anki)
- **Listening log** — track what I watched/listened to and for how long, with a running total of hours
- ✅ **Daily plan** — built as the Today page and Calendar
- **Sentence mining** — paste a line from a show or voice message, turn it into a card
- ✅ A custom domain — saudiarabic.online
