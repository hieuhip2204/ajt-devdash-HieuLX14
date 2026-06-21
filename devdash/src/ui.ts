import type { Product, User, AppState, CategoriesResponse } from "./types.js";
import { truncate, stars } from "./utils.js";

// ─── DOM helpers ──────────────────────────────────────────────────────────────

function el<K extends keyof HTMLElementTagNameMap>(id: K): HTMLElementTagNameMap[K] | null {
  return document.querySelector<HTMLElementTagNameMap[K]>(`#${id}`);
}

function getEl(id: string): HTMLElement {
  const node = document.getElementById(id);
  if (!node) throw new Error(`Element #${id} not found`);
  return node;
}

// ─── Loading / Error / Empty states ──────────────────────────────────────────

function renderStatus(state: AppState<unknown>): string {
  switch (state.status) {
    case "idle":
      return `<div class="state-msg">Select a view to begin.</div>`;
    case "loading":
      return `
        <div class="state-msg loading-grid">
          ${Array.from({ length: 12 })
            .map(() => `<div class="skeleton-card"></div>`)
            .join("")}
        </div>`;
    case "error":
      return `<div class="state-msg error">⚠ ${state.message}</div>`;
    case "success":
      return "";
  }
}

// ─── Product List ─────────────────────────────────────────────────────────────

export function renderProductList(
  products: Product[],
  onSelect: (id: number) => void
): void {
  const content = getEl("content");

  if (products.length === 0) {
    content.innerHTML = `<div class="state-msg">No products match your filters.</div>`;
    return;
  }

  content.innerHTML = `
    <div class="results-meta">${products.length} product${products.length !== 1 ? "s" : ""}</div>
    <div class="card-grid">
      ${products.map((p) => productCard(p)).join("")}
    </div>`;

  content.querySelectorAll<HTMLElement>("[data-product-id]").forEach((card) => {
    card.addEventListener("click", () => {
      const id = Number(card.dataset.productId);
      onSelect(id);
    });
  });
}

function productCard(p: Product): string {
  const discountedPrice = p.price * (1 - p.discountPercentage / 100);
  return `
    <article class="card" data-product-id="${p.id}" tabindex="0" role="button" aria-label="${p.title}">
      <div class="card-img-wrap">
        <img src="${p.thumbnail}" alt="${p.title}" loading="lazy" />
        ${p.discountPercentage > 0 ? `<span class="badge badge-discount">-${Math.round(p.discountPercentage)}%</span>` : ""}
      </div>
      <div class="card-body">
        <p class="card-category">${p.category}</p>
        <h3 class="card-title">${truncate(p.title, 40)}</h3>
        <p class="card-brand">${p.brand}</p>
        <div class="card-footer">
          <div class="card-price">
            <span class="price-now">$${discountedPrice.toFixed(2)}</span>
            ${p.discountPercentage > 0 ? `<span class="price-was">$${p.price.toFixed(2)}</span>` : ""}
          </div>
          <span class="card-rating">${stars(p.rating)}</span>
        </div>
      </div>
    </article>`;
}

// ─── User List ────────────────────────────────────────────────────────────────

export function renderUserList(
  users: User[],
  onSelect: (id: number) => void
): void {
  const content = getEl("content");

  if (users.length === 0) {
    content.innerHTML = `<div class="state-msg">No users match your search.</div>`;
    return;
  }

  content.innerHTML = `
    <div class="results-meta">${users.length} user${users.length !== 1 ? "s" : ""}</div>
    <div class="card-grid card-grid--users">
      ${users.map((u) => userCard(u)).join("")}
    </div>`;

  content.querySelectorAll<HTMLElement>("[data-user-id]").forEach((card) => {
    card.addEventListener("click", () => {
      onSelect(Number(card.dataset.userId));
    });
  });
}

function userCard(u: User): string {
  return `
    <article class="card card--user" data-user-id="${u.id}" tabindex="0" role="button" aria-label="${u.firstName} ${u.lastName}">
      <img class="user-avatar" src="${u.image}" alt="${u.firstName}" />
      <div class="card-body">
        <h3 class="card-title">${u.firstName} ${u.lastName}</h3>
        <p class="card-category">${u.company.title} · ${u.company.name}</p>
        <p class="card-brand">${u.email}</p>
        <p class="user-location">Age ${u.age} · ${u.address.city}, ${u.address.country}</p>
      </div>
    </article>`;
}

// ─── Status overlays ──────────────────────────────────────────────────────────

export function renderProductStatus(state: AppState<Product[]>): void {
  const html = renderStatus(state);
  if (html) getEl("content").innerHTML = html;
}

export function renderUserStatus(state: AppState<User[]>): void {
  const html = renderStatus(state);
  if (html) getEl("content").innerHTML = html;
}

// ─── Category filter dropdown ─────────────────────────────────────────────────

export function populateCategoryFilter(cats: CategoriesResponse[]): void {
  const select = document.getElementById("category-filter") as HTMLSelectElement | null;
  if (!select) return;

  const options = cats
    .map((c) => `<option value="${c.slug}">${c.name}</option>`)
    .join("");
  select.innerHTML = `<option value="">All categories</option>${options}`;
}

export function hideCategoryFilter(): void {
  const section = document.getElementById("filter-section");
  if (section) section.style.display = "none";
}

export function showCategoryFilter(): void {
  const section = document.getElementById("filter-section");
  if (section) section.style.display = "";
}

// ─── Modal ────────────────────────────────────────────────────────────────────

export function showModal(html: string): void {
  getEl("modal-body").innerHTML = html;
  getEl("modal-overlay").classList.remove("hidden");
  document.body.classList.add("modal-open");
}

export function hideModal(): void {
  getEl("modal-overlay").classList.add("hidden");
  document.body.classList.remove("modal-open");
  getEl("modal-body").innerHTML = "";
}

export function showModalLoading(): void {
  showModal(`<div class="modal-loading"><div class="spinner"></div><p>Loading…</p></div>`);
}

export function renderProductDetail(p: Product): void {
  const discountedPrice = p.price * (1 - p.discountPercentage / 100);
  showModal(`
    <div class="detail-grid">
      <div class="detail-images">
        <img class="detail-main-img" src="${p.images[0] ?? p.thumbnail}" alt="${p.title}" />
      </div>
      <div class="detail-info">
        <p class="card-category">${p.category}</p>
        <h2 class="detail-title">${p.title}</h2>
        <p class="detail-brand">by ${p.brand}</p>
        <div class="detail-rating">${stars(p.rating)} <span class="rating-num">${p.rating.toFixed(1)}</span></div>
        <p class="detail-desc">${p.description}</p>
        <div class="detail-price">
          <span class="price-now price-now--lg">$${discountedPrice.toFixed(2)}</span>
          ${p.discountPercentage > 0 ? `<span class="price-was">$${p.price.toFixed(2)}</span><span class="badge badge-discount">-${Math.round(p.discountPercentage)}%</span>` : ""}
        </div>
        <p class="detail-stock ${p.stock < 10 ? "stock-low" : ""}">
          ${p.stock < 10 ? "⚠ Only" : "✓"} ${p.stock} in stock
        </p>
      </div>
    </div>`);
}

export function renderUserDetail(u: User): void {
  showModal(`
    <div class="user-detail">
      <img class="user-detail-avatar" src="${u.image}" alt="${u.firstName}" />
      <div class="user-detail-info">
        <h2 class="detail-title">${u.firstName} ${u.lastName}</h2>
        <p class="card-category">@${u.username}</p>
        <div class="user-detail-grid">
          <div class="user-detail-item"><span class="detail-label">Email</span>${u.email}</div>
          <div class="user-detail-item"><span class="detail-label">Age</span>${u.age}</div>
          <div class="user-detail-item"><span class="detail-label">Gender</span>${u.gender}</div>
          <div class="user-detail-item"><span class="detail-label">Company</span>${u.company.name}</div>
          <div class="user-detail-item"><span class="detail-label">Title</span>${u.company.title}</div>
          <div class="user-detail-item"><span class="detail-label">Department</span>${u.company.department}</div>
          <div class="user-detail-item"><span class="detail-label">City</span>${u.address.city}</div>
          <div class="user-detail-item"><span class="detail-label">Country</span>${u.address.country}</div>
        </div>
      </div>
    </div>`);
}

// ─── Nav active state ─────────────────────────────────────────────────────────

export function setActiveNav(view: string): void {
  document.querySelectorAll<HTMLButtonElement>(".nav-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.view === view);
  });
}

// suppress unused warning
void el;
