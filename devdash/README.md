# DevDash — Developer Dashboard

A typed, async single-page dashboard built with TypeScript + Vite. Loads product and user data from [DummyJSON](https://dummyjson.com/), with search, filter, sort, and detail views.

## Demo

> Deploy to Netlify/Vercel and paste link here.

## Features

### ✅ Pass tier
- [x] Project compiles with `"strict": true`, zero type errors
- [x] All API data modelled with TypeScript interfaces (`types.ts`) — no `any`
- [x] Fetches and renders lists using `async/await` with loading/success/error states
- [x] Functions and parameters fully type-annotated
- [x] `try/catch` error handling with visible error state in UI
- [x] Detail view for individual products and users (by ID)

### ✅ Good tier
- [x] Search, category filter, and sort implemented with higher-order functions (`filter`, `sort`)
- [x] Reusable generic `fetchJson<T>(url): Promise<T>` helper used across all endpoints
- [x] `Promise.all` loads products + categories in parallel before rendering
- [x] Application state modelled as a discriminated union: `idle | loading | success | error`
- [x] **Debounce** closure applied to search input (250 ms)
- [x] Utility types: `Pick<Product, …>` (ProductCard), `Partial<FilterState>` (filter state)

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:5173

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
