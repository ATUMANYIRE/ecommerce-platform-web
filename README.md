# Atlas Marketplace

A full-featured, dark-themed ecommerce storefront built with Next.js 16 and TypeScript. Designed as a demo/portfolio store that works against an external microservices backend — but ships with rich offline demo data so every flow works client-side with no backend required.

## Features

### Storefront
- Home page with hero, category grid, trending products, and promotional sections
- Product detail pages with breadcrumbs, live stock levels, add-to-cart/wishlist, reviews, and curated pairings
- Full-text search with category, brand, and price-range filters plus autocomplete suggestions
- Categories: Electronics, Fashion, Home, Beauty, Sports

### Checkout (demo — no real payment)
- Two-step checkout: address picker then review
- Promo code support (`ATLAS10` for 10% off)
- Delivery speed selection (Standard / Express)
- Simulated payment processing (card, PayPal, cash on delivery)
- Order confirmation with localStorage persistence

### Account Hub
- Dashboard, profile/settings, saved addresses (CRUD)
- Order history with tracking timeline, carrier info, and printable invoice
- Wishlist, notifications, auth pages (login, register, forgot/reset password, email verification)

### Seller Hub
- Product management (list, add, edit)
- Order status management
- Inventory/stock updates
- Review replies
- Store profile and payout settings

### Admin Console
- Promotions management (create, toggle, schedule promo codes)
- Review moderation queue (approve, reject, flag)
- Seller account management

### Info Pages
- About, FAQ, shipping, returns, contact, terms, privacy, become-a-seller

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, React Server Components) |
| React | 19 |
| Language | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS v4, dark Material-3-like palette |
| State | React Context + custom SSR-safe localStorage store |
| Icons | Material Symbols Outlined |
| Data | No database — all demo state persists in browser localStorage |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The app runs fully offline with seeded demo data. No backend is needed.

## Deployment

This project is currently deployed on [Vercel](https://vercel.com), created with [Stitch](https://stitch.vercel.ai), and is live at:

**https://ecommerce-platform-web-peach.vercel.app/**

It runs fully client-side in demo mode — no backend services are required in production.

### Environment Variables

| Variable | Default | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8080` | Base URL for the external microservice gateway |
| `NEXT_PUBLIC_ENABLE_DEMO_STATES` | `false` | Enable `?state=` URL param previews (error/loading/empty variants) |

## Project Structure

```
src/
  app/
    (store)/         — Main storefront, account, auth pages
    (checkout)/      — Checkout flow (minimal shell)
    (seller)/        — Seller hub dashboard
    (admin)/         — Admin console
  components/        — ~65 components organized by domain (home, product, cart, checkout, etc.)
  lib/
    api/             — Typed API client for external microservices (catalog, search, cart, reviews, stock)
    auth/            — Client-side JWT session management (access + refresh tokens)
    demo/            — Offline demo data and info page content
    utils/           — localStorage store, helpers
```

## License

Private — portfolio demo project.
