const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const links = document.querySelectorAll('.nav a');
const topButton = document.querySelector('.back-to-top');

const logoStyle = document.createElement('style');
logoStyle.textContent = `
  .crest {
    width: 168px !important;
    height: 52px !important;
    border: 0 !important;
    border-radius: 0 !important;
    background: transparent url('assets/sfu-logo.svg?logo=3') center / contain no-repeat !important;
    color: transparent !important;
    font-size: 0 !important;
    flex: 0 0 168px !important;
  }
  .brand { gap: 1rem !important; }
  .brand > span:last-child strong { color: #7a1f2d !important; }
  @media (max-width: 760px) {
    .crest {
      width: 132px !important;
      height: 38px !important;
      flex-basis: 132px !important;
    }
    .brand > span:last-child { display: none !important; }
  }
`;
document.head.appendChild(logoStyle);

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
