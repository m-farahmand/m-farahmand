# Farahmand Platform

Personal platform & software marketplace built with **Next.js** (adapted from the PRD's Nuxt 3 spec).

## Features (MVP)

- **Public site**: Home, About (timeline), Products, Product detail, Blog, Contact
- **E-commerce**: Cart, manual checkout, order tracking
- **Admin panel**: Dashboard, CRUD for products, timeline, blog, order management
- **API**: REST routes under `/api`
- **Auth**: JWT-based admin authentication

## Tech Stack

- Next.js 16 (App Router, TypeScript)
- Tailwind CSS 4
- Prisma ORM + SQLite (dev) — switch to PostgreSQL for production
- Zod validation, Jose JWT, bcryptjs

## Getting Started

```bash
cd web
npm install
npm run db:setup    # create DB + seed sample data
npm run dev         # http://localhost:3000 (set PORT in .env to change)
```

### Admin Login

- URL: http://localhost:3000/admin
- Email: `admin@farahmand.dev`
- Password: `admin123`

Change credentials in `.env` before deploying.

## Project Structure

```
web/
├── prisma/           # Schema, migrations, seed
├── public/           # Static assets
└── src/
    ├── app/          # Pages & API routes
    │   ├── about/
    │   ├── products/
    │   ├── cart/
    │   ├── checkout/
    │   ├── blog/
    │   ├── contact/
    │   ├── admin/    # Admin panel
    │   └── api/      # REST API
    ├── components/
    ├── lib/          # Auth, Prisma, utils
    └── types/
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List products |
| GET | `/api/products/:slug` | Product detail |
| GET | `/api/timeline` | Timeline entries |
| GET | `/api/blog` | Blog posts |
| POST | `/api/orders` | Create order |
| POST | `/api/admin/auth` | Admin login |

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Dev/production server port |
| `DATABASE_URL` | — | Database connection string |
| `JWT_SECRET` | — | Secret for admin JWT tokens |
| `ADMIN_EMAIL` | — | Seed admin email |
| `ADMIN_PASSWORD` | — | Seed admin password |

## Production Notes

1. Set `JWT_SECRET` to a strong random value
2. Switch Prisma to PostgreSQL (`provider = "postgresql"` in schema)
3. Update `DATABASE_URL` to your Postgres connection string
4. Change default admin credentials

## Future Enhancements (from PRD)

- Stripe payment integration
- Multi-language (i18n)
- License keys for software
- Subscription system
- Media upload for products
