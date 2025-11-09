
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