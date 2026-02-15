# 🛒 Marketplace Platform (**MyStore**)

A full-featured marketplace platform that allows users to create their own stores, add products, manage own stores, products, categories and brands and sell or buy goods.
The platform supports online payments via Stripe and subscription-based limits for sellers.

---

## 🚀 Tech Stack

### Frontend

- **React**
- **TypeScript**
- **React Query**
- **React Hook Form**
- **Shadcn UI**
- **Tailwind CSS**
- **Orval**
- **Stripe.js**

### Backend

- **NestJS**
- **TypeScript**
- **PostgreSQL**
- **Prisma**
- **Stripe API**
- **JWT Authentication**
- **Google Authentication**

---

## ✨ Core Features

### 👤 Users

- User registration and authentication
- User profile management
- Stores and products management
- Roles

### 🏪 Stores

- Users can create their own stores
- Store management (name, description, status)
- A user can own multiple stores (depending on subscription plan)

### 📦 Products

- Create / update / delete products
- Product price, description, and images
- Product limits based on subscription plan
- Browse and buy products from other stores

### 💳 Payments (Stripe)

- Secure payments via **Stripe**
- Supported payment methods:
  - Credit / debit cards
- Stripe Webhooks for handling:
  - customer.subscription.updated
  - checkout.session.completed
  - checkout.session.expired
  - invoice.payment_succeeded
  - customer.subscription.deleted
  - customer.subscription.paused
  - customer.subscription.resumed
  - invoice.payment_failed
  - payment_intent.payment_failed

### 🔁 Subscriptions

- Subscription system powered by **Stripe Subscriptions**
- Subscription plans define:
  - maximum number of products a seller can create
  - access to advanced features
- Example plans:
  - **Free** — up to 10 products
  - **Advanced** — up to 150 products
  - **Premium** — unlimited products

---

## 🧠 Subscription Business Logic

- Product creation is restricted by subscription limits
- Guards / middleware validate active subscriptions

---

## 🔐 Security

- JWT access & refresh tokens
- Request validation with `class-validator`
- Stripe webhook signature verification
- Role-based access control

---

### HELPER LINKS

- https://www.youtube.com/watch?v=1kcboUTW9a0o
- https://www.youtube.com/watch?v=2Mxxe2is3goo
