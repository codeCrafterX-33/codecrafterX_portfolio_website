# codeCrafterX Portfolio

React + Vite frontend with a **Node.js + Express** backend for project management APIs.

## Environment variables

Copy `.env.example` to `.env` and fill:

- `DATABASE_URL`
- `DIRECT_URL`
- `API_PORT` (default `8787`)
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CLERK_SECRET_KEY`
- `VITE_CLERK_PUBLISHABLE_KEY`
- `VITE_API_BASE_URL` (optional; leave empty when using Vite proxy)

## Development

```bash
npm install
npm run dev
```

`npm run dev` starts:

1. Vite frontend
2. Express API server (`server/index.ts`)

Vite proxies `/api/*` to the Express backend.

## Admin auth (Clerk)

- `/admin/projects` uses Clerk sign-in.
- Express admin endpoints require a valid Clerk session token.
- Access is restricted to users whose Clerk `publicMetadata.role` is set to `admin`.

## Useful scripts

```bash
npm run dev:web      # frontend only
npm run dev:api      # backend only (watch mode)
npm run start:api    # backend only (single run)
npm run build        # static frontend build in dist/
npm run test
npm run check
npm run lint
```

## Static frontend deployment

The frontend is a normal Vite static build. To deploy with Hostinger file
upload:

```bash
npm run build
```

Upload the contents of `dist/` to Hostinger's website root, usually
`public_html`.

For React Router routes like `/about` and `/projects`, configure Hostinger to
fallback all unknown paths to `index.html` if the file manager or hosting panel
does not do it automatically.

## Express API server

The Express server is API-only. It no longer serves the built frontend.

Use it when you need:

- `/api/contact`
- `/api/projects`
- admin project management
- Cloudinary cleanup

Run it locally with:

```bash
npm run dev:api
```

For a separate deployed API, set `VITE_API_BASE_URL` before building the static
frontend so browser requests go to that API host.

Example:

```bash
VITE_API_BASE_URL=https://api.your-domain.example npm run build
```

If you upload only the static frontend and do not deploy the API elsewhere,
features that call `/api/*` will not work.
