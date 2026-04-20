// ============================================
// CATALOG.JS — Catalog page: filter, sort, render
// ============================================
import products from './products.js';
import { renderNavbar, renderFooter, renderProductCard, initNavbar, initGlobalListeners, getParam } from './app.js';

// ---- State ----
let filters = {
  search: getParam('search') || '',
  category: getParam('category') || '',
  brands: [],
  minPrice: 0,
  maxPrice: 10000,
  sort: 'popular'
};

// Unique values for filters
const brands = [...new Set(products.map(p => p.brand))];
const categories = [...new Set(products.map(p => p.category))];

function getFilteredProducts() {
  let result = [...products];

  // Search
  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }

  // Category
  if (filters.category) {
    result = result.filter(p => p.category === filters.category);
  }

  // Brands
  if (filters.brands.length > 0) {
    result = result.filter(p => filters.brands.includes(p.brand));
  }

  // Price range
  result = result.filter(p => p.price >= filters.minPrice && p.price <= filters.maxPrice);

  // Sort
  switch (filters.sort) {
    case 'price-asc':
      result.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      result.sort((a, b) => b.price - a.price);
      break;
    case 'newest':
      result.sort((a, b) => b.id - a.id);
      break;
    case 'popular':
    default:
      result.sort((a, b) => b.reviews - a.reviews);
      break;
  }

  return result;
}

function renderCatalog() {
  const filtered = getFilteredProducts();

  document.getElementById('app').innerHTML = `
    ${renderNavbar('catalog')}

    <div class="container">
      <div class="catalog-layout">
        <!-- Sidebar -->
        <aside class="catalog-sidebar" id="catalog-sidebar">
          <div class="filter-group">
            <h3 class="filter-group__title">🔍 Search</h3>
            <div style="position:relative;">
              <input type="text" id="filter-search" value="${filters.search}" placeholder="Search laptops..."
                style="width:100%; background:var(--bg-glass); border:1px solid var(--border-glass); border-radius:var(--radius-sm); padding:var(--space-sm) var(--space-md); outline:none; color:var(--text-primary); font-size:var(--font-sm);">
            </div>
          </div>

          <div class="filter-group">
            <h3 class="filter-group__title">📂 Category</h3>
            <div class="filter-group__options">
              <label class="filter-option">
                <input type="checkbox" value="" ${!filters.category ? 'checked' : ''} name="category" id="filter-cat-all">
                All Categories
              </label>
              ${categories.map(cat => `
                <label class="filter-option">
                  <input type="checkbox" value="${cat}" ${filters.category === cat ? 'checked' : ''} name="category" id="filter-cat-${cat}">
                  ${cat.charAt(0).toUpperCase() + cat.slice(1)}
                </label>
              `).join('')}
            </div>
          </div>

          <div class="filter-group">
            <h3 class="filter-group__title">🏷️ Brand</h3>
            <div class="filter-group__options">
              ${brands.map(brand => `
                <label class="filter-option">
                  <input type="checkbox" value="${brand}" ${filters.brands.includes(brand) ? 'checked' : ''} name="brand" id="filter-brand-${brand.replace(/\s/g, '')}">
                  ${brand}
                </label>
              `).join('')}
            </div>
          </div>

          <div class="filter-group">
            <h3 class="filter-group__title">💲 Price Range</h3>
            <div class="price-range">
              <input type="number" id="filter-min-price" placeholder="Min" value="${filters.minPrice || ''}" min="0">
              <span style="color:var(--text-muted);">—</span>
              <input type="number" id="filter-max-price" placeholder="Max" value="${filters.maxPrice < 10000 ? filters.maxPrice : ''}" min="0">
            </div>
          </div>

          <button class="btn btn--primary" id="apply-filters" style="width:100%;">Apply Filters</button>
          <button class="btn btn--secondary" id="clear-filters" style="width:100%; margin-top:var(--space-sm);">Clear All</button>
        </aside>

        <!-- Main Content -->
        <main id="catalog-main">
          <div class="catalog-toolbar">
            <span class="catalog-toolbar__count" id="result-count">${filtered.length} laptop${filtered.length !== 1 ? 's' : ''} found</span>
            <div class="catalog-toolbar__sort">
              <label for="sort-select">Sort by:</label>
              <select id="sort-select">
                <option value="popular" ${filters.sort === 'popular' ? 'selected' : ''}>Most Popular</option>
                <option value="price-asc" ${filters.sort === 'price-asc' ? 'selected' : ''}>Price: Low → High</option>
                <option value="price-desc" ${filters.sort === 'price-desc' ? 'selected' : ''}>Price: High → Low</option>
                <option value="newest" ${filters.sort === 'newest' ? 'selected' : ''}>Newest First</option>
              </select>
            </div>
          </div>

          <div class="product-grid" id="product-grid">
            ${filtered.length > 0
              ? filtered.map(p => renderProductCard(p)).join('')
              : `<div class="cart-empty" style="grid-column:1/-1;">
                  <div class="cart-empty__icon">🔍</div>
                  <h3 class="cart-empty__title">No laptops found</h3>
                  <p class="cart-empty__text">Try adjusting your filters or search terms.</p>
                </div>`
            }
          </div>
        </main>
      </div>
    </div>

    ${renderFooter()}
  `;

  attachEvents();
}

function attachEvents() {
  // Sort
  document.getElementById('sort-select')?.addEventListener('change', (e) => {
    filters.sort = e.target.value;
    renderCatalog();
  });

  // Search
  document.getElementById('filter-search')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      filters.search = e.target.value;
      renderCatalog();
    }
  });

  // Category checkboxes (radio behavior)
  document.querySelectorAll('input[name="category"]').forEach(cb => {
    cb.addEventListener('change', (e) => {
      document.querySelectorAll('input[name="category"]').forEach(c => c.checked = false);
      e.target.checked = true;
      filters.category = e.target.value;
      renderCatalog();
    });
  });

  // Brand checkboxes
  document.querySelectorAll('input[name="brand"]').forEach(cb => {
    cb.addEventListener('change', () => {
      filters.brands = [...document.querySelectorAll('input[name="brand"]:checked')].map(c => c.value);
      renderCatalog();
    });
  });

  // Apply filters
  document.getElementById('apply-filters')?.addEventListener('click', () => {
    const minPrice = document.getElementById('filter-min-price')?.value;
    const maxPrice = document.getElementById('filter-max-price')?.value;
    filters.minPrice = minPrice ? parseInt(minPrice) : 0;
    filters.maxPrice = maxPrice ? parseInt(maxPrice) : 10000;
    filters.search = document.getElementById('filter-search')?.value || '';
    renderCatalog();
  });

  // Clear filters
  document.getElementById('clear-filters')?.addEventListener('click', () => {
    filters = { search: '', category: '', brands: [], minPrice: 0, maxPrice: 10000, sort: 'popular' };
    renderCatalog();
  });
}

// ---- Init ----
renderCatalog();
initNavbar();
initGlobalListeners(products);
