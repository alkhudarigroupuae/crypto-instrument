# Frontend — deploy on **Vercel**

This folder is the **only directory** Vercel needs for the web app.

## GitHub → Vercel

1. [Vercel](https://vercel.com) → **Add New → Project** → import the repo `alkhudarigroupuae/crypto-instrument`.
2. **Root Directory:** set to `frontend` (not the repo root).
3. **Environment variables** (Production / Preview as needed):

   | Name | Example |
   |------|---------|
   | `NEXT_PUBLIC_API_URL` | `https://your-api.onrender.com` (no trailing slash) |
   | `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | Optional |

4. Deploy. Vercel reads `vercel.json` in this folder for install/build commands.

See the repository root `README.md` for full Convex + API + CORS notes.
