# CLAUDE.md

## Project Overview

This project is a luxury mobile-first wedding invitation website for Egor and Anna. It is built as a static invitation page with a small Node.js HTTP server so it can be deployed on Railway.

The first user-facing screen is a fullscreen ivory envelope. After the user taps the wax seal area, the envelope opens with a cinematic split animation: the top part moves upward, the lower part moves downward, a bride-and-groom portrait is revealed, gold particles appear, and soft generated piano music starts after the interaction.

The invitation then continues in this order:

1. Couple photo intro
2. Wedding date and countdown
3. Venue and route/map
4. Day program with a scroll-linked grape cluster animation moving along a wavy zigzag line
5. Details section that opens automatically while scrolling
6. Dress code with animated color swatches spreading from one central dot
7. Outfit examples using two side-by-side image grids
8. RSVP form
9. Final thank-you screen
10. Final cinematic vineyard banner

The visual direction is premium, cinematic, ivory, white, sage olive, and gold. The design is optimized primarily for mobile screens.

## Tech Stack

- HTML, CSS, and vanilla JavaScript in `Приглашение Егор и Анна.html`
- Static assets in `assets/`
- Node.js `http` server in `server.js`
- Railway deployment config in `railway.json`
- Nixpacks build on Railway
- No frontend framework and no runtime npm dependencies

The app intentionally avoids a heavy build pipeline. The main invitation is a single HTML file with embedded CSS and JavaScript.

## Important Files

- `Приглашение Егор и Анна.html`  
  Main production invitation page. This is what `/` serves in deployment.

- `Приглашение Егор и Анна (офлайн).html`  
  Offline copy of the main invitation. Keep it synced after editing the main HTML.

- `Просмотр приглашения.html`  
  Local preview wrapper.

- `server.js`  
  Minimal Node.js static file server. It serves `/` as `Приглашение Егор и Анна.html`, serves `assets/`, and exposes `/healthz`.

- `package.json`  
  Defines `npm start` and `npm run check`.

- `railway.json`  
  Railway deployment config. Uses Nixpacks and starts the app with `npm start`.

- `.railwayignore`  
  Excludes local-only files from Railway upload.

- `assets/envelope-top-seal.webp` and `assets/envelope-bottom-flap.webp`  
  Envelope images used for the opening screen.

- `assets/bride-groom-portrait.webp`  
  Main couple portrait revealed after opening the envelope.

- `assets/vineyard-banner.webp`  
  Landscape image used for venue/final visual sections.

- `assets/outfits-women-grid.webp` and `assets/outfits-men-grid.webp`  
  Current outfit example images shown side by side.

All large photos are served as WebP (quality ~82) for fast mobile decoding. The original heavy PNG versions were removed; they remain in git history (commit `d6d65aa`) if a source is ever needed.

## How It Works

### Server

`server.js` uses Node's built-in `http`, `fs`, and `path` modules. It does not use Express.

Runtime behavior:

- Reads port from `process.env.PORT`, falling back to `3000`.
- Serves `/` as `Приглашение Егор и Анна.html`.
- Serves static files from the project root.
- Blocks path traversal and `.git` access.
- Returns `ok` from `/healthz`.
- Sends HTML with `no-store` cache headers.
- Sends static assets with long-lived immutable cache headers.

### Frontend

All core frontend code is inside the main HTML file:

- CSS defines the mobile-first visual system, envelope layout, scroll sections, form UI, animations, and responsive constraints.
- JavaScript handles envelope opening, particles, reveal-on-scroll effects, countdown timer, details auto-opening, RSVP localStorage save, generated piano audio, and program grape motion.

Key frontend behaviors:

- Envelope opening is controlled by `openInvitation()`.
- Gold particles are created dynamically with `createParticles()`.
- Scroll reveal uses `IntersectionObserver`.
- Program grape motion uses SVG path methods:
  - `getTotalLength()`
  - `getPointAtLength()`
- Details auto-open via `IntersectionObserver` on `#detailsAccordion`.
- Dress-code swatches use CSS transitions from one central dot to a spread-out palette.
- RSVP stores form data in `localStorage` under `wedding-rsvp-egor-anna`.
- Piano music is generated with Web Audio API after user interaction.

## Local Development

Install/check project:

```bash
npm install
npm run check
```

Run locally:

```bash
npm start
```

Open:

```text
http://localhost:3000/
```

Health check:

```text
http://localhost:3000/healthz
```

Recommended HTML script sanity check:

```bash
node -e "const fs=require('fs'); for (const f of ['Приглашение Егор и Анна.html','Приглашение Егор и Анна (офлайн).html']) { const s=fs.readFileSync(f,'utf8'); const m=s.match(/<script>([\\s\\S]*)<\\/script>\\s*<\\/body>/); if(!m) throw new Error('script block not found: '+f); new Function(m[1]); } console.log('scripts:parse-ok')"
```

## Railway Deployment

Railway should detect this as a Node.js project via `package.json`.

Deployment flow:

1. Push the repository to GitHub.
2. Create a new Railway project from the GitHub repository.
3. Railway uses Nixpacks from `railway.json`.
4. Railway runs:

```bash
npm start
```

No manual port configuration is needed because `server.js` uses `process.env.PORT`.

## Editing Notes

- Keep the main HTML and offline HTML synced after changes:

```bash
cp "Приглашение Егор и Анна.html" "Приглашение Егор и Анна (офлайн).html"
```

- Avoid adding build tooling unless it is genuinely needed.
- Keep mobile layout first. Desktop is secondary.
- Do not remove `server.js`, `package.json`, or `railway.json`; Railway depends on them.
- If changing asset names, update all references in both HTML files.
- If changing the first screen, preserve the user-interaction requirement for audio playback. Browsers block autoplay without interaction.
- If changing RSVP behavior, remember it currently saves locally only and does not send data to a backend.

## Current Git Remote

```text
git@github.com:xumezzan/wedding_postamt.git
```

