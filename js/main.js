
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
menuBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));


const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navLinks.forEach(l => l.classList.remove('active-link'));
    link.classList.add('active-link');
  });
});



const banner = document.getElementById('banner');
const banners = banner.children;
let bannerIndex = 0;
const totalBanners = banners.length;

function showBanner(index) {
  const shift = index * (100 / banners.length);
  banner.style.transform = `translateX(-${shift}%)`;
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
const productGrid = document.getElementById('productGrid');

async function fetchProducts() {
  const res = await fetch('https://fakestoreapi.com/products');
  products = await res.json();
  renderProducts(products);
}

function renderProducts(list) {
  productGrid.innerHTML = '';
  list.forEach(product => {
    const card = document.createElement('div');
    card.className = 'bg-white p-4 rounded shadow flex flex-col';
    card.innerHTML = `
      <img src="${product.image}" alt="${product.title}" class="h-40 object-contain mb-2">
      <h3 class="font-bold">${product.title}</h3>
      <p class="text-gray-600">$${product.price.toFixed(2)}</p>
      <button class="mt-auto bg-blue-500 text-white px-3 py-1 rounded addCartBtn" data-id="${product.id}">Add to Cart</button>
    `;
    productGrid.appendChild(card);
  });
  attachAddToCart();
}

const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');

searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase();
  renderProducts(products.filter(p => p.title.toLowerCase().includes(query)));
});

sortSelect.addEventListener('change', () => {
  const value = sortSelect.value;
  const sorted = [...products];
  if(value === 'asc') sorted.sort((a,b)=>a.price-b.price);
  if(value === 'desc') sorted.sort((a,b)=>b.price-a.price);
  renderProducts(sorted);
});