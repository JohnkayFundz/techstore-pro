# TechStore Pro — Buyer Setup Guide

This guide describes the repository layout and the local development setup. It is written against the current repository structure; it is not a claim that a fresh installation has already been tested.

## 1. What you receive

TechStore Pro is a React/Vite frontend with a Node.js/Express API and MongoDB persistence.

The repository includes customer-facing store flows, authentication, product browsing and management, cart and wishlist functionality, order workflows, and administrative routes. Review the source and the README feature list before relying on any individual feature.

**Important payment limitation:** a payment gateway is not currently integrated. The application includes checkout/order workflow code, but this does not mean it can collect or verify real payments. You must integrate and test a payment provider before using it to accept customer payments.

## 2. Requirements

Prepare the following on your development computer:

- Node.js and npm (use a currently supported Node.js LTS release).
- MongoDB connection: either a local MongoDB instance or a MongoDB Atlas database.
- A code editor and terminal.
- Optional service accounts/credentials if you plan to use image hosting or the AI assistant.

The project does not declare a tested Node.js version in its package metadata. If installation fails on your chosen Node.js release, check the dependency requirements and use a supported LTS version.

## 3. Download and open the project

Download the project source archive from the product delivery location, extract it, and open a terminal in the extracted `techstore-pro` repository root.

The repository root is the frontend application directory. There is **no `client/` directory**.

Expected high-level layout:

```text
techstore-pro/
├── src/                 # React frontend source
├── public/              # Static frontend assets
├── server/              # Express API
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── .env.example
│   └── package.json
├── .env.example         # Frontend environment template
├── package.json         # Frontend scripts and dependencies
└── README.md
```

## 4. Install frontend dependencies

Run these commands from the repository root. `npm ci` installs the exact dependency versions recorded in the lockfile:

```bash
npm ci
```

The root package scripts include:

- `npm run dev` — start the Vite development server.
- `npm run build` — create the frontend production build.
- `npm run lint` — run ESLint.
- `npm run preview` — preview a built frontend locally.

## 5. Install backend dependencies

Open a second terminal, move into the backend directory, and install its dependencies:

```bash
cd server
npm ci
```

Backend scripts:

- `npm run dev` — start the API using Node.js's built-in `--watch` mode (no nodemon dependency is required).
- `npm start` — start the API with Node.js.
- `npm run seed` — run the product seeder. The current script validates seed SKUs/names, creates missing seed products, and updates matching seeded products by SKU. It does not delete products; it preserves existing Cloudinary image URLs and leaves products not represented in the seed data untouched. **It does update matching seeded product fields**, so use a disposable database first and back up any database before running it. Never point it at a live store database unless you deliberately want those seeded products updated.

## 6. Configure the frontend

In the repository root, copy `.env.example` to a new file named `.env`.

Set the API base URL:

```env
VITE_API_URL=http://localhost:5000/api
```

Vite exposes variables prefixed with `VITE_` to frontend code. Do not put private credentials or secrets in this file.

## 7. Configure the backend

Inside `server/`, copy `.env.example` to `.env`. Configure the values for your own environment:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

OPENAI_API_KEY=
OPENAI_MODEL=
```

Notes:

- `MONGODB_URI` must point to a database you control.
- Use a long, random `JWT_SECRET`; do not reuse a sample or commit the real value.
- `CLIENT_URL` should match the origin from which your frontend is served.
- Cloudinary credentials are for the image-upload integration. Configure them only if you intend to use that integration.
- The AI assistant settings are optional unless you enable/use the related functionality. An API key may incur third-party charges; no paid service is included with the source code.
- Never commit either `.env` file or share its contents.

## 8. Run the application locally

Start the backend in the terminal currently inside `server/`:

```bash
npm run dev
```

The backend is configured to listen on port 5000 by default.

Start the frontend in a separate terminal from the repository root:

```bash
npm run dev
```

Vite normally serves the frontend at:

```text
http://localhost:5173
```

If you change either port or origin, keep the frontend API URL and backend `CLIENT_URL` configuration consistent.


## 8A. MongoDB transaction requirement

The order-creation and order-cancellation controllers use MongoDB sessions and multi-document transactions to keep order records and product stock changes consistent. MongoDB transactions require a replica set or a sharded cluster; a standalone local `mongod` instance is not sufficient.

- For local development, use a local single-node replica set and initialize it before starting the API, or use a dedicated MongoDB Atlas deployment that supports transactions.
- Confirm the selected database deployment supports transactions before testing order creation or cancellation.
- Do not disable the transaction logic merely to make a standalone database work: doing so can leave stock and order records inconsistent.
- Use a disposable database for initial tests. Never test order flows against a live store database.

A successful MongoDB connection or frontend build does not prove that transaction-backed order flows work. Exercise both order creation and cancellation against a transaction-capable test database before deployment.

To run the automated backend tests, open a terminal in `server/` and run:

```bash
npm ci
npm test
```

The test suite uses `mongodb-memory-server` to start a disposable MongoDB 7.0.14 single-node replica set for integration tests. The first run downloads the MongoDB test binary (approximately 81 MB); it does not connect to your configured `MONGODB_URI`. The suite covers registration, login, JWT protection, order transactions, cash-only payment safeguards, and Cloudinary upload-helper behavior. Keep real `.env` credentials out of test fixtures.

## 8B. Payment method limitation

The application currently supports cash on delivery only. The card option has been removed from checkout and the API rejects unsupported payment methods because no payment gateway or server-side card-payment verification is integrated. Do not collect card details in this application or mark an order paid based on a browser response. Add a payment provider with server-side verification and webhook handling before enabling online payments.

## 9. Build the frontend

From the repository root:

```bash
npm run build
```

The generated production assets are written by Vite to its configured output directory (normally `dist/`). A successful build checks frontend compilation; it does not by itself verify database connectivity, authentication, image uploads, order workflows, payment processing, or production deployment.

## 10. Before using this for a real store

This starter kit is source code, not a hosted store or managed service. Before launching a store for real customers:

1. Configure and secure your own database.
2. Generate and protect production secrets.
3. Configure the production frontend origin and backend CORS settings.
4. Configure image hosting if required.
5. Review authentication, authorization, validation, rate limits, and error handling.
6. Integrate a payment provider and verify payment status server-side before treating an order as paid.
7. Test registration, login, product management, cart, checkout/order creation, order status changes, and admin access using test data.
8. Configure backups, monitoring, HTTPS, and deployment settings.
9. Review all third-party package licenses and any external service terms. See `THIRD_PARTY_LICENSE_REVIEW.md` for a preliminary lockfile metadata inventory; it is not legal clearance.

Do not use real customer or payment data during initial setup and testing.

## 11. Troubleshooting

**Frontend cannot reach the API**
- Confirm the backend is running.
- Confirm root `.env` has the correct `VITE_API_URL`.
- Confirm backend `CLIENT_URL` matches the frontend origin.
- Restart the Vite process after changing environment variables.

**Backend exits during startup**
- Confirm `server/.env` exists and contains `MONGODB_URI`, `JWT_SECRET`, and `CLIENT_URL`.
- Confirm MongoDB is reachable and the connection string is correct.
- Check the terminal for the exact error message.

**Image upload does not work**
- Confirm the Cloudinary values are configured correctly.
- Check the backend logs and Cloudinary account configuration.

**AI assistant does not respond**
- Check whether the feature is enabled in the source.
- Configure a valid API key and supported model for your account.
- Remember that external AI usage may be billable.

## 12. Support and scope

This guide covers initial local setup. It does not include hosting, domain registration, paid database or API subscriptions, custom modifications, or a guarantee that a buyer's deployment will work without environment-specific configuration.

For the authoritative feature list and project links, see [README.md](README.md).
