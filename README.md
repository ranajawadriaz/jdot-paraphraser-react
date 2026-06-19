# Jdot Paraphraser

A fast, free, open-source paraphrasing tool. Paste any text, pick a writing style, and get a rewrite that keeps the original meaning. Powered by [Groq](https://groq.com) and Llama 3.3.

![Tech](https://img.shields.io/badge/Vite-React-blue) ![UI](https://img.shields.io/badge/UI-Material%20UI-007FFF) ![License](https://img.shields.io/badge/license-MIT-green)

## Features

- ✍️ Rewrite text in six styles: Standard, Fluent, Formal, Academic, Simple, Creative
- 🌗 Light & dark mode
- 📋 One-click copy, word & character counts
- 📱 Fully responsive — no awkward page scroll, text scrolls inside the editors
- 🔒 API key stays on the server — safe to deploy and open source

## Tech stack

- [Vite](https://vitejs.dev/) + [React](https://react.dev/) + TypeScript
- [Material UI](https://mui.com/) (Emotion)
- [Groq SDK](https://github.com/groq/groq-typescript) (`llama-3.3-70b-versatile`)
- A serverless function (`api/paraphrase.ts`) that keeps your API key secret

## How it works

The browser never sees your Groq API key. The frontend calls a small backend
endpoint (`/api/paraphrase`), which runs server-side and talks to Groq using
`GROQ_API_KEY`. In production this is a Vercel Serverless Function; during local
development the same handler is served by a small Vite middleware, so
`npm run dev` works end to end.

## Getting started

Requires [Node.js](https://nodejs.org/) 18+.

```bash
# 1. Install dependencies
npm install

# 2. Add your Groq API key (get one free at https://console.groq.com/keys)
cp .env.example .env
# then edit .env and set GROQ_API_KEY=...

# 3. Start the dev server
npm run dev
```

Open http://localhost:8080.

## Deploying to Vercel

1. Push this repo to GitHub and import it into [Vercel](https://vercel.com/). It is
   auto-detected as a Vite app — no build settings to change.
2. In your Vercel project, go to **Settings → Environment Variables** and add:
   - **Key:** `GROQ_API_KEY`
   - **Value:** your Groq API key
   - **Environments:** Production, Preview, Development
3. Click **Save**, then **Deploy** (or redeploy if it already deployed).

Because the key is read only inside `api/paraphrase.ts` on the server, it is never
included in the public JavaScript bundle.

## Scripts

| Command           | Description                         |
| ----------------- | ----------------------------------- |
| `npm run dev`     | Start the local dev server          |
| `npm run build`   | Build for production                |
| `npm run preview` | Preview the production build        |
| `npm run lint`    | Run ESLint                          |

## Project structure

```
api/paraphrase.ts        Serverless endpoint that calls Groq (key stays server-side)
src/components/          Header + Paraphraser UI
src/pages/              Index (app) and NotFound
src/services/           Frontend client for /api/paraphrase
src/theme.ts            Material UI light/dark theme
```

## License

[MIT](LICENSE) — free to use, modify, and share.
