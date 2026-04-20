// ============================================
// APP.JS — Shared utilities, cart, toast, navbar
// ============================================

// ---- Cart Management (localStorage) ----
export const Cart = {
  KEY: 'laptopshop_cart',

  getAll() {
    try {
      return JSON.parse(localStorage.getItem(this.KEY)) || [];
    } catch {
      return [];
    }
  },

  save(items) {
    localStorage.setItem(this.KEY, JSON.stringify(items));
    this.updateBadge();
  },

  add(product, qty = 1) {
    const items = this.getAll();
    const existing = items.find(i => i.id === product.id);
    if (existing) {
      existing.qty += qty;
    } else {
      items.push({
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images[0],
        qty
      });
    }
    this.save(items);
    showToast(`${product.name} added to cart!`, 'success');
  },

  remove(productId) {
    let items = this.getAll();
    items = items.filter(i => i.id !== productId);
    this.save(items);
  },

  updateQty(productId, qty) {
    const items = this.getAll();
    const item = items.find(i => i.id === productId);
    if (item) {
      item.qty = Math.max(1, qty);
    }
    this.save(items);
  },

  getTotal() {
    return this.getAll().reduce((sum, i) => sum + i.price * i.qty, 0);
  },

  getCount() {
    return this.getAll().reduce((sum, i) => sum + i.qty, 0);
  },

  clear() {
    localStorage.removeItem(this.KEY);
    this.updateBadge();
  },

  updateBadge() {
    const badge = document.querySelector('.navbar__cart-badge');
    if (!badge) return;
    const count = this.getCount();
    badge.textContent = count;
    badge.classList.toggle('visible', count > 0);
  }
};

// ---- Wishlist Management ----
export const Wishlist = {
  KEY: 'laptopshop_wishlist',

  getAll() {
    try {
      return JSON.parse(localStorage.getItem(this.KEY)) || [];
    } catch {
      return [];
    }
  },

  toggle(productId) {
    let items = this.getAll();
    const index = items.indexOf(productId);
    if (index > -1) {
      items.splice(index, 1);
      showToast('Removed from wishlist', 'info');
    } else {
      items.push(productId);
      showToast('Added to wishlist ❤️', 'success');
    }
    localStorage.setItem(this.KEY, JSON.stringify(items));
    return items.includes(productId);
  },

  has(productId) {
    return this.getAll().includes(productId);
  }
};

// ---- Toast Notifications ----
let toastContainer;

export function showToast(message, type = 'info') {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️'
  };

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `
    <span class="toast__icon">${icons[type] || icons.info}</span>
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3200);
}

// ---- Currency Formatter ----
export function formatPrice(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

// ---- URL Params Helper ----
export function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

// ---- Stars Rating HTML ----
export function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

// ---- Theme Toggle ----
export function initTheme() {
  const saved = localStorage.getItem('laptopshop_theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(saved);
}

function updateThemeIcon(theme) {
  const btn = document.getElementById('theme-toggle-btn');
  if (!btn) return;
  btn.textContent = theme === 'dark' ? '☀️' : '🌙';
  btn.title = theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
}

// ---- Navbar scroll shadow ----
function initNavbarScroll() {
  const navbar = document.getElementById('main-navbar');
  if (!navbar) return;
  const handler = () => navbar.classList.toggle('scrolled', window.scrollY > 8);
  window.addEventListener('scroll', handler, { passive: true });
  handler();
}

export function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('laptopshop_theme', next);
  updateThemeIcon(next);
}

// ---- Navbar Initialization ----
export function initNavbar() {
  // Init theme
  initTheme();

  // Navbar scroll shadow
  initNavbarScroll();

  // Cart badge
  Cart.updateBadge();

  // Mobile menu toggle
  const menuBtn = document.querySelector('.navbar__menu-btn');
  const links = document.querySelector('.navbar__links');
  if (menuBtn && links) {
    menuBtn.addEventListener('click', () => {
      links.classList.toggle('mobile-open');
    });
  }

  // Search functionality
  const searchInput = document.querySelector('.navbar__search input');
  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && searchInput.value.trim()) {
        window.location.href = `catalog?search=${encodeURIComponent(searchInput.value.trim())}`;
      }
    });
  }

  // Theme toggle
  const themeBtn = document.getElementById('theme-toggle-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', toggleTheme);
  }
}

// ---- Render Topbar ----
function renderTopbar() {
  return `
  <div class="topbar" id="topbar">
    <div class="container">
      <div class="topbar__left">
        <span>📧 support@laptopverse.com</span>
        <span>📞 +1 (800) 555-0199</span>
      </div>
      <div class="topbar__right">
        <a href="#">Free Shipping on orders $500+</a>
      </div>
    </div>
  </div>`;
}

// ---- Render Navbar HTML ----
export function renderNavbar(activePage = '') {
  return `
  ${renderTopbar()}
  <nav class="navbar" id="main-navbar">
    <div class="container">
      <a href="/" class="navbar__logo" id="logo">
        <div class="navbar__logo-mark">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="4" width="20" height="14" rx="2"/>
            <line x1="5" y1="22" x2="19" y2="22"/>
            <line x1="12" y1="18" x2="12" y2="22"/>
          </svg>
        </div>
        <div class="navbar__logo-text">
          <span class="navbar__logo-name">Laptop<span>Verse</span></span>
          <span class="navbar__logo-tagline">Premium Selection</span>
        </div>
      </a>

      <div class="navbar__search" id="navbar-search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input type="text" placeholder="Search laptops..." id="search-input">
      </div>

      <div class="navbar__actions">
        <div class="navbar__links">
          <a href="/" class="navbar__link ${activePage === 'home' ? 'active' : ''}" id="nav-home">Home</a>
          <a href="catalog" class="navbar__link ${activePage === 'catalog' ? 'active' : ''}" id="nav-catalog">Catalog</a>
          <a href="cart" class="navbar__link ${activePage === 'cart' ? 'active' : ''}" id="nav-cart">Cart</a>
        </div>

        <button class="theme-toggle" id="theme-toggle-btn" title="Toggle theme">🌙</button>

        <a href="cart" class="navbar__cart-btn" id="cart-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          <span class="navbar__cart-badge" id="cart-badge">0</span>
        </a>

        <button class="navbar__menu-btn" id="menu-toggle" aria-label="Toggle menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </nav>`;
}

// ---- Render Footer HTML ----
export function renderFooter() {
  return `
  <footer class="footer" id="site-footer">
    <div class="container">
      <div class="footer__grid">
        <div class="footer__brand">
          <a href="/" class="navbar__logo">
            <div class="navbar__logo-mark" style="width:32px;height:32px;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" width="17" height="17">
                <rect x="2" y="4" width="20" height="14" rx="2"/>
                <line x1="5" y1="22" x2="19" y2="22"/>
                <line x1="12" y1="18" x2="12" y2="22"/>
              </svg>
            </div>
            <div class="navbar__logo-text">
              <span class="navbar__logo-name">Laptop<span>Verse</span></span>
            </div>
          </a>
          <p>Your trusted destination for premium laptops. We offer the best selection, competitive prices, and exceptional customer service.</p>
        </div>
        <div>
          <h4 class="footer__heading">Shop</h4>
          <div class="footer__links">
            <a href="catalog?category=gaming" class="footer__link">Gaming</a>
            <a href="catalog?category=business" class="footer__link">Business</a>
            <a href="catalog?category=ultrabook" class="footer__link">Ultrabook</a>
            <a href="catalog?category=budget" class="footer__link">Budget</a>
          </div>
        </div>
        <div>
          <h4 class="footer__heading">Support</h4>
          <div class="footer__links">
            <a href="#" class="footer__link">Help Center</a>
            <a href="#" class="footer__link">Shipping Info</a>
            <a href="#" class="footer__link">Returns</a>
            <a href="#" class="footer__link">Warranty</a>
          </div>
        </div>
        <div>
          <h4 class="footer__heading">Company</h4>
          <div class="footer__links">
            <a href="#" class="footer__link">About Us</a>
            <a href="#" class="footer__link">Careers</a>
            <a href="#" class="footer__link">Blog</a>
            <a href="#" class="footer__link">Contact</a>
          </div>
        </div>
      </div>
      <div class="footer__bottom">
        <span>&copy; 2026 LaptopVerse. All rights reserved.</span>
        <div class="footer__socials">
          <a href="#" class="footer__social" aria-label="Twitter">𝕏</a>
          <a href="#" class="footer__social" aria-label="Instagram">📷</a>
          <a href="#" class="footer__social" aria-label="YouTube">▶</a>
          <a href="#" class="footer__social" aria-label="Discord">💬</a>
        </div>
      </div>
    </div>
  </footer>`;
}

// ---- Product Card HTML ----
export function renderProductCard(product) {
  const wishlisted = Wishlist.has(product.id);
  return `
  <div class="card product-card" data-id="${product.id}" id="product-card-${product.id}">
    <div class="product-card__image">
      <img src="${product.images[0]}" alt="${product.name}" loading="lazy">
      ${product.discount ? `<span class="product-card__badge">-${product.discount}%</span>` : ''}
      <button class="product-card__wishlist ${wishlisted ? 'active' : ''}" data-wishlist="${product.id}" id="wishlist-btn-${product.id}" aria-label="Toggle wishlist">
        <svg viewBox="0 0 24 24" fill="${wishlisted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
      </button>
    </div>
    <div class="product-card__info">
      <span class="product-card__brand">${product.brand}</span>
      <h3 class="product-card__name">${product.name}</h3>
      <div class="product-card__specs">
        <span class="product-card__spec">${product.specs.cpu.split(' ').slice(-1)}</span>
        <span class="product-card__spec">${product.specs.ram}</span>
        <span class="product-card__spec">${product.specs.gpu.split(' ').slice(-1)}</span>
      </div>
    </div>
    <div class="product-card__bottom">
      <div class="product-card__price">
        <span class="product-card__price-current">${formatPrice(product.price)}</span>
        ${product.originalPrice ? `<span class="product-card__price-original">${formatPrice(product.originalPrice)}</span>` : ''}
      </div>
      <button class="product-card__add-btn" data-add-cart="${product.id}" id="add-cart-${product.id}" aria-label="Add to cart">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      </button>
    </div>
  </div>`;
}

// ---- Scroll Animation Observer ----
export function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.animate-in').forEach(el => observer.observe(el));
}

// ---- Global Event Delegation ----
export function initGlobalListeners(productsData) {
  document.addEventListener('click', (e) => {
    // Add to cart
    const addBtn = e.target.closest('[data-add-cart]');
    if (addBtn) {
      e.stopPropagation();
      const id = parseInt(addBtn.dataset.addCart);
      const product = productsData.find(p => p.id === id);
      if (product) Cart.add(product);
      return;
    }

    // Wishlist toggle
    const wishBtn = e.target.closest('[data-wishlist]');
    if (wishBtn) {
      e.stopPropagation();
      const id = parseInt(wishBtn.dataset.wishlist);
      const isActive = Wishlist.toggle(id);
      wishBtn.classList.toggle('active', isActive);
      const svg = wishBtn.querySelector('svg');
      if (svg) svg.setAttribute('fill', isActive ? 'currentColor' : 'none');
      return;
    }

    // Product card click → go to detail
    const card = e.target.closest('.product-card');
    if (card && !e.target.closest('button')) {
      const id = card.dataset.id;
      window.location.href = `product?id=${id}`;
    }
  });
}
