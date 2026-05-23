# MyStore — Full-Featured Marketplace Platform

Multi-tenant marketplace where users create stores, manage products, and sell/buy goods with Stripe payments, subscription plans, and AI-powered product search.

---

## Tech Stack

| Layer              | Technologies                                                                                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Frontend**       | Next.js 15 (App Router), TypeScript, Tailwind CSS v4, Shadcn UI (Radix), Redux Toolkit, TanStack React Query v5, React Hook Form + Zod, next-intl (i18n), Recharts |
| **Backend**        | NestJS 11, TypeScript, PostgreSQL, Prisma ORM 6, JWT + Google OAuth, Socket.IO, OpenRouter AI                                                                      |
| **Payments**       | Stripe (primary)                                                                                                                                                   |
| **Infrastructure** | Docker, Docker Compose, Nginx, Cloudinary                                                                                                                          |

---

## Quick Start

### Backend

```bash
cd server
cp .env.example .env        # fill in your values
npm install
npx prisma migrate dev
npm run start:dev
```

### Frontend

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

### Docker (full stack)

```bash
docker compose up -d
```

---

## Core Features

### 👤 Users & Auth

- Registration / Login (email+password, Google OAuth)
- JWT access + refresh tokens (httpOnly cookies)
- Password reset via email
- Roles: `USER`, `ADMIN`, `SUPER_ADMIN`
- Profile management (name, picture, address, phone)

### 🏪 Multi-Store System

- Users create & manage multiple stores
- Store settings: name, description, images, address, status (published/blocked)
- Per-store management dashboard

### 📦 Products

- Full CRUD with images, price, description
- Intended for: `SALE`, `FREE`, `RENT`
- Condition: `NEW`, `USED`
- Product details (custom key-value attributes)
- Quantity tracking, view counter, likes/favorites
- Similar products & most-popular endpoints

### 🏷️ Categories & Brands & Colors

- CRUD for categories, brands, and colors per store
- Each entity supports images, description, rating

### ⭐ Reviews

- Users can review products from stores they've purchased from
- Text + rating

### 🛒 Shopping Cart

- Redux-based cart with per-user localStorage persistence
- Add/remove/change quantity

### 📋 Orders

- Buyer order history and seller sold-items views
- Order status lifecycle: pending → succeeded → confirmed → refunded
- Admin can manage all orders

### 💳 Payments (Stripe)

- **Stripe Checkout** — product purchase & subscription upgrades
- **Stripe Connect** — seller payout accounts (95% seller / 5% platform commission)
- **Refunds** — reverse transfer to seller, then refund buyer
- **Billing Portal** — subscription management link
- **Webhooks** — 12+ event types handled (subscriptions, invoices, payments, transfers)

### 🔁 Subscriptions

- 5 plans: Free (10 products, 1 store), Advanced (150 products, 5 stores), Premium (unlimited)
- Monthly & annual billing
- Auto-enforcement of product & store limits
- Upgrade / downgrade (scheduled at period end) / cancel

### 📊 Statistics & Analytics

- Per-store dashboard: revenue, products, categories, avg rating
- Monthly sales, top products, category sales breakdown, sales history
- Charts via Recharts

### 🤖 AI Shopping Assistant

- WebSocket (Socket.IO) real-time chat
- OpenRouter AI (configurable model, default: Llama 3.3 70B)
- Product search with natural language queries
- Streaming responses with product card suggestions

### 📧 Email & Notifications

- Nodemailer with React email templates
- Password reset emails
- Contact form → site owner
- Newsletter subscribe/unsubscribe
- New product notifications to subscribers

### 🔍 Product Search & Filtering

- Advanced query builder (filters: category, brand, price, color, attributes)
- Pagination, sorting, search
- Semantic search (embedding field ready)

### 🌍 Internationalization

- English & Russian (next-intl)
- Locale prefix routing (`/[locale]/...`)

### 📁 File Upload

- **Local** filesystem upload
- **Cloudinary** upload with proxy endpoint for image transformations

### 🔐 Security

- JWT auth with auto-refresh on 401
- argon2 password hashing
- Stripe webhook signature verification
- class-validator request validation
- Guards: ownership, store-owner, subscription limits, role-based

### 🧩 API Documentation

- Swagger UI at `/api/docs`
- OpenAPI JSON at `/api/openapi.json`
- Orval auto-generates TypeScript API client from OpenAPI spec

---

## Project Structure

```
├── client/                    # Next.js frontend
│   ├── src/
│   │   ├── app/[locale]/     # Pages by locale
│   │   ├── components/       # UI & custom components
│   │   ├── hooks/            # React Query & custom hooks
│   │   ├── services/         # API service classes
│   │   ├── store/            # Redux (cart)
│   │   └── i18n/            # Internationalization
│   └── messages/            # Translation JSON files
├── server/                    # NestJS backend
│   ├── src/
│   │   ├── auth/             # JWT + Google OAuth
│   │   ├── payment/          # Stripe + YooKassa
│   │   ├── product/          # Products CRUD
│   │   ├── store/            # Stores CRUD
│   │   ├── order/            # Orders management
│   │   ├── statistics/       # Analytics
│   │   ├── ai-chat/          # WebSocket AI assistant
│   │   ├── mailer/           # Email service
│   │   └── file/             # File upload (local + Cloudinary)
│   ├── prisma/               # Schema & migrations
│   └── test/                 # E2E tests
├── docker-compose.yml        # Full stack orchestration
└── nginx.conf                # Reverse proxy config
```

---

## Environment Variables

See `.env.example` in `server/` and `client/`. Key variables:

- **Auth:** `JWT_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- **Stripe:** `STRIPE_SECRET_KEY`, `STRIPE_PUBLIC_KEY`, `STRIPE_WEBHOOK_SECRET`
- **YooKassa:** `YOOKASSA_SHOP_ID`, `YOOKASSA_SECRET_KEY`
- **Database:** `DATABASE_URL` / `DB_*`
- **Cloudinary:** `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- **Email:** `MAIL_HOST`, `MAIL_USER`, `MAIL_PASSWORD`
- **AI:** `OPENROUTER_API_KEY`, `OPENROUTER_MODEL`

---

## Scripts

### Server

| Command                 | Description                 |
| ----------------------- | --------------------------- |
| `npm run start:dev`     | Development with hot-reload |
| `npm run build`         | Production build            |
| `npm run start:prod`    | Start production            |
| `npm test`              | Unit tests (Jest)           |
| `npm run test:e2e`      | E2E tests                   |
| `npm run prisma:studio` | Prisma Studio GUI           |

### Client

| Command            | Description                              |
| ------------------ | ---------------------------------------- |
| `npm run dev`      | Development with Turbopack               |
| `npm run build`    | Production build                         |
| `npm run generate` | Regenerate Orval API client from OpenAPI |

---

## Docker Environments

| File                 | Environment | Use Case                                             |
| -------------------- | ----------- | ---------------------------------------------------- |
| `Dockerfile.prod`    | Production  | Multi-stage, standalone Next.js output               |
| `Dockerfile.dev`     | Staging     | Dev/staging with `.env.dev`                          |
| `Dockerfile.local`   | Local dev   | Volume mounts, `next dev`                            |
| `docker-compose.yml` | Full stack  | PostgreSQL + Server + Client + Nginx + Prisma Studio |

---
