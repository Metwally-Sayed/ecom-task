# Mini Shop

Full-stack ecommerce technical task using a Next.js 16 frontend and the existing Fastify/Supabase backend.

The original task asked for a product app backed by an API. This implementation uses the local Fastify REST API in `backend/` instead of an external public API, so product, category, auth, cart checkout, and admin workflows all run against the same backend contract.

## Tech Stack

| Area | Stack |
| --- | --- |
| Frontend | Next.js 16 App Router, React 19, TypeScript |
| Styling | Tailwind CSS v4, shadcn/ui |
| Backend | Fastify 5, TypeScript, Zod |
| Data/Auth | Supabase PostgreSQL, Supabase Auth, JWT |
| Tests | Vitest, React Testing Library, Playwright |

## Requirements Coverage

| Requirement | Status |
| --- | --- |
| User registration and JWT/token authentication | Implemented |
| Token/session caching | Implemented with httpOnly cookies |
| Product list page | Implemented |
| Product image/title/price cards | Implemented |
| Responsive grid | Implemented |
| Search by product title | Implemented |
| Category filter | Implemented |
| Product details page | Implemented |
| Loading state | Implemented |
| Error handling | Implemented |
| Mobile and desktop support | Implemented |
| Component-based code | Implemented |
| State management | Implemented for cart state |
| Unit tests | Implemented |
| Pagination | Implemented |
| Tailwind/shadcn styling | Implemented |
| SSR with Next.js | Implemented |
| Deployment readiness | Implemented through buildable frontend/backend apps |

## Local Setup

Install dependencies in both apps:

```bash
cd backend
npm install

cd ../frontend
npm install
```

Create backend env:

```bash
cd backend
cp .env.example .env
```

Fill in the Supabase values in `backend/.env`. The service role key must stay backend-only.

Create frontend env:

```bash
cd frontend
cp .env.local.example .env.local
```

Expected frontend values:

```bash
BACKEND_URL=http://localhost:8080
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Run the backend:

```bash
cd backend
npm run dev
```

Run the frontend:

```bash
cd frontend
npm run dev
```

Open:

```text
http://localhost:3000/products
```

## Supabase Setup

Run the SQL files in the Supabase SQL Editor before seeding:

```text
backend/src/database/schema.sql
backend/src/database/rls.sql
backend/src/database/realtime.sql
```

Then seed the project:

```bash
cd backend
npm run seed
```

Seed credentials:

| Role | Email | Password |
| --- | --- | --- |
| Customer | `customer@test.com` | `Password123!` |
| Admin | `admin@test.com` | `Password123!` |

## Useful Routes

Frontend:

| Route | Purpose |
| --- | --- |
| `/products` | Product grid, search, filters, pagination |
| `/products/[id]` | Product details and add to cart |
| `/login` | Login |
| `/register` | Register |
| `/forgot-password` | Password reset email |
| `/account` | Profile and order history |
| `/checkout` | Checkout flow |
| `/admin/products` | Admin product management |
| `/admin/orders` | Admin order management |
| `/admin/users` | Admin user management |

Backend:

| Route | Purpose |
| --- | --- |
| `GET /health` | Health check |
| `GET /docs` | Swagger UI |
| `GET /docs/json` | OpenAPI JSON for Postman import |
| `POST /auth/login` | Login |
| `POST /auth/register` | Register |
| `GET /products` | Product list |
| `GET /products/:id` | Product detail |
| `GET /categories` | Category list |
| `POST /orders` | Create order |

## Postman

The backend exposes an OpenAPI document that can be imported directly into Postman.

1. Start the backend with `npm run dev` from `backend/`.
2. Open Postman.
3. Select `Import`.
4. Choose `Link`.
5. Paste:

```text
http://localhost:8080/docs/json
```

6. Import the generated Mini Shop API collection.

For authenticated requests, log in with `POST /auth/login`, copy the returned `accessToken`, then configure a collection-level Bearer token in Postman.

Swagger UI is also available at:

```text
http://localhost:8080/docs
```

## Verification

Frontend checks:

```bash
cd frontend
npm run lint
npm run test
npm run build
npm run e2e
```

Backend checks:

```bash
cd backend
npm run build
```

## Deployment

Frontend deployment expects:

```bash
BACKEND_URL=https://your-backend-domain.example.com
NEXT_PUBLIC_APP_URL=https://your-frontend-domain.example.com
```

Backend deployment expects Supabase env vars plus:

```bash
CORS_ORIGIN=https://your-frontend-domain.example.com
PASSWORD_RESET_REDIRECT_URL=https://your-frontend-domain.example.com/reset-password
```
