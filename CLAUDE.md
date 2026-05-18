# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install      # Install dependencies
npm start        # Run the server (node server.js) on port 3000
```

There is no build step, test suite, or linter configured.

## Architecture

This is a minimal Arabic-language food-ordering web app ("طلبات مهاب"). It has two layers:

**Backend — `server.js`**
Single Express file. Initializes Firebase Admin SDK using `firebase-admin.json` (service account credentials), connects to Firestore collection `orders`, and exposes three REST endpoints:
- `POST /api/order` — create a new order (status auto-set to `"قيد المراجعة"`)
- `GET /api/orders` — list all orders, newest first
- `POST /api/order/:id/status` — update an order's status field

**Frontend — `public/`**
Static files served directly by Express (`express.static`). No framework or bundler.
- `index.html` — customer-facing order form; POSTs to `/api/order`
- `admin.html` — admin dashboard; fetches and renders all orders from `/api/orders`; links to the status-update endpoint but has no UI for it yet
- `styles.css` — shared styles (only linked by `admin.html`)

**Deployment**
Hosted on Render.com. `render.yaml` defines the service: `npm install` build, `node server.js` start, `NODE_ENV=production`. `firebase-admin.json` at the repo root is loaded at runtime as the Firebase service account — it must be present for the server to start.
