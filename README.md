# হাঁড়ির স্বাদ — Harir Shad

An e-commerce web app for Harir Shad, a Bengali dairy brand (দই / doi). Built with a
Next.js (App Router) frontend and an Express + MongoDB API.

## Stack

- **Frontend:** Next.js 15+ (App Router), TypeScript, Tailwind CSS, Framer Motion, Sonner toasts
- **Backend:** Express, Mongoose, TypeScript, `tsx` for dev/watch
- **Storage:** MongoDB (data), Cloudinary (story videos), ImgBB (product images)
- **Payments:** SSLCommerz (sandbox/live via `IS_LIVE`)

## Getting Started

Prerequisites: Node.js 20+, a running MongoDB instance, and API keys (see below).

### 1. Backend API

```bash
cd backend
cp .env.example .env   # or create .env (see Environment Variables)
npm install
npm run dev            # tsx watch → http://localhost:5000
```

Seed the admin user (optional, run once):

```bash
npm run seed
```

### 2. Frontend

```bash
npm install
npm run dev            # → http://localhost:3000
```

The frontend calls the API at `NEXT_PUBLIC_API_URL` (default `http://localhost:5000`).

### Checks

```bash
npm run lint && npm run typecheck   # frontend
cd backend && npm run typecheck     # backend
```

## Environment Variables

### Backend (`backend/.env`)

| Variable | Default | Notes |
| --- | --- | --- |
| `PORT` | `5000` | API port |
| `MONGODB_URI` | — | **required** MongoDB connection string |
| `JWT_SECRET` | — | **required**, min 8 chars |
| `AUTH_COOKIE_NAME` | `hs_token` | HTTP-only auth cookie name |
| `AUTH_COOKIE_SECURE` | `false` | Set `true` in production (HTTPS) |
| `AUTH_COOKIE_SAME_SITE` | `lax` | `lax`, `strict`, or `none` |
| `IMGBB_API_KEY` | `""` | Product image uploads |
| `STORY_VIDEO_MAX_MB` | `100` | Max story video upload size |
| `CLOUDINARY_CLOUD_NAME` | `""` | Story video uploads (Cloudinary) |
| `CLOUDINARY_API_KEY` | `""` | Story video uploads |
| `CLOUDINARY_API_SECRET` | `""` | Story video uploads |
| `IS_LIVE` | `false` | Live vs sandbox SSLCommerz |
| `SSLCOMMERZ_STORE_ID` | `""` | Payment gateway |
| `SSLCOMMERZ_STORE_PASSWORD` | `""` | Payment gateway |
| `FRONTEND_URL` | `http://localhost:3000` | CORS / payment callbacks |
| `SERVER_URL` | `http://localhost:5000` | Payment callbacks |
| `ADMIN_NAME` | `হাঁড়ির স্বাদ অ্যাডমিন` | Seeded admin name |

### Frontend (`.env.local`)

- `NEXT_PUBLIC_API_URL` — API base URL (default `http://localhost:5000`)
- `NEXT_PUBLIC_APP_URL` — site URL for absolute links/OG tags (default `http://localhost:3000`)

## Deploying to Vercel

The whole app deploys as **one Vercel project** from the repo root. The Next.js frontend and the
Express API share the same origin — the API runs as a single catch-all serverless function
(`api/[...path].ts`) that mounts the Express app and holds a cached MongoDB connection.
No Docker or separate host is required.

### Steps

1. Push the repo to GitHub (`git push origin main`).
2. Import the repo at [vercel.com/new](https://vercel.com/new).
   - **Root Directory:** `/` (repo root) — framework auto-detected as **Next.js**.
   - Git connection: your `harir-shad` repo.
3. Set the backend environment variables (Settings → Environment Variables), then **Redeploy**:

   ```
   MONGODB_URI=mongodb+srv://...      # required — must be reachable (e.g. Atlas)
   JWT_SECRET=<a-long-random-string>  # required
   CLOUDINARY_CLOUD_NAME=...
   CLOUDINARY_API_KEY=...
   CLOUDINARY_API_SECRET=...
   IMGBB_API_KEY=...
   STORY_VIDEO_MAX_MB=100
   IS_LIVE=false
   SSLCOMMERZ_STORE_ID=...
   SSLCOMMERZ_STORE_PASSWORD=...
   FRONTEND_URL=https://<your-site>.vercel.app
   SERVER_URL=https://<your-site>.vercel.app
   ```

4. Deploy. The `postinstall` script (`cd backend && npm ci`) installs the API's dependencies so
   the serverless function can bundle them.

### Notes

- **No `NEXT_PUBLIC_API_URL` needed.** The frontend calls the API through a relative
  `/api/...` path on its own origin (see `src/lib/api.ts`), so the auth cookie is **same-site**
  and just works. No CORS or cross-site cookie setup is required.
- The auth cookie works with the defaults (`SameSite=Lax`, `Secure` off) on the same origin.
  Setting `AUTH_COOKIE_SECURE=true` on the HTTPS site is fine too.
- `MONGODB_URI` must point to a reachable host (e.g. MongoDB Atlas); localhost won't work.
- File uploads (story video → Cloudinary, product images → ImgBB) run from memory buffers and
  work on serverless with no disk.
- If you get `FUNCTION_INVOCATION_FAILED`, open `https://<your-site>.vercel.app/api/health` —
  the function returns a JSON body with the real error message.
- The `backend/` directory also contains its own `api/[...path].ts` + `vercel.json`, which let
  you deploy the API as a **separate** Vercel project (Root Directory `backend/`) if you ever
  want to split it.

## Authentication

- Login/register set an **HTTP-only cookie** (`hs_token` by default) so sessions survive
  browser restarts. The cookie is sent on all API requests (`credentials: "include"`).
- Tokens do **not expire** — a user stays logged in until they explicitly log out.
- The `Authorization: Bearer <token>` header is still accepted as a fallback, which also
  migrates legacy localStorage sessions: `GET /api/auth/me` sets the cookie when a valid
  bearer token is present.
- `POST /api/auth/logout` clears the cookie.
- Admin routes gate on `user.role === "admin"`.

## Cart

- **Guests:** cart lives in `localStorage` (`hs-cart`).
- **Logged-in users:** cart is stored on the server (`/api/cart`), keyed by user.
- **Merge on login:** the guest localStorage cart is merged into the server cart and then
  dropped from localStorage. The merge is idempotent — the server is authoritative, so a
  page reload never duplicates or re-sums quantities.
- Cart changes for logged-in users are synced to the server (debounced).

## Project Structure

```
api/[...path].ts        # Vercel serverless catch-all that mounts the Express API
backend/
  api/[...path].ts      # same catch-all, for deploying the API as a separate project
  src/
    config/env.ts          # Zod-validated environment variables
    controllers/           # auth, cart, product, order, payment, user, storyVideo, misc
    middleware/auth.ts     # requireAuth / optionalAuth (cookie OR bearer)
    middleware/error.ts
    models/                # Mongoose models (User, Product, Cart, Order, StoryVideo, …)
    routes/
    scripts/seed.ts
    services/              # auth, cloudinary, imagebb, sslcommerz
    utils/cookies.ts       # setAuthCookie / clearAuthCookie / parseCookieToken
src/
  app/(site)/              # public pages: products, cart, checkout, auth, about, contact, wishlist
  app/(dashboard)/         # admin + account areas
  components/admin/        # admin UI (product form, image upload, useAdminFetch, …)
  components/layout/       # Navbar, Footer, …
  components/product/      # ProductCard, ProductDetail, StoryVideoPlayer, …
  lib/api.ts               # fetch wrapper (credentials: include, optional bearer)
  lib/types.ts
  providers/               # AuthProvider, CartProvider
```

## API Overview

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | — | Register (sets cookie) |
| POST | `/api/auth/login` | — | Login (sets cookie) |
| GET | `/api/auth/me` | cookie/bearer | Current user |
| PUT | `/api/auth/me` | cookie/bearer | Update profile |
| POST | `/api/auth/logout` | — | Clear auth cookie |
| GET/PUT/DELETE | `/api/cart` | required | Server cart |
| GET | `/api/products` | — | Product catalog |
| GET | `/api/products/slug/:slug` | — | Product by slug |
| POST/PUT/DELETE | `/api/products[/:id]` | admin | Product CRUD |
| POST | `/api/orders` | optional | Create order (works for guests) |
| GET | `/api/orders/mine` | required | Current user's orders |
| GET | `/api/orders`, `/api/orders/:id` | admin | Order management |
| PUT | `/api/orders/:id` | admin | Update order/payment status |
| GET/PUT/DELETE | `/api/story-video` | admin (GET public) | Story video (Cloudinary) |
| POST | `/api/contacts` | — | Contact form |
| POST | `/api/newsletter` | — | Newsletter subscribe |
| GET/PATCH | `/api/contacts` | admin | Contact messages |
| POST | `/api/upload` | admin | Image upload (ImgBB) |
| GET | `/api/stats` | admin | Dashboard stats |
| GET/PUT/DELETE | `/api/users[/:id]` | admin | User management |
| GET/POST | `/api/payments/success`, `/fail`, `/cancel`, `/ipn` | — | SSLCommerz flow |
