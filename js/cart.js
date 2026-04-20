// ============================================
// CART.JS — Shopping cart page
// ============================================
import products from './products.js';
import { renderNavbar, renderFooter, initNavbar, initGlobalListeners, Cart, formatPrice, showToast } from './app.js';

function renderCartPage() {
  const items = Cart.getAll();
  const subtotal = Cart.getTotal();
  const shipping = subtotal >= 500 ? 0 : 29;
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + shipping + tax;

  document.getElementById('app').innerHTML = `
    ${renderNavbar('cart')}

    <section class="cart-page" id="cart-page">
      <div class="container">
        <h1 style="font-size: var(--font-3xl); font-weight: 800; margin-bottom: var(--space-xl);">
          Shopping <span class="text-gradient">Cart</span>
          <span style="font-size: var(--font-base); color: var(--text-muted); font-weight: 400;">(${items.length} item${items.length !== 1 ? 's' : ''})</span>
        </h1>

        ${items.length === 0 ? `
          <div class="cart-empty">
            <div class="cart-empty__icon">🛒</div>
            <h2 class="cart-empty__title">Your cart is empty</h2>
            <p class="cart-empty__text">Looks like you haven't added any laptops yet. Browse our catalog to find the perfect one!</p>
            <a href="catalog" class="btn btn--primary btn--lg" id="empty-cart-cta">Browse Laptops</a>
          </div>
        ` : `
          <div class="cart-layout">
            <!-- Cart Items -->
            <div class="cart-items" id="cart-items">
              ${items.map(item => `
                <div class="cart-item" data-cart-id="${item.id}" id="cart-item-${item.id}">
                  <div class="cart-item__image">
                    <a href="product?id=${item.id}">
                      <img src="${item.image}" alt="${item.name}">
                    </a>
                  </div>
                  <div class="cart-item__details">
                    <span class="cart-item__brand">${item.brand}</span>
                    <a href="product?id=${item.id}" class="cart-item__name">${item.name}</a>
                    <span class="cart-item__price">${formatPrice(item.price)}</span>
                  </div>
                  <div class="cart-item__controls">
                    <div class="qty-control">
                      <button class="qty-minus" data-id="${item.id}" id="qty-minus-${item.id}" aria-label="Decrease quantity">−</button>
                      <span class="qty-control__value" id="qty-value-${item.id}">${item.qty}</span>
                      <button class="qty-plus" data-id="${item.id}" id="qty-plus-${item.id}" aria-label="Increase quantity">+</button>
                    </div>
                    <button class="btn btn--danger btn--sm" data-remove="${item.id}" id="remove-${item.id}">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                      Remove
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>

            <!-- Cart Summary -->
            <div class="cart-summary" id="cart-summary">
              <h2 class="cart-summary__title">Order Summary</h2>
              <div class="cart-summary__row">
                <span>Subtotal</span>
                <span>${formatPrice(subtotal)}</span>
              </div>
              <div class="cart-summary__row">
                <span>Shipping</span>
                <span>${shipping === 0 ? '<span style="color:var(--accent-green)">FREE</span>' : formatPrice(shipping)}</span>
              </div>
              <div class="cart-summary__row">
                <span>Tax (8%)</span>
                <span>${formatPrice(tax)}</span>
              </div>
              <div class="cart-summary__row cart-summary__row--total">
                <span>Total</span>
                <span id="cart-total">${formatPrice(total)}</span>
              </div>
              ${shipping > 0 ? `<p style="font-size:var(--font-xs); color:var(--text-muted); margin-top:var(--space-sm);">Free shipping on orders over $500</p>` : ''}
              <a href="checkout" class="btn btn--primary btn--lg" id="checkout-btn">
                Proceed to Checkout
              </a>
              <a href="catalog" class="btn btn--secondary" id="continue-shopping" style="width:100%; margin-top:var(--space-sm);">
                Continue Shopping
              </a>
            </div>
          </div>
        `}
      </div>
    </section>

    ${renderFooter()}
  `;

  attachCartEvents();
}

function attachCartEvents() {
  // Quantity controls
  document.querySelectorAll('.qty-minus').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      const items = Cart.getAll();
      const item = items.find(i => i.id === id);
      if (item && item.qty > 1) {
        Cart.updateQty(id, item.qty - 1);
        renderCartPage();
      }
    });
  });

  document.querySelectorAll('.qty-plus').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      const items = Cart.getAll();
      const item = items.find(i => i.id === id);
      if (item) {
        Cart.updateQty(id, item.qty + 1);
        renderCartPage();
      }
    });
  });

  // Remove item
  document.querySelectorAll('[data-remove]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.remove);
      Cart.remove(id);
      showToast('Item removed from cart', 'info');
      renderCartPage();
    });
  });
}

// ---- Init ----
renderCartPage();
initNavbar();
initGlobalListeners(products);
