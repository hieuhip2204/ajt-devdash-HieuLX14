import type {
  CategoriesResponse,
  Product,
  ProductsResponse,
  User,
  UsersResponse,
} from "./types.js";

const BASE = "https://dummyjson.com";

// ─── Generic Fetch Helper ─────────────────────────────────────────────────────

export async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText} — ${url}`);
  }
  return res.json() as Promise<T>;
}

// ─── Products ─────────────────────────────────────────────────────────────────

export async function fetchProducts(): Promise<ProductsResponse> {
  return fetchJson<ProductsResponse>(`${BASE}/products?limit=100`);
}

export async function fetchProductById(id: number): Promise<Product> {
  return fetchJson<Product>(`${BASE}/products/${id}`);
}

export async function fetchCategories(): Promise<CategoriesResponse[]> {
  return fetchJson<CategoriesResponse[]>(`${BASE}/products/categories`);
}

/** Load products and categories in parallel */
export async function fetchProductsWithCategories(): Promise<{
  products: ProductsResponse;
  categories: CategoriesResponse[];
}> {
  const [products, categories] = await Promise.all([
    fetchProducts(),
    fetchCategories(),
  ]);
  return { products, categories };
}

// ─── Users ────────────────────────────────────────────────────────────────────

export async function fetchUsers(): Promise<UsersResponse> {
  return fetchJson<UsersResponse>(`${BASE}/users?limit=100`);
}

export async function fetchUserById(id: number): Promise<User> {
  return fetchJson<User>(`${BASE}/users/${id}`);
}
