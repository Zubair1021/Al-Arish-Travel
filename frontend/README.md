# Alarish Tarvels — Frontend

React 19 + Vite single-page app for the public website and the admin portal.

## Quick start

```bash
npm install
npm run dev
```

The dev server runs on http://localhost:5173 and proxies all `/api/*` requests
to the backend on http://localhost:5000 (see `vite.config.js`).

Make sure the backend is running (`cd ../backend && npm run dev`) before you
sign in to the admin portal.

## Environment variables

A `.env` file is **optional for local development** — the app works out of the
box because the Vite proxy forwards `/api` to `localhost:5000`.

You only need a `.env` when:

- the backend is hosted on a different origin (production / staging), or
- you want to point the dev frontend at a remote backend.

To configure it:

```bash
cp .env.example .env
```

Then edit `.env`:

```bash
# Production example
VITE_API_BASE=https://api.alarish-tarvels.com/api
```

Restart `npm run dev` after editing.

All Vite client variables must start with `VITE_`. Anything else is ignored
by the bundler.

## Scripts

| Command          | What it does                                      |
| ---------------- | ------------------------------------------------- |
| `npm run dev`    | Start the Vite dev server with HMR                |
| `npm run build`  | Build the production bundle into `dist/`         |
| `npm run preview`| Serve the built `dist/` for a final smoke check   |
| `npm run lint`   | Run ESLint on the source                          |

## Project structure

```
src/
  admin/             Admin portal (routes mounted under /admin)
  api/               Centralised fetch client + per-resource helpers
  assets/            Logos, hero images, package presets
  components/        Public site components (navbar, footer, packages…)
    ui/              Reusable UI primitives (Select, etc.)
  context/           React contexts (Settings, Packages, Toast)
  pages/             Public site pages (Home, Packages, Hajj, Contact…)
  utils/             Small helpers (e.g. Hajj year)
```

## Admin portal

- URL: http://localhost:5173/admin
- Seeded credentials (created by the backend on first start):
  - **Email**: `uzmanadmin@gmail.com`
  - **Password**: `admin@12345`

Change the password from **Settings** once you log in.
