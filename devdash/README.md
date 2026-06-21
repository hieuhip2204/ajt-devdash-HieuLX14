# DevDash — Developer Dashboard

A typed, async single-page dashboard built with TypeScript + Vite. Loads product and user data from [DummyJSON](https://dummyjson.com/), with search, filter, sort, and detail views.

## Demo

> Deploy to Netlify/Vercel and paste link here.

## Features

### ✅ Pass tier
- Project compiles with `"strict": true`, zero type errors
- All API data modelled with TypeScript interfaces (`types.ts`) — no `any`
- Fetches and renders lists using `async/await` with loading/success/error states
- Functions and parameters fully type-annotated
- `try/catch` error handling with visible error state in UI
- Detail view for individual products and users (by ID)

### ✅ Good tier
- Search, category filter, and sort implemented with higher-order functions (`filter`, `sort`)
- Reusable generic `fetchJson<T>(url): Promise<T>` helper used across all endpoints
- `Promise.all` loads products + categories in parallel before rendering
- Application state modelled as a discriminated union: `idle | loading | success | error`
- **Debounce** closure applied to search input (250 ms)
- Utility types: `Pick<Product, …>` (ProductCard), `Partial<FilterState>` (filter state)

## Local development

```bash
cd devdash
npm install
npm run dev
```
github:  https://github.com/hieuhip2204/ajt-devdash-HieuLX14
demo:    https://ajt-devdash-hieu-lx-14-2h7h.vercel.app/

## Build

```bash
npm run build
npm run preview
```

## Project structure

```
ajt-devdash/
├── index.html
├── package.json
├── tsconfig.json       # strict: true
├── styles.css
└── src/
    ├── main.ts         # entry point — event wiring, view orchestration
    ├── types.ts        # interfaces, discriminated union, utility types
    ├── api.ts          # generic fetchJson<T> + all API endpoints
    ├── state.ts        # app state + derived selectors (filter/sort)
    ├── ui.ts           # render functions (list, cards, modal, status)
    └── utils.ts        # debounce (closure), truncate, stars helpers
```

## API

Uses [DummyJSON](https://dummyjson.com/) — no API key required.

- `GET /products?limit=100` — product list
- `GET /products/categories` — category list (loaded in parallel with products)
- `GET /products/:id` — product detail
- `GET /users?limit=100` — user list
- `GET /users/:id` — user detail
