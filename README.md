# SparkFi Platform

Production-oriented scaffold: **Next.js 14** (Vercel) + **Fastify** API (Render) + **Convex** (data). Features include email/password auth, **TOTP 2FA** (encrypted secrets), JWT sessions with 2FA step-up, wallet connect (wagmi/viem), and a lending/borrow dashboard backed by Convex.

## Repository layout

| Path | Role |
|------|------|
| `frontend/` | Next.js App Router, Tailwind, Framer Motion, wagmi |
| `backend/` | Fastify REST API, bcrypt, speakeasy, rate limits |
| `convex/` | Schema + queries/mutations (guarded by `BACKEND_SECRET`) |

## Prerequisites

- Node.js 20+
- Convex account (`npm i -g convex` or use `npx`)
- (Optional) WalletConnect Project ID for mobile wallets

## 1. Convex

```bash
cd /path/to/bank
npm install
npx convex dev
```

1. Log in and link/create a deployment when prompted.
2. In the **Convex dashboard → Settings → Environment variables**, add:
   - `BACKEND_SECRET` — long random string (must match the API server).
3. After `convex dev` runs, copy the deployment URL (`https://….convex.cloud`).

Convex will regenerate `convex/_generated/*`. Commit those after first successful `convex dev`, or regenerate in CI before deploy.

## 2. API server (`backend/`)

```bash
cd backend
cp .env.example .env
# Fill CONVEX_URL, BACKEND_SECRET (same as Convex), JWT_SECRET, TOTP_ENCRYPTION_KEY
# Generate TOTP key: openssl rand -hex 32
npm install
npm run dev
```

- **Production:** `npm run build && npm start` (listens on `PORT`, default `4000`).
- Set `CORS_ORIGIN` to your Vercel URL(s), comma-separated.
- Set `PUBLIC_APP_URL` to the public frontend URL (email verification links).

## 3. Frontend (`frontend/`)

```bash
cd frontend
cp .env.example .env.local
# NEXT_PUBLIC_API_URL=http://localhost:4000
npm install
npm run dev
```

Deploy to Vercel with **Root Directory** = `frontend` and `NEXT_PUBLIC_API_URL` pointing at your Render API URL (`https://…`).

## Deploy: Vercel (frontend) + Render (API)

Order matters: deploy the API first so you have a public base URL for `NEXT_PUBLIC_API_URL` and for `CORS_ORIGIN` / `PUBLIC_APP_URL`.

### A) Convex (if not already in production)

1. `npx convex deploy` (or configure production deployment in the Convex dashboard).
2. In **Convex → Settings → Environment variables**, set `BACKEND_SECRET` to a long random string (same value you will use on Render).

### B) Render — Fastify API (`backend/`)

1. In [Render](https://render.com), **New → Blueprint** (point at this repo) or **New → Web Service** with:
   - **Root Directory:** `backend`
   - **Build:** `npm ci && npm run build`
   - **Start:** `npm start`
   - **Health check path:** `/health`
2. **Environment variables** (see `backend/.env.example`):

   | Variable | Notes |
   |----------|--------|
   | `CONVEX_URL` | Production Convex URL (`https://….convex.cloud`) |
   | `BACKEND_SECRET` | Must match Convex `BACKEND_SECRET` |
   | `JWT_SECRET` | Strong random secret for access tokens |
   | `TOTP_ENCRYPTION_KEY` | 64 hex chars (`openssl rand -hex 32`) |
   | `CORS_ORIGIN` | Your Vercel origin(s), comma-separated, no trailing slash (e.g. `https://myapp.vercel.app`). Add preview URLs if you use them. |
   | `PUBLIC_APP_URL` | Public frontend URL (same as production Vercel URL) for email/verify links |
   | `NODE_ENV` | `production` (Blueprint sets this) |

3. After deploy, copy the service URL, e.g. `https://sparkfi-api.onrender.com`.

### C) Vercel — Next.js (`frontend/`)

1. [Vercel](https://vercel.com) → **Add New → Project** → import this GitHub repo.
2. **Root Directory:** `frontend`
3. **Environment variables:**

   | Variable | Value |
   |----------|--------|
   | `NEXT_PUBLIC_API_URL` | `https://<your-render-service>.onrender.com` (no trailing slash) |
   | `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | Optional; from [WalletConnect Cloud](https://cloud.walletconnect.com) |

4. Deploy. If the API was already running, update **Render** `CORS_ORIGIN` and `PUBLIC_APP_URL` to your final Vercel production domain and redeploy the API.

### D) Smoke test

- Open the Vercel site; register/login should call the Render API (`NEXT_PUBLIC_API_URL`).
- `GET https://<api>/health` should return `{"ok":true}`.

## Security notes

- Every Convex function that touches user data requires `backendSecret === process.env.BACKEND_SECRET`. **Never** expose `BACKEND_SECRET` or `JWT_SECRET` to the browser.
- TOTP seeds are stored **encrypted** (AES-256-GCM) using `TOTP_ENCRYPTION_KEY`.
- Passwords are hashed with **bcrypt**.
- Use **HTTPS** everywhere in production; enforce HSTS on your edge host.
- Rate limiting is applied globally on the API; tighten `/auth/*` further if you see abuse.

## API summary

| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/register` | Create user, return QR + email verify link |
| POST | `/auth/verify-registration` | Confirm TOTP, enable 2FA |
| POST | `/auth/login` | Password check → `tempToken` |
| POST | `/auth/verify-2fa` | OTP + `tempToken` → `accessToken` |
| GET | `/auth/verify-email?token=` | Mark email verified |
| GET | `/user/profile` | Bearer JWT — profile, balances, positions, tx, audit |
| POST | `/deposit` | Bearer — mock deposit |
| POST | `/borrow` | Bearer — mock borrow vs ETH collateral |
| GET | `/positions` | Bearer — positions + balances |
| GET | `/health` | Liveness |

## Regenerating Convex codegen

If `_generated` is missing or out of date:

```bash
npx convex codegen
# or
npx convex dev
```

On Windows, if codegen fails with a temp-directory filesystem warning, set `CONVEX_TMPDIR` to a folder on the same drive as the project.

## License

Proprietary — configure per your organization.
