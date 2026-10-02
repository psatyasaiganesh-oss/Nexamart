# NexaMart

An Amazon-inspired demo ecommerce store, built with React, TypeScript, Vinext and Cloudflare Workers. Durable data lives in D1 (SQLite).

## Included

- Responsive product catalog with 20 sample products and bundled photos from Fake Store API.
- Search, category and price filters, sorting, product details and wishlist.
- ChatGPT sign-in with server-side customer isolation.
- Persistent cart with validated quantity and stock limits.
- Demo checkout with address validation, server-calculated totals, stock deduction and order snapshots in an atomic database batch.
- Idempotent checkout requests, database constraints preventing negative stock.
- Customer order history and administrator price, stock and order-status management.

## Accounts and administration

The deployment is owner-private. Its first authenticated visitor becomes the store administrator once, stored in the settings table. Provision the owner before enabling access for others. Replace this provisioning policy with an explicit administrator allowlist before any public launch. Authentication relies on Sites forwarding verified identity headers; never expose the Worker directly with client-supplied identity headers.

## Development

Use the existing pnpm lockfile. `npm run dev` starts development; `npm run build` creates the Worker build; `npm run db:generate` generates schema migrations. Sites binds `DB` from `.openai/hosting.json` and applies generated migrations during deployment. See the scripts directory for environment-specific helpers.

## Data and checkout

Products, prices and ratings are demonstration data. Seed data inserts missing products and does not overwrite saved inventory. Product imagery was downloaded from https://fakestoreapi.com/products and is bundled under public/products. Confirm licenses or replace imagery for a commercial launch.

Checkout creates test orders only: no payment gateway, email delivery, shipment booking, tax integration, refunds, or real fulfilment are configured. Shipping in the demo is ₹99 below ₹999, otherwise free. All prices are in INR.

## Validation

TypeScript and production builds pass. Backend handlers were exercised against SQLite for catalog seeding, sign-in requirements, cart validation/persistence, wishlist, totals, order persistence/idempotency, inventory checks, customer isolation and administrator permissions. Browser and WebMCP validation were unavailable in this authoring session.
