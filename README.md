# Najdi — spoken Riyadh Arabic

Volodia's study site for learning Najdi Arabic in 15 months (21 Sept 2026 → 31 Dec 2027): today's tasks, a calendar of the whole plan, an alphabet trainer, reading practice and phrases. The interface is in English and Ukrainian; every Arabic word is shown in Najdi, formal Arabic (MSA), English and Ukrainian.

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
tests/                  checks for dates/plan logic, translations, and content vs NAJDI-PLAN.md
wrangler.jsonc          Cloudflare Workers config (static assets from ./public)
```

No framework and no build step: plain HTML, CSS and JavaScript modules.

## Run it on your computer

```sh
npm run dev      # then open http://localhost:8000
npm test         # all checks must pass before every commit
```

## Deploy

Every push to `main` on GitHub redeploys the site through Cloudflare Workers Builds.

## Content rules

- Najdi only, never invented: anything not verified carries a visible "check with tutor" flag.
- Every word and phrase has Najdi (Arabic + pronunciation), MSA, English and Ukrainian. Every interface text has English and Ukrainian. `npm test` fails if any is missing.
