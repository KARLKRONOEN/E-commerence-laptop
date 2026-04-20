// ============================================
// PRODUCT.JS — Product detail page (2D image gallery only)
// ============================================
import products from './products.js';
import { renderNavbar, renderFooter, renderProductCard, initNavbar, initGlobalListeners, Cart, Wishlist, formatPrice, renderStars, getParam, showToast } from './app.js';

const productId = parseInt(getParam('id'));
const product = products.find(p => p.id === productId);

if (!product) {
  document.getElementById('app').innerHTML = `
    ${renderNavbar()}
    <div class="container" style="padding-top: calc(var(--navbar-height) + 4rem); text-align:center; min-height:60vh;">
      <div class="cart-empty__icon" style="font-size:64px;">😕</div>
      <h1 style="margin:1rem 0;">Product Not Found</h1>
      <p style="color:var(--text-secondary); margin-bottom:2rem;">The laptop you're looking for doesn't exist.</p>
      <a href="catalog" class="btn btn--primary">Back to Catalog</a>
    </div>
    ${renderFooter()}
  `;
  initNavbar();
} else {
  // Related products (same category, exclude current)
  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  // Stock status
  let stockClass = 'stock-status--in-stock';
  let stockText = 'In Stock';
  if (product.stock <= 5) {
    stockClass = 'stock-status--low-stock';
    stockText = `Only ${product.stock} left`;
  }
  if (product.stock === 0) {
    stockClass = 'stock-status--out-of-stock';
    stockText = 'Out of Stock';
  }

  document.getElementById('app').innerHTML = `
    ${renderNavbar()}

    <section class="product-detail" id="product-detail">
      <div class="container">
        <!-- Breadcrumb -->
        <div class="page-header__breadcrumb" style="margin-bottom: var(--space-xl);">
          <a href="/">Home</a> <span>/</span>
          <a href="catalog">Catalog</a> <span>/</span>
          <a href="catalog?category=${product.category}">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</a> <span>/</span>
          <span>${product.name}</span>
        </div>

        <div class="product-detail__layout">
          <!-- Left: 2D Image Gallery -->
          <div class="product-viewer" id="product-viewer-section">
            <div class="product-viewer__2d-main" id="main-image-container">
              <img src="${product.images[0]}" alt="${product.name}" id="main-image-2d">
            </div>
            <div class="product-viewer__thumbnails" id="thumbnail-list">
              <button class="product-viewer__thumb active" id="thumb-0">
                <img src="${product.images[0]}" alt="${product.name} view 1">
              </button>
            </div>
          </div>

          <!-- Right: Info -->
          <div class="product-info" id="product-info">
            <span class="product-info__brand">${product.brand}</span>
            <h1 class="product-info__name" id="product-name">${product.name}</h1>

            <div class="product-info__rating">
              <span>${renderStars(product.rating)}</span>
              <span>${product.rating}</span>
              <span>(${product.reviews} reviews)</span>
            </div>

            <div class="product-info__price">
              <span class="product-info__price-current" id="product-price">${formatPrice(product.price)}</span>
              ${product.originalPrice ? `<span class="product-info__price-original">${formatPrice(product.originalPrice)}</span>` : ''}
              ${product.discount ? `<span class="product-info__price-discount">Save ${product.discount}%</span>` : ''}
            </div>

            <div class="stock-status ${stockClass}">
              <span class="stock-status__dot"></span>
              <span>${stockText}</span>
            </div>

            <p class="product-info__desc">${product.description}</p>

            <h3 style="font-size: var(--font-base); margin-top: var(--space-sm);">Specifications</h3>
            <div class="product-info__specs">
              <div class="spec-item">
                <div>
                  <div class="spec-item__label">Processor</div>
                  <div class="spec-item__value">${product.specs.cpu}</div>
                </div>
              </div>
              <div class="spec-item">
                <div>
                  <div class="spec-item__label">Memory</div>
                  <div class="spec-item__value">${product.specs.ram}</div>
                </div>
              </div>
              <div class="spec-item">
                <div>
                  <div class="spec-item__label">Storage</div>
                  <div class="spec-item__value">${product.specs.storage}</div>
                </div>
              </div>
              <div class="spec-item">
                <div>
                  <div class="spec-item__label">Graphics</div>
                  <div class="spec-item__value">${product.specs.gpu}</div>
                </div>
              </div>
              <div class="spec-item">
                <div>
                  <div class="spec-item__label">Display</div>
                  <div class="spec-item__value">${product.specs.display}</div>
                </div>
              </div>
              <div class="spec-item">
                <div>
                  <div class="spec-item__label">Battery</div>
                  <div class="spec-item__value">${product.specs.battery}</div>
                </div>
              </div>
            </div>

            <div class="product-info__actions">
              <button class="btn btn--primary btn--lg" id="add-to-cart-btn" ${product.stock === 0 ? 'disabled' : ''}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="20" height="20"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                Add to Cart
              </button>
              <button class="btn btn--secondary btn--lg btn--icon" id="wishlist-detail-btn" aria-label="Add to wishlist" style="width:52px; height:52px;">
                <svg viewBox="0 0 24 24" fill="${Wishlist.has(product.id) ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" width="22" height="22"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              </button>
            </div>
          </div>
        </div>

        ${related.length > 0 ? `
        <!-- Related Products -->
        <section class="section" id="related-products">
          <div class="section-header">
            <h2 class="section-header__title">Related <span class="text-gradient">Laptops</span></h2>
          </div>
          <div class="product-grid">
            ${related.map(p => renderProductCard(p)).join('')}
          </div>
        </section>
        ` : ''}
      </div>
    </section>

    ${renderFooter()}
  `;

  // ---- Initialize ----
  initNavbar();
  initGlobalListeners(products);

  // ---- Add to Cart ----
  document.getElementById('add-to-cart-btn')?.addEventListener('click', () => {
    Cart.add(product);
  });

  // ---- Wishlist ----
  document.getElementById('wishlist-detail-btn')?.addEventListener('click', () => {
    const isActive = Wishlist.toggle(product.id);
    const svg = document.querySelector('#wishlist-detail-btn svg');
    if (svg) svg.setAttribute('fill', isActive ? 'currentColor' : 'none');
  });
}
