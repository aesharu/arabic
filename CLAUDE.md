# Najdi — my Arabic learning website

## Who I am and what this is

I'm Volodia, a Ukrainian speaker (English as my second language) learning **Najdi Arabic** — the spoken dialect of Riyadh and central Saudi Arabia — from zero. My goal is comfortable everyday conversation by the end of 2027, studying about 1–2 hours a day.

This project is my personal learning website: the tools I study with every day, hosted on Cloudflare so I can open it on my phone anywhere. I'm self-taught in code and work mostly through you, so **explain what you're doing in plain language before each step**, and tell me when something needs me to act (logins, accounts, clicking in a dashboard).

## Starting point

`najdi-script.html` in this folder is the first working piece: a single-file, mobile-first alphabet trainer.

- 28 letters in six shape-based groups (two study days each), a vowels tab, and a quiz
- Each letter has: positional forms, a Ukrainian sound equivalent, a Najdi example word, and Najdi pronunciation notes
- Tap-to-hear uses the browser's built-in speech (`speechSynthesis`, `ar-SA`)
- Progress is saved in `localStorage`
- Design: Najdi mud-brick palette with painted-door teal accent, light/dark themes, Noto Naskh Arabic + Alegreya Sans

Treat its design and content as the baseline. Don't redesign it unless I ask.

## Phase 1 — get it live (do this first, nothing else)

1. Set up the project: rename the file to `index.html`, add a `.gitignore` and a short `README.md`. Initialise git and make the first commit.
2. Help me create a GitHub repository and push to it. I'll do any login myself — tell me exactly what to click or run.
3. Deploy to Cloudflare as a static site. **Check Cloudflare's current documentation for the recommended way to host a static site** (Pages vs. Workers static assets) instead of assuming — this changes over time. Prefer the option where every push to GitHub redeploys automatically.
4. Give me the live URL and confirm it works on a phone: Arabic renders correctly, fonts load, tap-to-hear works, progress survives a page reload.

Stop after Phase 1 and show me what we have before building anything new.

## How to work with me

- One step at a time. Before running a command, say in one sentence what it does.
- Keep it simple: plain HTML/CSS/JS, no framework and no build step, until a feature genuinely needs one. If you think we need one, explain why and ask first.
- Never commit secrets, API keys or tokens. No accounts or payments without asking me.
- Mobile-first always — I'll use this mostly on my phone.
- When I report a bug, find the cause before changing code.

## Arabic content rules — important

- Everything targets **spoken Najdi**, not Modern Standard Arabic. When the two differ, show the Najdi form and pronunciation (e.g. ق = "g" in Najdi: قهوة = gahwa).
- **Don't invent Najdi content confidently.** If you're not sure a word, phrase or pronunciation is genuinely Najdi (and not Egyptian, Levantine or formal Arabic), mark it with a visible "check with tutor" flag in the data so I can verify it with a native speaker.
- Arabic text must always render right-to-left and use a proper Arabic font with fallbacks.

## Backlog — later, NOT now

Ideas for after Phase 1, in rough order. Don't start any of these without me asking:

- **Phrase deck** — spaced-repetition cards of real Najdi sentences with audio, not single words
- **Listening log** — track what I watched/listened to and for how long, with a running total of hours
- **Daily plan** — today's tasks based on where I am in the plan (script → core vocabulary → listening → speaking)
- **Sentence mining** — paste a line from a show or voice message, turn it into a card
- A custom domain
