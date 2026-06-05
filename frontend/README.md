# Mini Shop Frontend

Next.js 16 frontend for the Mini Shop task. This app uses the existing Fastify backend in `../backend` and does not call Supabase directly from the browser.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Vitest
- Playwright

## Local setup

1. Start the backend:

```bash
cd ../backend
npm run dev
```

2. Start the frontend:

```bash
npm run dev
```

3. Open:

```text
http://localhost:3000
```

## Environment

`frontend/.env.local`

```bash
BACKEND_URL=http://localhost:8080
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Useful routes

- `/products`
- `/products/[id]`
- `/login`
- `/register`
- `/forgot-password`
- `/account`
- `/checkout`
- `/admin/products`
- `/admin/orders`

## Postman

The API can be imported into Postman from the backend Swagger/OpenAPI endpoint.

1. Start the backend from `../backend`:

```bash
npm run dev
```

2. In Postman, choose **Import** → **Link**.
3. Paste:

```text
http://localhost:8080/docs/json
```

4. Import the generated Mini Shop API collection.

Swagger UI is available at:

```text
http://localhost:8080/docs
```

## Seed credentials

- Customer: `customer@test.com` / `Password123!`
- Admin: `admin@test.com` / `Password123!`

## Verification

```bash
npm run lint
npm run test
npm run build
npm run e2e
```

## Notes

- Auth tokens are stored in httpOnly cookies through Next route handlers.
- The app uses the backend for auth, products, categories, orders, and uploads.
- If Supabase is unreachable from the local environment, the `/products` page renders a graceful fallback instead of crashing the route.
