// ==========================================
// 1. SELEKSI ELEMEN UI UTAMA
// ==========================================
const navbarNav = document.querySelector('.navbar-nav');
const searchForm = document.querySelector('.search-form');
const searchBox = document.querySelector('#search-box');
const shoppingCart = document.querySelector('.shopping-cart');

const hm = document.querySelector('#hamburger-menu');
const sb = document.querySelector('#search-button');
const sc = document.querySelector('#shopping-cart-button');

// ==========================================
// 2. TOGGLE EVENT CLICKS (MEMBUKA SIDEBAR)
// ==========================================
// Toggle Hamburger Menu
if (hm) {
  hm.onclick = (e) => {
    navbarNav.classList.toggle('active');
    searchForm.classList.remove('active');
    shoppingCart.classList.remove('active');
    e.preventDefault();
  };
}

// Toggle Search Form
if (sb) {
  sb.onclick = (e) => {
    searchForm.classList.toggle('active');
    navbarNav.classList.remove('active');
    shoppingCart.classList.remove('active');
    if (searchForm.classList.contains('active')) {
      searchBox.focus();
    }
    e.preventDefault();
  };
}

// Toggle Shopping Cart SideBar
if (sc) {
  sc.onclick = (e) => {
    shoppingCart.classList.toggle('active');
    navbarNav.classList.remove('active');
    searchForm.classList.remove('active');
    e.preventDefault();
  };
}

// Klik di luar elemen untuk menyembunyikan sidebar aktif secara aman
document.addEventListener('click', function (e) {
  if (hm && !hm.contains(e.target) && !navbarNav.contains(e.target)) {
    navbarNav.classList.remove('active');
  }
  if (sb && !sb.contains(e.target) && !searchForm.contains(e.target)) {
    searchForm.classList.remove('active');
  }
  if (sc && !sc.contains(e.target) && !shoppingCart.contains(e.target)) {
    shoppingCart.classList.remove('active');
  }
});

// ==========================================
// 3. LOGIKA MODAL BOX (DETAIL PRODUK)
// ==========================================
const itemDetailModal = document.querySelector('#item-detail-modal');
const itemDetailButtons = document.querySelectorAll('.item-detail-button');
const closeModalButton = document.querySelector('.modal .close-icon');

if (itemDetailButtons) {
  itemDetailButtons.forEach((btn) => {
    btn.onclick = (e) => {
      if (itemDetailModal) itemDetailModal.style.display = 'flex';
      e.preventDefault();
    };
  });
}

// Klik tombol close modal
if (closeModalButton) {
  closeModalButton.onclick = (e) => {
    if (itemDetailModal) itemDetailModal.style.display = 'none';
    e.preventDefault();
  };
}

// Klik di luar modal untuk menutup (Diperbaiki agar tidak tabrakan dengan sidebar)
if (itemDetailModal) {
  itemDetailModal.addEventListener('click', function (e) {
    if (e.target === itemDetailModal) {
      itemDetailModal.style.display = 'none';
    }
  });
}

// ==========================================
// 4. INTEGRASI FITUR LIVE SEARCH (PENCARIAN MENU)
// ==========================================
if (searchBox) {
  searchBox.addEventListener('keyup', function (e) {
    const keyword = e.target.value.toLowerCase();
    const menuCards = document.querySelectorAll('.menu-card');

    menuCards.forEach((card) => {
      const namaMenu = card.getAttribute('data-name');
      if (namaMenu) {
        if (namaMenu.toLowerCase().includes(keyword)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      }
    });
  });
}

// ==========================================
// 5. INTEGRASI FITUR DINAMIS SHOPPING CART
// ==========================================
let cart = [];
const cartContainer = document.getElementById('cart-items-container');
const cartTotalPrice = document.getElementById('cart-total-price');
const cartBadge = document.getElementById('cart-badge');

function renderCart() {
  if (!cartContainer || !cartTotalPrice || !cartBadge) return;
  
  cartContainer.innerHTML = '';
  let totalHarga = 0;
  let totalBarang = 0;

  if (cart.length === 0) {
    cartContainer.innerHTML = '<p style="padding: 2rem 1rem; text-align: center; color: #777; font-size: 1.1rem; width: 100%;">Keranjang belanja kosong.</p>';
    cartTotalPrice.innerText = 'IDR 0';
    cartBadge.style.display = 'none';
    return;
  }

  cart.forEach((item) => {
    totalHarga += item.price * item.quantity;
    totalBarang += item.quantity;

    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    cartItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="item-detail">
        <h3>${item.name}</h3>
        <div class="item-price">IDR ${item.price.toLocaleString('id-ID')}</div>
        <div class="quantity-control">
          <button class="minus-btn" data-id="${item.id}">-</button>
          <span>${item.quantity}</span>
          <button class="plus-btn" data-id="${item.id}">+</button>
        </div>
      </div>
      <i data-feather="trash-2" class="remove-item" data-id="${item.id}"></i>
    `;
    cartContainer.appendChild(cartItem);
  });

  cartTotalPrice.innerText = 'IDR ' + totalHarga.toLocaleString('id-ID');
  cartBadge.innerText = totalBarang;
  cartBadge.style.display = 'inline-block';

  if (typeof feather !== 'undefined') {
    feather.replace();
  }
  registerCartEvents();
}

function registerCartEvents() {
  // Tombol Tambah (+)
  document.querySelectorAll('.plus-btn').forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute('data-id');
      const item = cart.find(prod => prod.id === id);
      if (item) item.quantity++;
      renderCart();
    };
  });

  // Tombol Kurang (-)
  document.querySelectorAll('.minus-btn').forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute('data-id');
      const item = cart.find(prod => prod.id === id);
      if (item) {
        item.quantity--;
        if (item.quantity === 0) {
          cart = cart.filter(prod => prod.id !== id);
        }
      }
      renderCart();
    };
  });

  // Tombol Hapus (Ikon Trash)
  document.querySelectorAll('.remove-item').forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute('data-id');
      cart = cart.filter(prod => prod.id !== id);
      renderCart();
    };
  });
}

// Menangkap klik tombol "Add to Cart" di area produk
document.querySelectorAll('.add-to-cart-btn').forEach((btn) => {
  btn.onclick = (e) => {
    e.preventDefault();
    const id = btn.getAttribute('data-id');
    const name = btn.getAttribute('data-name');
    const price = parseInt(btn.getAttribute('data-price'));
    // Fallback mengambil properti gambar dari data-img jika data-image kosong
    const image = btn.getAttribute('data-image') || btn.getAttribute('data-img') || 'img/products/1.jpg';

    const itemInCart = cart.find(prod => prod.id === id);

    if (itemInCart) {
      itemInCart.quantity++;
    } else {
      cart.push({ id, name, price, image, quantity: 1 });
    }

    renderCart();
    if (shoppingCart) shoppingCart.classList.add('active'); // Otomatis memunculkan sidebar cart saat klik beli
  };
});

// Jalankan initial render pertama kali saat halaman dimuat
renderCart();