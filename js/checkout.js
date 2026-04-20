// ============================================
// CHECKOUT.JS — Multi-step checkout page
// ============================================
import products from './products.js';
import { renderNavbar, renderFooter, initNavbar, Cart, formatPrice, showToast } from './app.js';

let currentStep = 1; // 1=Shipping, 2=Payment, 3=Review

function renderCheckout() {
  const items = Cart.getAll();
  const subtotal = Cart.getTotal();
  const shipping = subtotal >= 500 ? 0 : 29;
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + shipping + tax;

  if (items.length === 0 && currentStep < 4) {
    document.getElementById('app').innerHTML = `
      ${renderNavbar()}
      <div class="container" style="padding-top: calc(var(--navbar-height) + 4rem); text-align:center; min-height:60vh;">
        <div class="cart-empty__icon" style="font-size:64px;">🛒</div>
        <h1 style="margin:1rem 0;">Your cart is empty</h1>
        <p style="color:var(--text-secondary); margin-bottom:2rem;">Add some laptops before checking out.</p>
        <a href="catalog" class="btn btn--primary">Browse Laptops</a>
      </div>
      ${renderFooter()}
    `;
    initNavbar();
    return;
  }

  document.getElementById('app').innerHTML = `
    ${renderNavbar()}

    <section class="checkout-page" id="checkout-page">
      <div class="container">
        <h1 style="font-size: var(--font-3xl); font-weight: 800; margin-bottom: var(--space-lg);">
          <span class="text-gradient">Checkout</span>
        </h1>

        <!-- Steps Indicator -->
        <div class="checkout-steps" id="checkout-steps">
          <div class="checkout-step ${currentStep >= 1 ? (currentStep > 1 ? 'completed' : 'active') : ''}" id="step-1">
            <span class="checkout-step__number">${currentStep > 1 ? '✓' : '1'}</span>
            <span>Shipping</span>
          </div>
          <div class="checkout-step ${currentStep >= 2 ? (currentStep > 2 ? 'completed' : 'active') : ''}" id="step-2">
            <span class="checkout-step__number">${currentStep > 2 ? '✓' : '2'}</span>
            <span>Payment</span>
          </div>
          <div class="checkout-step ${currentStep >= 3 ? (currentStep > 3 ? 'completed' : 'active') : ''}" id="step-3">
            <span class="checkout-step__number">${currentStep > 3 ? '✓' : '3'}</span>
            <span>Review</span>
          </div>
        </div>

        <div class="checkout-layout">
          <div id="checkout-form-area">
            ${currentStep === 1 ? renderShippingForm() : ''}
            ${currentStep === 2 ? renderPaymentForm() : ''}
            ${currentStep === 3 ? renderReviewStep(items, subtotal, shipping, tax, total) : ''}
            ${currentStep === 4 ? renderSuccess() : ''}
          </div>

          ${currentStep < 4 ? `
          <!-- Order Summary -->
          <div class="cart-summary" id="checkout-summary">
            <h2 class="cart-summary__title">Order Summary</h2>
            ${items.map(item => `
              <div style="display:flex; justify-content:space-between; align-items:center; padding:var(--space-sm) 0; font-size:var(--font-sm);">
                <div style="display:flex;align-items:center;gap:var(--space-sm);">
                  <img src="${item.image}" alt="${item.name}" style="width:40px;height:32px;object-fit:contain;border-radius:4px;background:var(--bg-glass);">
                  <div>
                    <div style="font-weight:500;">${item.name}</div>
                    <div style="color:var(--text-muted);font-size:var(--font-xs);">Qty: ${item.qty}</div>
                  </div>
                </div>
                <span style="font-weight:600;">${formatPrice(item.price * item.qty)}</span>
              </div>
            `).join('')}
            <div class="cart-summary__row" style="margin-top:var(--space-md); border-top:1px solid var(--border-glass); padding-top:var(--space-md);">
              <span>Subtotal</span><span>${formatPrice(subtotal)}</span>
            </div>
            <div class="cart-summary__row">
              <span>Shipping</span><span>${shipping === 0 ? '<span style="color:var(--accent-green)">FREE</span>' : formatPrice(shipping)}</span>
            </div>
            <div class="cart-summary__row">
              <span>Tax</span><span>${formatPrice(tax)}</span>
            </div>
            <div class="cart-summary__row cart-summary__row--total">
              <span>Total</span><span>${formatPrice(total)}</span>
            </div>
          </div>
          ` : ''}
        </div>
      </div>
    </section>

    ${renderFooter()}
  `;

  initNavbar();
  attachCheckoutEvents();
}

function renderShippingForm() {
  return `
    <div class="form-section" id="shipping-form">
      <h2 class="form-section__title">📦 Shipping Information</h2>
      <div class="form-grid">
        <div class="form-group">
          <label for="first-name">First Name *</label>
          <input type="text" id="first-name" placeholder="John" required>
        </div>
        <div class="form-group">
          <label for="last-name">Last Name *</label>
          <input type="text" id="last-name" placeholder="Doe" required>
        </div>
        <div class="form-group form-group--full">
          <label for="email">Email Address *</label>
          <input type="email" id="email" placeholder="john@example.com" required>
        </div>
        <div class="form-group form-group--full">
          <label for="address">Street Address *</label>
          <input type="text" id="address" placeholder="123 Main St" required>
        </div>
        <div class="form-group">
          <label for="city">City *</label>
          <input type="text" id="city" placeholder="New York" required>
        </div>
        <div class="form-group">
          <label for="state">State *</label>
          <input type="text" id="state" placeholder="NY" required>
        </div>
        <div class="form-group">
          <label for="zip">ZIP Code *</label>
          <input type="text" id="zip" placeholder="10001" required>
        </div>
        <div class="form-group">
          <label for="country">Country *</label>
          <select id="country">
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="UK">United Kingdom</option>
            <option value="AU">Australia</option>
            <option value="DE">Germany</option>
            <option value="FR">France</option>
            <option value="JP">Japan</option>
          </select>
        </div>
      </div>
      <div class="form-actions">
        <a href="cart" class="btn btn--secondary" id="back-to-cart">← Back to Cart</a>
        <button class="btn btn--primary" id="next-to-payment">Continue to Payment →</button>
      </div>
    </div>
  `;
}

function renderPaymentForm() {
  return `
    <div class="form-section" id="payment-form">
      <h2 class="form-section__title">💳 Payment Details</h2>
      <div class="form-grid">
        <div class="form-group form-group--full">
          <label for="card-name">Name on Card *</label>
          <input type="text" id="card-name" placeholder="John Doe" required>
        </div>
        <div class="form-group form-group--full">
          <label for="card-number">Card Number *</label>
          <input type="text" id="card-number" placeholder="4242 4242 4242 4242" maxlength="19" required>
        </div>
        <div class="form-group">
          <label for="card-exp">Expiry Date *</label>
          <input type="text" id="card-exp" placeholder="MM/YY" maxlength="5" required>
        </div>
        <div class="form-group">
          <label for="card-cvv">CVV *</label>
          <input type="text" id="card-cvv" placeholder="123" maxlength="4" required>
        </div>
      </div>
      <p style="font-size:var(--font-xs); color:var(--text-muted); margin-top:var(--space-md); display:flex; align-items:center; gap:var(--space-sm);">
        🔒 Your payment information is encrypted and secure.
      </p>
      <div class="form-actions">
        <button class="btn btn--secondary" id="back-to-shipping">← Back to Shipping</button>
        <button class="btn btn--primary" id="next-to-review">Review Order →</button>
      </div>
    </div>
  `;
}

function renderReviewStep(items, subtotal, shipping, tax, total) {
  return `
    <div class="form-section" id="review-step">
      <h2 class="form-section__title">📋 Review Your Order</h2>
      <div style="display:flex; flex-direction:column; gap:var(--space-md);">
        ${items.map(item => `
          <div style="display:flex; align-items:center; gap:var(--space-md); padding:var(--space-md); background:var(--bg-glass); border-radius:var(--radius-md); border:1px solid var(--border-glass);">
            <img src="${item.image}" alt="${item.name}" style="width:60px;height:48px;object-fit:contain;border-radius:var(--radius-sm);background:var(--bg-glass);">
            <div style="flex:1;">
              <div style="font-weight:600;">${item.name}</div>
              <div style="font-size:var(--font-xs);color:var(--text-muted);">${item.brand} · Qty: ${item.qty}</div>
            </div>
            <span style="font-weight:700;">${formatPrice(item.price * item.qty)}</span>
          </div>
        `).join('')}
      </div>

      <div style="margin-top:var(--space-xl); padding:var(--space-lg); background:var(--bg-glass); border-radius:var(--radius-md); border:1px solid var(--border-glass);">
        <div style="display:flex;justify-content:space-between;padding:var(--space-xs) 0;font-size:var(--font-sm);color:var(--text-secondary);">
          <span>Subtotal</span><span>${formatPrice(subtotal)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding:var(--space-xs) 0;font-size:var(--font-sm);color:var(--text-secondary);">
          <span>Shipping</span><span>${shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding:var(--space-xs) 0;font-size:var(--font-sm);color:var(--text-secondary);">
          <span>Tax</span><span>${formatPrice(tax)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding:var(--space-md) 0 0;border-top:1px solid var(--border-glass);margin-top:var(--space-sm);font-weight:700;font-size:var(--font-lg);">
          <span>Total</span><span>${formatPrice(total)}</span>
        </div>
      </div>

      <div class="form-actions" style="margin-top:var(--space-xl);">
        <button class="btn btn--secondary" id="back-to-payment">← Back to Payment</button>
        <button class="btn btn--primary btn--lg" id="place-order-btn">🎉 Place Order</button>
      </div>
    </div>
  `;
}

function renderSuccess() {
  return `
    <div class="order-success" id="order-success" style="grid-column:1/-1;">
      <div class="order-success__icon">✅</div>
      <h2 class="order-success__title">Order Placed Successfully!</h2>
      <p class="order-success__text">Thank you for your purchase! Your order #${Math.floor(Math.random() * 900000) + 100000} has been confirmed.<br>You'll receive a confirmation email shortly.</p>
      <div style="display:flex; gap:var(--space-md); justify-content:center; flex-wrap:wrap;">
        <a href="/" class="btn btn--primary btn--lg" id="back-home-btn">Back to Home</a>
        <a href="catalog" class="btn btn--secondary btn--lg" id="keep-shopping-btn">Keep Shopping</a>
      </div>
    </div>
  `;
}

function validateForm(fields) {
  let valid = true;
  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el && !el.value.trim()) {
      el.classList.add('error');
      valid = false;
    } else if (el) {
      el.classList.remove('error');
    }
  });
  if (!valid) {
    showToast('Please fill in all required fields', 'error');
  }
  return valid;
}

function attachCheckoutEvents() {
  // Step 1 → 2
  document.getElementById('next-to-payment')?.addEventListener('click', () => {
    if (validateForm(['first-name', 'last-name', 'email', 'address', 'city', 'state', 'zip'])) {
      currentStep = 2;
      renderCheckout();
    }
  });

  // Step 2 → 3
  document.getElementById('next-to-review')?.addEventListener('click', () => {
    if (validateForm(['card-name', 'card-number', 'card-exp', 'card-cvv'])) {
      currentStep = 3;
      renderCheckout();
    }
  });

  // Back buttons
  document.getElementById('back-to-shipping')?.addEventListener('click', () => {
    currentStep = 1;
    renderCheckout();
  });

  document.getElementById('back-to-payment')?.addEventListener('click', () => {
    currentStep = 2;
    renderCheckout();
  });

  // Place order
  document.getElementById('place-order-btn')?.addEventListener('click', () => {
    Cart.clear();
    currentStep = 4;
    renderCheckout();
    showToast('Order placed successfully! 🎉', 'success');
  });

  // Card number formatting  
  document.getElementById('card-number')?.addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, '').substring(0, 16);
    v = v.replace(/(\d{4})(?=\d)/g, '$1 ');
    e.target.value = v;
  });

  // Expiry formatting
  document.getElementById('card-exp')?.addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (v.length > 2) v = v.substring(0, 2) + '/' + v.substring(2);
    e.target.value = v;
  });
}

// ---- Init ----
renderCheckout();
