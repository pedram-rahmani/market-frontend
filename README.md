# Marketplace Frontend

The customer-facing web application for the Marketplace project. It is built with Next.js and TypeScript and communicates with the Laravel REST API in the [market-backend repository](https://github.com/pedram-rahmani/market-backend).

## Features

- Responsive storefront with home, product listing, product details, search, category navigation, filtering, and sorting
- Authentication flows: registration, login, logout, forgot password, and password reset
- Product detail pages with galleries, specifications, warranties, reviews, questions, reactions, and reports
- Shopping cart and checkout flows with address and shipping/payment selections
- User account area with orders, wallet and transactions, coupons, notifications, support tickets, wishlist, profile, and security settings
- Role-aware management screens for products, categories, users, coupons, reviews, questions, notifications, and site settings
- Client-side image compression before upload
- Persian/Jalali date support and a Persian-first responsive interface

## Technology

- Next.js `16`
- React `19`
- TypeScript
- Tailwind CSS `4`
- Redux Toolkit and React Redux
- Axios
- React Hook Form
- `jalaali-js`
- `browser-image-compression`

## Project structure

```text
app/          Next.js App Router pages and layouts
components/   Reusable UI, product, cart, checkout, auth, and account components
lib/          API client and shared utilities
store/        Redux store and slices
public/       Fonts and static assets
```

## Requirements

- Node.js 20 or newer
- A running instance of the Laravel backend

## Local setup

From this directory:

```bash
npm install
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
NEXT_PUBLIC_ASSET_URL=http://127.0.0.1:8000/storage
```

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Production build

```bash
npm run build
npm run start
```

`npm run start` uses the `PORT` environment variable when it is set.

## Backend

The frontend expects the Laravel API to be available at `NEXT_PUBLIC_API_URL`. See the setup guide in the [market-backend repository](https://github.com/pedram-rahmani/market-backend).

## Live Demo

- [Open the Marketplace website](https://my-market-frontend.liara.run/)
- [Backend API](https://my-market-backend.liara.run/api)

## Related documentation

- [Backend repository](https://github.com/pedram-rahmani/market-backend)
