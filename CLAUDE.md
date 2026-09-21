# Najdi — my Arabic learning website

## Who I am and what this is

I'm Volodia, a Ukrainian speaker (English as my second language) learning **Najdi Arabic** — the spoken dialect of Riyadh and central Saudi Arabia — from zero. Day 1 was **Monday 21 September 2026**; the plan runs 15 months to **31 December 2027**. My goal is comfortable everyday conversation, studying about 1–2 hours a day.

This project is my personal learning website: the tools I study with every day, hosted on Cloudflare. **I study on my computer**, so the site is built for a desktop screen first. I'm self-taught in code and work mostly through you, so **explain what you're doing in plain language before each step**, and tell me when something needs me to act (logins, accounts, clicking in a dashboard).

## Sources of truth

- **`NAJDI-PLAN.md`** is the curriculum and the single source of truth for vocabulary and the roadmap. Never silently "fix" Arabic in it — propose the change and let me decide. Anything marked ⚠ there must show a "check with tutor" flag on the site.
- The site lives in `public/` (plain HTML/CSS/JS modules, no build step). See `README.md` for the structure.
- `npm test` checks dates and plan logic, that every Najdi word matches `NAJDI-PLAN.md`, and that nothing is missing a language. It must pass before every commit.

## LANGUAGES — ALWAYS, ON EVERY CHANGE

**Everything must ALWAYS be translated. Every time you change or add anything, translate it into every language below — never add or change text in only one language.**

- **Interface text** (menus, buttons, instructions, notes): **English AND Ukrainian.** My girlfriend reads English and checks the site to help me; I read Ukrainian. Texts live in `public/js/i18n/strings.js` (both side by side); content data uses `{ en, uk }`.
- **Every Arabic word, phrase and example**: **Najdi Arabic (with pronunciation), MSA (formal Arabic), English AND Ukrainian** — four languages. MSA is shown as "recognise it, don't say it".
- **Double- and triple-check every translation:**
  1. Proofread each translation yourself — natural Ukrainian and English, correct Najdi and MSA.
  2. Run `npm test` — it fails if any language is missing, if Ukrainian isn't in Cyrillic or MSA isn't in Arabic script, or if a Najdi word doesn't match `NAJDI-PLAN.md`.
  3. MSA and Ukrainian lines you write are marked on the site as added by Claude, so she (a native speaker) can check them. If you're unsure of a translation, say so and flag it.

## Phase 1 — get it live (in progress)

1. ✅ Project set up and restructured: `public/` site, `.gitignore`, `README.md`, git history.
2. Create the GitHub repository **arabic** and push to it. I do any login myself — tell me exactly what to click or run.
3. Deploy to Cloudflare **Workers with static assets** (Cloudflare's current recommendation for new projects; checked 21 Sept 2026), connected to GitHub so every push redeploys automatically. `wrangler.jsonc` names the Worker `arabic`.
4. Give me the live URL and confirm it works on my computer: Arabic renders correctly, fonts load, tap-to-hear works, progress survives a page reload, both languages work.

Stop after Phase 1 and show me what we have before building anything new. After that, follow Part 9 of `NAJDI-PLAN.md` phase by phase, stopping after each.

## How to work with me

- One step at a time. Before running a command, say in one sentence what it does.
- Keep it simple: plain HTML/CSS/JS, no framework and no build step, until a feature genuinely needs one. If you think we need one, explain why and ask first.
- Never commit secrets, API keys or tokens. No accounts or payments without asking me.
- Desktop-first — I use this on my computer. It should still work in a narrow window.
- When I report a bug, find the cause before changing code.

## Arabic content rules — important

- Everything targets **spoken Najdi**, not Modern Standard Arabic. When the two differ, show the Najdi form and pronunciation (e.g. ق = "g" in Najdi: قهوة = gahwa). MSA appears only as a labelled extra.
- **Don't invent Najdi content confidently.** If you're not sure a word, phrase or pronunciation is genuinely Najdi (and not Egyptian, Levantine or formal Arabic), mark it with a visible "check with tutor" flag in the data so I can verify it with a native speaker.
- Always keep the **"to her"** forms from the plan.
- Arabic text must always render right-to-left and use a proper Arabic font with fallbacks.

## Backlog — later, NOT now

Ideas for after Phase 1, in rough order. Don't start any of these without me asking:

- **Phrase deck** — spaced-repetition cards of real Najdi sentences with audio, not single words
- **Listening log** — track what I watched/listened to and for how long, with a running total of hours
- ✅ **Daily plan** — built as the Today page and Calendar
- **Sentence mining** — paste a line from a show or voice message, turn it into a card
- A custom domain
