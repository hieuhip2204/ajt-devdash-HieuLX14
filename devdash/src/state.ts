import type { AppState, FilterState, SortOption, ViewName } from "./types.js";
import type { Product, User, CategoriesResponse } from "./types.js";

// ─── Global State ─────────────────────────────────────────────────────────────

export interface DashState {
  view: ViewName;
  products: AppState<Product[]>;
  users: AppState<User[]>;
  categories: CategoriesResponse[];
  filter: FilterState;
}

const state: DashState = {
  view: "products",
  products: { status: "idle" },
  users: { status: "idle" },
  categories: [],
  filter: { query: "", category: "", sort: "default" },
};

// ─── Accessors ────────────────────────────────────────────────────────────────

export function getState(): Readonly<DashState> {
  return state;
}

export function setView(view: ViewName): void {
  state.view = view;
  // Reset category filter when switching views
  state.filter = { ...state.filter, category: "", query: "" };
}

export function setProductsState(next: AppState<Product[]>): void {
  state.products = next;
}

export function setUsersState(next: AppState<User[]>): void {
  state.users = next;
}

export function setCategories(cats: CategoriesResponse[]): void {
  state.categories = cats;
}

export function setFilter(patch: Partial<FilterState>): void {
  state.filter = { ...state.filter, ...patch };
}

// ─── Derived selectors ────────────────────────────────────────────────────────

export function getFilteredProducts(): Product[] {
  const { products, filter } = state;
  if (products.status !== "success") return [];

  const { query = "", category = "", sort = "default" } = filter;
  const q = query.toLowerCase();

  const filtered = products.data.filter((p) => {
    const matchesQuery =
      p.title.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q);
    const matchesCategory = category === "" || p.category === category;
    return matchesQuery && matchesCategory;
  });

  return sortProducts(filtered, sort);
}

function sortProducts(list: Product[], sort: SortOption): Product[] {
  const copy = [...list];
  switch (sort) {
    case "name-asc":
      return copy.sort((a, b) => a.title.localeCompare(b.title));
    case "name-desc":
      return copy.sort((a, b) => b.title.localeCompare(a.title));
    case "price-asc":
      return copy.sort((a, b) => a.price - b.price);
    case "price-desc":
      return copy.sort((a, b) => b.price - a.price);
    default:
      return copy;
  }
}

export function getFilteredUsers(): User[] {
  const { users, filter } = state;
  if (users.status !== "success") return [];

  const q = (filter.query ?? "").toLowerCase();

  return users.data.filter((u) => {
    const full = `${u.firstName} ${u.lastName}`.toLowerCase();
    return (
      full.includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.company.name.toLowerCase().includes(q)
    );
  });
}
