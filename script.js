const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const links = document.querySelectorAll('.nav a');
const topButton = document.querySelector('.back-to-top');

const currentPage = window.location.pathname.split('/').pop() || 'index.html';
links.forEach(link => {
  const href = link.getAttribute('href') || '';
  const linkPage = href.split('#')[0] || 'index.html';
  if (linkPage === currentPage) link.classList.add('active');
});

toggle?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(isOpen));
});

links.forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
  });
});

window.addEventListener('scroll', () => {
  topButton?.classList.toggle('show', window.scrollY > 600);
});

topButton?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
