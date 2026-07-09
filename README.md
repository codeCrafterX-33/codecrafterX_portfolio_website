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
npm run build
npm run test
npm run check
npm run lint
```

## Hostinger production deployment

The production deployment runs one Express process. Express serves the API under
`/api/*` and the built React application from `dist/`.

Create a **Node.js Web App** in Hostinger and connect this Git repository.

Use these deployment settings:

```text
Node.js version: 20 or newer
Build command: npm run build
Start command: npm start
```

Add every value from `.env.example` to Hostinger's environment-variable
settings. Do not set `PORT`; Hostinger provides it. Set `NODE_ENV=production`
and leave `VITE_API_BASE_URL` empty so the frontend uses same-origin `/api`
requests.

After deployment, verify:

```text
https://your-domain.example/
https://your-domain.example/about
https://your-domain.example/api/health
```

The health endpoint must return:

```json
{"ok":true}
```
