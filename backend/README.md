# Backend API — deploy on **Render**

This folder is the **only directory** Render needs for the Fastify API.

## GitHub → Render

### Option A — Blueprint (recommended)

Use the **`render.yaml`** file at the **repository root** (same repo). It sets `rootDir: backend` and defines the web service `sparkfi-api`.

1. Render → **New → Blueprint** → connect the GitHub repo.
2. Apply the blueprint; then open the service → **Environment** and fill every `sync: false` variable (see `.env.example`).

### Option B — Web Service (manual)

1. Render → **New → Web Service** → connect the same repo.
2. **Root Directory:** `backend`
3. **Build command:** `npm ci && npm run build`
4. **Start command:** `npm start`
5. **Health check path:** `/health`
6. Set environment variables from `.env.example` (Convex URL, secrets, `CORS_ORIGIN`, `PUBLIC_APP_URL`, etc.).

Render sets `PORT` automatically; the app listens on `0.0.0.0`.

See the repository root `README.md` for variable details and Vercel pairing.
