# Najdi — spoken Riyadh Arabic

Volodia's study site for learning Najdi Arabic in 15 months (21 Sept 2026 → 31 Dec 2027): today's tasks, a calendar of the whole plan, an alphabet trainer, reading practice and phrases. The interface is in English, Ukrainian, Najdi Arabic and formal Arabic (MSA); every Arabic word is shown in Najdi, MSA, English and Ukrainian.

The curriculum and all Najdi vocabulary come from [`NAJDI-PLAN.md`](NAJDI-PLAN.md).

## Structure

```
public/                 the website — Cloudflare serves this folder as-is
  index.html            app shell: sidebar + page area
  css/                  tokens (colours, themes) · base (layout) · components
  js/
    main.js             starts the app, sidebar, language and theme switches
    config.js           start date, finish date, daily goal
    core/               router, saved progress, dates, speech, translations, schedule logic
    data/               letters, vowels, words, phrases, plan — the content
    i18n/strings.js     every interface text in English and Ukrainian
    views/              one file per page
worker/index.js         the only server code: /api/progress saves progress to the D1 database
scripts/build-vocab.mjs npm run vocab — builds public/data/vocab.json and the Anki decks from NAJDI-PLAN.md
data/                   MSA and Ukrainian meanings for the plan's vocabulary
tests/                  checks for dates/plan logic, translations, vocabulary and content vs NAJDI-PLAN.md
wrangler.jsonc          Cloudflare Workers config (static assets from ./public, D1 binding)
```

No framework and no build step: plain HTML, CSS and JavaScript modules.

## Run it on your computer

```sh
npm run dev      # then open http://localhost:8000
npm test         # all checks must pass before every commit
```

## Deploy

```sh
npm test && npx wrangler deploy
```

The site is https://arabic.aesdvi.workers.dev. Progress is saved in the browser and, once a computer is connected with the cloud-save key (Calendar → Your data), in the D1 database `arabic-db`. The key is the Worker secret `SYNC_KEY`.

## Content rules

- Najdi only, never invented: anything not verified carries a visible "check with tutor" flag.
- Every word and phrase has Najdi (Arabic + pronunciation), MSA, English and Ukrainian. Every interface text has English and Ukrainian. `npm test` fails if any is missing.
