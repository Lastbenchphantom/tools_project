const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
menuBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));


const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navLinks.forEach(l => l.classList.remove('active-link'));
    link.classList.add('active-link');
    mobileMenu.classList.add('hidden');
  });
});


const banner = document.getElementById('banner');
const banners = banner.children;
let bannerIndex = 0;
const totalBanners = banners.length;

banner.style.width = `${totalBanners * 100}%`;
Array.from(banners).forEach(img => (img.style.width = `${100 / totalBanners}%`));

function showBanner(index) {
  banner.style.transform = `translateX(-${index * (100 / totalBanners)}%)`;
}

document.getElementById('prevBanner').addEventListener('click', () => {
  bannerIndex = (bannerIndex - 1 + totalBanners) % totalBanners;
  showBanner(bannerIndex);
});
document.getElementById('nextBanner').addEventListener('click', () => {
  bannerIndex = (bannerIndex + 1) % totalBanners;
  showBanner(bannerIndex);
});

setInterval(() => {
  bannerIndex = (bannerIndex + 1) % totalBanners;
  showBanner(bannerIndex);
}, 5000);


let products = [];
let categories = [];
const productGrid = document.getElementById('productGrid');
const categorySelect = document.getElementById('categorySelect');

async function fetchProducts() {
  try {
    const res = await fetch('https://fakestoreapi.com/products');
    products = await res.json();
    renderProducts(products);
    await fetchCategories();
  } catch (err) {
    console.error('Error fetching products:', err);
  }
}

async function fetchCategories() {
  try {
    const res = await fetch('https://fakestoreapi.com/products/categories');
    categories = await res.json();
    renderCategoryOptions();
  } catch (err) {
    console.error('Error fetching categories:', err);
  }
}

function renderCategoryOptions() {
  categorySelect.innerHTML = `<option value="">All Categories</option>`;
  categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    categorySelect.appendChild(opt);
  });
}

function renderProducts(list) {
  productGrid.innerHTML = '';
  list.forEach(product => {
    const card = document.createElement('div');
    card.className = 'bg-white p-4 rounded shadow flex flex-col';
    card.innerHTML = `
      <img src="${product.image}" alt="${product.title}" class="h-40 object-contain mb-2">
      <h3 class="font-bold line-clamp-2">${product.title}</h3>
      <p class="text-gray-600 mb-2">$${product.price.toFixed(2)}</p>
      <button class="mt-auto bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded addCartBtn" data-id="${product.id}">Add to Cart</button>
    `;
    productGrid.appendChild(card);
  });
  attachAddToCart();
}


const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');

searchInput.addEventListener('input', applyFilters);
sortSelect.addEventListener('change', applyFilters);
categorySelect.addEventListener('change', applyFilters);

function applyFilters() {
  let filtered = [...products];

  const query = searchInput.value.toLowerCase();
  const sortValue = sortSelect.value;
  const category = categorySelect.value;

  if (query) filtered = filtered.filter(p => p.title.toLowerCase().includes(query));
  if (category) filtered = filtered.filter(p => p.category === category);

  if (sortValue === 'asc') filtered.sort((a, b) => a.price - b.price);
  if (sortValue === 'desc') filtered.sort((a, b) => b.price - a.price);

  renderProducts(filtered);
}


let cart = JSON.parse(localStorage.getItem('cart')) || [];
let userBalance = parseFloat(localStorage.getItem('balance')) || 100;
const cartItems = document.getElementById('cartItems');
const cartSubtotalEl = document.getElementById('cartSubtotal');
const userBalanceEl = document.getElementById('userBalance');

function updateCartUI() {
  cartItems.innerHTML = '';
  let subtotal = 0;
  cart.forEach(item => {
    subtotal += item.price * item.qty;
    const div = document.createElement('div');
    div.className = 'flex justify-between items-center bg-white p-2 rounded shadow';
    div.innerHTML = `
      <span>${item.title} x ${item.qty}</span>
      <div class="flex items-center gap-2">
        <span>$${(item.price * item.qty).toFixed(2)}</span>
        <button class="removeBtn text-red-500 font-bold" data-id="${item.id}">×</button>
      </div>`;
    cartItems.appendChild(div);
  });

  cartSubtotalEl.textContent = subtotal.toFixed(2);
  userBalanceEl.textContent = userBalance.toFixed(2);
  localStorage.setItem('cart', JSON.stringify(cart));
  localStorage.setItem('balance', userBalance);

  attachRemoveFromCart();
}

function attachAddToCart() {
  document.querySelectorAll('.addCartBtn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      const product = products.find(p => p.id === id);
      const existing = cart.find(c => c.id === id);
      const totalPrice = cart.reduce((a, b) => a + b.price * b.qty, 0) + product.price;
      if (totalPrice > userBalance) {
        alert('Insufficient balance!');
        return;
      }
      if (existing) existing.qty += 1;
      else cart.push({ ...product, qty: 1 });
      updateCartUI();
    });
  });
}

function attachRemoveFromCart() {
  document.querySelectorAll('.removeBtn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      cart = cart.filter(item => item.id !== id);
      updateCartUI();
    });
  });
}

document.getElementById('addMoneyBtn').addEventListener('click', () => {
  userBalance += 50;
  updateCartUI();
});

document.getElementById('applyCouponBtn').addEventListener('click', () => {
  const code = document.getElementById('couponInput').value.trim();
  if (code === 'SMART10') {
    const subtotal = cart.reduce((a, b) => a + b.price * b.qty, 0);
    const discount = subtotal * 0.1;
    userBalance += discount;
    alert(`Coupon applied! $${discount.toFixed(2)} added to your balance.`);
    updateCartUI();
  } else {
    alert('Invalid coupon');
  }
});


const reviewWrapper = document.getElementById('reviewWrapper');
const reviews = [
  {text:"Amazing products!", author:"Alice"},
  {text:"Fast delivery!", author:"Bob"},
  {text:"Great customer service.", author:"Charlie"},
  {text:"Highly recommend this store.", author:"Dana"}
];
let reviewIndex = 0;

function showReview(index){
  reviewWrapper.style.transform = `translateX(-${index*100}%)`;
}

function renderReviews(){
  reviewWrapper.innerHTML = '';
  reviews.forEach(r=>{
    const div = document.createElement('div');
    div.className = 'min-w-full flex flex-col justify-center items-center';
    div.innerHTML = `<p class="text-lg mb-2">${r.text}</p><span class="font-bold">${r.author}</span>`;
    reviewWrapper.appendChild(div);
  });
}

document.getElementById('prevReview').addEventListener('click', ()=>{
  reviewIndex = (reviewIndex-1+reviews.length)%reviews.length;
  showReview(reviewIndex);
});
document.getElementById('nextReview').addEventListener('click', ()=>{
  reviewIndex = (reviewIndex+1)%reviews.length;
  showReview(reviewIndex);
});

setInterval(()=>{
  reviewIndex = (reviewIndex+1)%reviews.length;
  showReview(reviewIndex);
}, 4000);

document.getElementById('backToTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

fetchProducts();
renderReviews();
updateCartUI();
