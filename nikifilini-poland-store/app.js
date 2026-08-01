/* ==========================================================================
   NIKIFILINI PL - E-Commerce Interactivity & Store Management
   ========================================================================== */

const PRODUCTS = [
  {
    id: 1,
    title: 'Oversize Hoodie "Cyber Valkyrie"',
    category: 'bluzy',
    categoryLabel: 'Bluza Oversize',
    price: 349,
    oldPrice: 420,
    badge: 'NEW DROP',
    frontImg: 'assets/images/hoodie_front.png',
    backImg: 'assets/images/hoodie_back.png',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Ekskluzywna bluza oversize uszyta z ciężkiej bawełny 480 gsm. Unikalny sitodruk z motywem cyber-anime na klatce piersiowej i plecach. Wykończenie efektem vintage wash.',
    composition: '100% Bawełna Czesana (480 gsm)',
    inStock: true
  },
  {
    id: 2,
    title: 'Heavyweight T-Shirt "Mecha Soul"',
    category: 't-shirty',
    categoryLabel: 'Koszulka Heavyweight',
    price: 189,
    oldPrice: 220,
    badge: 'BESTSELLER',
    frontImg: 'assets/images/tshirt_front.png',
    backImg: 'assets/images/tshirt_back.png',
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Koszulka o kroju boxy-fit z grubego materiału 260 gsm. Autorska grafika mecha anime, odporna na pranie. Efekt sprania Acid Wash.',
    composition: '100% Bawełna Premium (260 gsm)',
    inStock: true
  },
  {
    id: 3,
    title: 'Spodnie Cargo "Tactical Phantom"',
    category: 'spodnie',
    categoryLabel: 'Spodnie Tactical',
    price: 389,
    oldPrice: 450,
    badge: 'LIMITOWANE',
    frontImg: 'assets/images/pants_front.png',
    backImg: 'assets/images/pants_front.png',
    sizes: ['M', 'L', 'XL'],
    description: 'Taktyczne spodnie bojówki z regulowanymi paskami i kieszeniami 3D. Wodoodporny materiał rip-stop. Metalowe sprzączki i wzmocnione szwy.',
    composition: '65% Poliester, 35% Bawełna Rip-Stop',
    inStock: true
  },
  {
    id: 4,
    title: 'Kurtka Denim "Tokyo Neon Gothic"',
    category: 'kurtki',
    categoryLabel: 'Kurtka Designer',
    price: 499,
    oldPrice: 590,
    badge: 'STAL DROP',
    frontImg: 'assets/images/jacket_front.png',
    backImg: 'assets/images/jacket_front.png',
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Ciężka kurtka dżinsowa z japońskimi haftowanymi naszywkami i przetarciami. Metalowe sygnowane guziki NIKIFILINI.',
    composition: '100% Heavy Denim Bawełniany',
    inStock: true
  }
];

// State
let cart = JSON.parse(localStorage.getItem('nikifilini_cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('nikifilini_wishlist')) || [];
let activeCategory = 'all';

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  updateCartUI();
  updateWishlistUI();
  initCountdown();
  setupEventListeners();
});

/* ==========================================================================
   Product Rendering & Filtering
   ========================================================================== */
function renderProducts() {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  const filtered = activeCategory === 'all' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === activeCategory);

  grid.innerHTML = filtered.map(product => {
    const isWishlisted = wishlist.includes(product.id);
    return `
      <div class="product-card" data-id="${product.id}">
        <div class="card-image-wrap" onclick="openQuickView(${product.id})">
          <span class="product-badge">${product.badge}</span>
          <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" onclick="event.stopPropagation(); toggleWishlist(${product.id})">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="${isWishlisted ? '#ff0044' : 'none'}" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
          <img src="${product.frontImg}" alt="${product.title}" class="card-image front-img" loading="lazy">
          <img src="${product.backImg}" alt="${product.title}" class="card-image back-img" loading="lazy">
        </div>

        <div class="card-content">
          <span class="product-category">${product.categoryLabel}</span>
          <h3 class="product-title" onclick="openQuickView(${product.id})">${product.title}</h3>
          
          <div class="size-selector-mini" id="sizes-${product.id}">
            ${product.sizes.map((s, idx) => `
              <button class="size-pill ${idx === 1 ? 'active' : ''}" onclick="selectSize(${product.id}, '${s}', this)">${s}</button>
            `).join('')}
          </div>

          <div class="product-price-row">
            <div class="price">
              ${product.price} zł
              ${product.oldPrice ? `<span class="old-price">${product.oldPrice} zł</span>` : ''}
            </div>
          </div>

          <button class="add-cart-btn" style="margin-top: 14px;" onclick="addToCart(${product.id})">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            Dodaj do Koszyka
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function filterCategory(category, element) {
  activeCategory = category;
  document.querySelectorAll('.filter-tab').forEach(tab => tab.classList.remove('active'));
  element.classList.add('active');
  renderProducts();
}

function selectSize(productId, size, element) {
  const container = document.getElementById(`sizes-${productId}`);
  if (container) {
    container.querySelectorAll('.size-pill').forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');
  }
}

function getSelectedSize(productId) {
  const container = document.getElementById(`sizes-${productId}`);
  if (!container) return 'M';
  const active = container.querySelector('.size-pill.active');
  return active ? active.innerText : 'M';
}

/* ==========================================================================
   Cart Management
   ========================================================================== */
function addToCart(productId, customSize = null) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const size = customSize || getSelectedSize(productId);
  const existingIndex = cart.findIndex(item => item.id === productId && item.size === size);

  if (existingIndex > -1) {
    cart[existingIndex].quantity += 1;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      img: product.frontImg,
      size: size,
      quantity: 1
    });
  }

  saveCart();
  updateCartUI();
  openCartDrawer();
  showToast(`Dodano "${product.title}" (${size}) do koszyka!`);
}

function changeQty(index, delta) {
  if (cart[index]) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }
    saveCart();
    updateCartUI();
  }
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  updateCartUI();
}

function saveCart() {
  localStorage.setItem('nikifilini_cart', JSON.stringify(cart));
}

function updateCartUI() {
  const badge = document.getElementById('cart-badge');
  const count = cart.reduce((acc, item) => acc + item.quantity, 0);
  if (badge) badge.innerText = count;

  const body = document.getElementById('cart-body');
  const subtotalEl = document.getElementById('cart-subtotal');
  const totalEl = document.getElementById('cart-total');
  const progressFill = document.getElementById('shipping-fill');
  const progressText = document.getElementById('shipping-text');

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  if (subtotalEl) subtotalEl.innerText = `${subtotal} zł`;
  if (totalEl) totalEl.innerText = `${subtotal} zł`;

  // Free shipping calculation (threshold: 300 zł)
  const freeThreshold = 300;
  if (progressFill && progressText) {
    if (subtotal >= freeThreshold) {
      progressFill.style.width = '100%';
      progressText.innerText = '🎉 Masz darmową dostawę na terenie Polski!';
    } else {
      const remaining = freeThreshold - subtotal;
      const pct = Math.min(100, (subtotal / freeThreshold) * 100);
      progressFill.style.width = `${pct}%`;
      progressText.innerText = `Brakuje Ci ${remaining} zł do darmowej dostawy!`;
    }
  }

  if (!body) return;

  if (cart.length === 0) {
    body.innerHTML = `
      <div class="cart-empty">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="opacity: 0.4; margin-bottom: 12px;">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
          <line x1="3" y1="6" x2="21" y2="6"></line>
        </svg>
        <p>Twój koszyk jest pusty</p>
        <button class="btn btn-primary" style="margin-top: 16px;" onclick="closeCartDrawer()">Przeglądaj Sklep</button>
      </div>
    `;
    return;
  }

  body.innerHTML = cart.map((item, index) => `
    <div class="cart-item">
      <img src="${item.img}" alt="${item.title}" class="cart-item-img">
      <div class="cart-item-info">
        <div>
          <div class="cart-item-title">${item.title}</div>
          <div class="cart-item-size">Rozmiar: <strong>${item.size}</strong></div>
        </div>
        <div class="cart-item-bottom">
          <div class="qty-controls">
            <button class="qty-btn" onclick="changeQty(${index}, -1)">-</button>
            <span style="font-size: 0.85rem; font-weight: 700;">${item.quantity}</span>
            <button class="qty-btn" onclick="changeQty(${index}, 1)">+</button>
          </div>
          <div style="font-weight: 800; font-size: 1rem; color: #fff;">${item.price * item.quantity} zł</div>
        </div>
      </div>
    </div>
  `).join('');
}

/* ==========================================================================
   Wishlist Management
   ========================================================================== */
function toggleWishlist(productId) {
  const idx = wishlist.indexOf(productId);
  if (idx > -1) {
    wishlist.splice(idx, 1);
    showToast('Usunięto z listy życzeń');
  } else {
    wishlist.push(productId);
    showToast('Dodano do listy życzeń ❤️');
  }
  localStorage.setItem('nikifilini_wishlist', JSON.stringify(wishlist));
  updateWishlistUI();
  renderProducts();
}

function updateWishlistUI() {
  const badge = document.getElementById('wishlist-badge');
  if (badge) badge.innerText = wishlist.length;
}

/* ==========================================================================
   Cart & Modal Controls
   ========================================================================== */
function openCartDrawer() {
  document.getElementById('cart-drawer')?.classList.add('open');
  document.getElementById('cart-overlay')?.classList.add('open');
}

function closeCartDrawer() {
  document.getElementById('cart-drawer')?.classList.remove('open');
  document.getElementById('cart-overlay')?.classList.remove('open');
}

function openQuickView(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const modal = document.getElementById('quickview-modal');
  const modalContent = document.getElementById('modal-content');
  if (!modal || !modalContent) return;

  modalContent.innerHTML = `
    <div class="modal-gallery">
      <img src="${product.frontImg}" alt="${product.title}">
    </div>
    <div class="modal-details">
      <span class="product-badge" style="position: static; display: inline-block; margin-bottom: 12px;">${product.badge}</span>
      <h2 style="font-family: var(--font-heading); font-size: 1.8rem; font-weight: 800; margin-bottom: 12px;">${product.title}</h2>
      <div style="font-size: 1.6rem; font-weight: 800; color: var(--accent-cyan); margin-bottom: 20px;">${product.price} zł</div>
      
      <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 24px;">${product.description}</p>
      
      <div style="margin-bottom: 24px; padding: 16px; background: rgba(255,255,255,0.03); border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
        <h4 style="font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 6px;">Skład & Pielęgnacja:</h4>
        <p style="font-size: 0.85rem; color: #fff;">${product.composition}</p>
      </div>

      <div style="margin-bottom: 24px;">
        <label style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: var(--text-secondary); display: block; margin-bottom: 10px;">Wybierz Rozmiar:</label>
        <div class="size-selector-mini" id="modal-sizes-${product.id}">
          ${product.sizes.map((s, idx) => `
            <button class="size-pill ${idx === 1 ? 'active' : ''}" style="padding: 10px 0;" onclick="selectModalSize('${s}', this)">${s}</button>
          `).join('')}
        </div>
      </div>

      <button class="btn btn-primary" style="width: 100%; margin-top: auto;" onclick="addToCartModal(${product.id})">
        DODAJ DO KOSZYKA — ${product.price} zł
      </button>
    </div>
  `;

  modal.classList.add('open');
}

let selectedModalSize = 'M';
function selectModalSize(size, el) {
  selectedModalSize = size;
  el.parentElement.querySelectorAll('.size-pill').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
}

function addToCartModal(productId) {
  addToCart(productId, selectedModalSize);
  closeQuickView();
}

function closeQuickView() {
  document.getElementById('quickview-modal')?.classList.remove('open');
}

/* ==========================================================================
   Checkout Simulation (Polish Form)
   ========================================================================== */
function openCheckout() {
  if (cart.length === 0) {
    showToast('Twój koszyk jest pusty!');
    return;
  }

  closeCartDrawer();
  const checkoutModal = document.getElementById('checkout-modal');
  if (!checkoutModal) return;

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  document.getElementById('checkout-total-summary').innerText = `${total} zł`;
  checkoutModal.classList.add('open');
}

function closeCheckout() {
  document.getElementById('checkout-modal')?.classList.remove('open');
}

function processOrder(e) {
  e.preventDefault();
  closeCheckout();
  cart = [];
  saveCart();
  updateCartUI();
  showToast('Dziękujemy! Twoje zamówienie zostało złożone 🚀');
}

/* ==========================================================================
   Countdown & Utilities
   ========================================================================== */
function initCountdown() {
  // 3 days countdown from now
  const target = new Date().getTime() + (3 * 24 * 60 * 60 * 1000);

  setInterval(() => {
    const now = new Date().getTime();
    const diff = target - now;

    if (diff < 0) return;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    const dEl = document.getElementById('cd-days');
    const hEl = document.getElementById('cd-hours');
    const mEl = document.getElementById('cd-mins');
    const sEl = document.getElementById('cd-secs');

    if (dEl) dEl.innerText = String(days).padStart(2, '0');
    if (hEl) hEl.innerText = String(hours).padStart(2, '0');
    if (mEl) mEl.innerText = String(mins).padStart(2, '0');
    if (sEl) sEl.innerText = String(secs).padStart(2, '0');
  }, 1000);
}

function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00f0ff" stroke-width="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${message}</span>
  `;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

function setupEventListeners() {
  document.getElementById('cart-overlay')?.addEventListener('click', closeCartDrawer);
}
