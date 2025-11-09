
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
