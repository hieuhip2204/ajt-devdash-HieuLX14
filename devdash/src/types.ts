

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface CategoriesResponse {
  slug: string;
  name: string;
  url: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  gender: string;
  username: string;
  image: string;
  company: Company;
  address: Address;
}

export interface Company {
  name: string;
  department: string;
  title: string;
}

export interface Address {
  city: string;
  country: string;
}

export interface UsersResponse {
  users: User[];
  total: number;
  skip: number;
  limit: number;
}



export type AppState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string };


export type ViewName = "products" | "users";

export type SortOption =
  | "default"
  | "name-asc"
  | "name-desc"
  | "price-asc"
  | "price-desc";

/** Lightweight card representation — only what the list view needs */
export type ProductCard = Pick<
  Product,
  "id" | "title" | "price" | "rating" | "category" | "thumbnail" | "brand"
>;

/** Lightweight user card */
export type UserCard = Pick<
  User,
  "id" | "firstName" | "lastName" | "email" | "age" | "image" | "company"
>;

/** Filter state — all fields optional */
export type FilterState = Partial<{
  query: string;
  category: string;
  sort: SortOption;
}>;
