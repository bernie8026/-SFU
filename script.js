const animationLink = document.createElement('link');
animationLink.rel = 'stylesheet';
animationLink.href = 'assets/animations.css?motion=1';
document.head.appendChild(animationLink);

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

const transitionCover = document.createElement('div');
transitionCover.className = 'page-transition-cover';
document.body.appendChild(transitionCover);

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

const revealTargets = document.querySelectorAll([
  '.programme-card',
  '.structure-grid article',
  '.career-grid article',
  '.subpage-grid article',
  '.content-card',
  '.directory-block',
  '.cta-banner',
  '.partner-strip span',
  '.quick-links a',
  '.faq details',
  '.pathway-line article'
].join(','));

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('reveal-in');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });

  revealTargets.forEach(el => {
    el.classList.add('reveal-ready');
    revealObserver.observe(el);
  });
} else {
  revealTargets.forEach(el => el.classList.add('reveal-in'));
}

document.querySelectorAll('a[href]').forEach(anchor => {
  anchor.addEventListener('click', event => {
    const href = anchor.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    const url = new URL(href, window.location.href);
    const sameOrigin = url.origin === window.location.origin;
    const samePageHash = url.pathname === window.location.pathname && url.hash;
    if (!sameOrigin || samePageHash || anchor.target === '_blank') return;

    event.preventDefault();
    nav?.classList.remove('open');
    transitionCover.classList.add('is-active');
    document.body.classList.add('page-leave');
    window.setTimeout(() => {
      window.location.href = url.href;
    }, 260);
  });
});

window.addEventListener('pageshow', () => {
  transitionCover.classList.remove('is-active');
  document.body.classList.remove('page-leave');
});

window.addEventListener('scroll', () => {
  topButton?.classList.toggle('show', window.scrollY > 600);
});

topButton?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
