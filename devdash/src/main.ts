import {
  fetchProductsWithCategories,
  fetchUsers,
  fetchProductById,
  fetchUserById,
} from "./api.js";
import {
  getState,
  setView,
  setProductsState,
  setUsersState,
  setCategories,
  setFilter,
  getFilteredProducts,
  getFilteredUsers,
} from "./state.js";
import {
  renderProductList,
  renderUserList,
  renderProductStatus,
  renderUserStatus,
  populateCategoryFilter,
  hideCategoryFilter,
  showCategoryFilter,
  showModal,
  hideModal,
  showModalLoading,
  renderProductDetail,
  renderUserDetail,
  setActiveNav,
} from "./ui.js";
import { debounce } from "./utils.js";
import type { SortOption, ViewName } from "./types.js";

// ─── Load products view ───────────────────────────────────────────────────────

async function loadProducts(): Promise<void> {
  setProductsState({ status: "loading" });
  renderProductStatus(getState().products);

  try {
    const { products, categories } = await fetchProductsWithCategories();
    setProductsState({ status: "success", data: products.products });
    setCategories(categories);
    populateCategoryFilter(categories);
    showCategoryFilter();
    renderProductList(getFilteredProducts(), openProductDetail);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    setProductsState({ status: "error", message });
    renderProductStatus(getState().products);
  }
}

// ─── Load users view ──────────────────────────────────────────────────────────

async function loadUsers(): Promise<void> {
  setUsersState({ status: "loading" });
  renderUserStatus(getState().users);

  try {
    const response = await fetchUsers();
    setUsersState({ status: "success", data: response.users });
    hideCategoryFilter();
    renderUserList(getFilteredUsers(), openUserDetail);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    setUsersState({ status: "error", message });
    renderUserStatus(getState().users);
  }
}

// ─── Detail views ─────────────────────────────────────────────────────────────

async function openProductDetail(id: number): Promise<void> {
  showModalLoading();
  try {
    const product = await fetchProductById(id);
    renderProductDetail(product);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not load product";
    showModal(`<div class="state-msg error">⚠ ${message}</div>`);
  }
}

async function openUserDetail(id: number): Promise<void> {
  showModalLoading();
  try {
    const user = await fetchUserById(id);
    renderUserDetail(user);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not load user";
    showModal(`<div class="state-msg error">⚠ ${message}</div>`);
  }
}

// ─── Re-render current view after filter change ───────────────────────────────

function rerenderCurrentView(): void {
  const { view } = getState();
  if (view === "products") {
    renderProductList(getFilteredProducts(), openProductDetail);
  } else {
    renderUserList(getFilteredUsers(), openUserDetail);
  }
}

// ─── Event wiring ─────────────────────────────────────────────────────────────

function switchView(view: ViewName): void {
  setView(view);
  setActiveNav(view);

  // Reset UI controls
  const searchInput = document.getElementById("search-input") as HTMLInputElement | null;
  const sortSelect = document.getElementById("sort-select") as HTMLSelectElement | null;
  const catFilter = document.getElementById("category-filter") as HTMLSelectElement | null;

  if (searchInput) searchInput.value = "";
  if (sortSelect) sortSelect.value = "default";
  if (catFilter) catFilter.value = "";

  const state = getState();

  if (view === "products") {
    if (state.products.status === "idle" || state.products.status === "error") {
      void loadProducts();
    } else {
      showCategoryFilter();
      populateCategoryFilter(state.categories);
      renderProductList(getFilteredProducts(), openProductDetail);
    }
  } else {
    if (state.users.status === "idle" || state.users.status === "error") {
      void loadUsers();
    } else {
      hideCategoryFilter();
      renderUserList(getFilteredUsers(), openUserDetail);
    }
  }
}

function initEventListeners(): void {
  // Navigation
  document.querySelectorAll<HTMLButtonElement>(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const view = btn.dataset.view as ViewName | undefined;
      if (view) switchView(view);
    });
  });

  // Search with debounce
  const searchInput = document.getElementById("search-input") as HTMLInputElement | null;
  if (searchInput) {
    const handleSearch = debounce((...args: unknown[]) => {
      const value = args[0] as string;
      setFilter({ query: value });
      rerenderCurrentView();
    }, 250);

    searchInput.addEventListener("input", (e) => {
      const target = e.target as HTMLInputElement;
      handleSearch(target.value);
    });
  }

  // Category filter
  const categoryFilter = document.getElementById("category-filter") as HTMLSelectElement | null;
  if (categoryFilter) {
    categoryFilter.addEventListener("change", () => {
      setFilter({ category: categoryFilter.value });
      rerenderCurrentView();
    });
  }

  // Sort
  const sortSelect = document.getElementById("sort-select") as HTMLSelectElement | null;
  if (sortSelect) {
    sortSelect.addEventListener("change", () => {
      setFilter({ sort: sortSelect.value as SortOption });
      rerenderCurrentView();
    });
  }

  // Modal close
  const modalClose = document.getElementById("modal-close");
  const modalOverlay = document.getElementById("modal-overlay");

  modalClose?.addEventListener("click", hideModal);
  modalOverlay?.addEventListener("click", (e) => {
    if (e.target === modalOverlay) hideModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") hideModal();
  });
}

// ─── Bootstrap ────────────────────────────────────────────────────────────────

function init(): void {
  initEventListeners();
  void loadProducts(); // load default view
}

init();
