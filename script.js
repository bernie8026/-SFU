const animationLink = document.createElement('link');
animationLink.rel = 'stylesheet';
animationLink.href = 'assets/animations.css?motion=2';
document.head.appendChild(animationLink);

const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const links = document.querySelectorAll('.nav a');
const topButton = document.querySelector('.back-to-top');
const transitionCover = document.createElement('div');
transitionCover.className = 'page-transition-cover';
document.body.appendChild(transitionCover);

const globalStyle = document.createElement('style');
globalStyle.textContent = `
  .crest {
    width: 168px !important;
    height: 52px !important;
    border: 0 !important;
    border-radius: 0 !important;
    background: transparent url('assets/sfu-logo.svg?logo=5') center / contain no-repeat !important;
    color: transparent !important;
    font-size: 0 !important;
    flex: 0 0 168px !important;
  }
  .brand { gap: 1rem !important; }
  .brand > span:last-child strong { color: #7a1f2d !important; }
  .language-switcher {
    display: inline-flex;
    gap: .25rem;
    align-items: center;
  }
  .utility-bar .language-switcher {
    margin-left: .8rem;
    padding-left: .8rem;
    border-left: 1px solid rgba(255,255,255,.25);
  }
  .language-switcher button {
    border: 1px solid rgba(255,255,255,.38);
    background: transparent;
    color: #fff;
    border-radius: 999px;
    padding: .22rem .56rem;
    font-size: .78rem;
    font-weight: 900;
    cursor: pointer;
    transition: background-color .2s ease, color .2s ease, border-color .2s ease;
  }
  .language-switcher button.active,
  .language-switcher button:hover {
    background: #fff;
    color: #7a1f2d;
  }
  .mobile-language-switcher,
  .mobile-utility-links { display: none; }
  .mobile-utility-links {
    padding: .75rem;
    border-bottom: 1px solid #e4d7cd;
    background: #fffaf3;
    gap: .45rem;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .mobile-utility-links a {
    display: block;
    padding: .65rem .75rem !important;
    border: 1px solid #e4d7cd !important;
    border-radius: 10px !important;
    background: #fff !important;
    color: #7a1f2d !important;
    font-size: .86rem !important;
    text-align: center;
  }
  @media (max-width: 760px) {
    .main-header {
      gap: .6rem !important;
    }
    .crest {
      width: 132px !important;
      height: 38px !important;
      flex-basis: 132px !important;
    }
    .brand > span:last-child { display: none !important; }
    .mobile-language-switcher {
      display: inline-flex;
      margin-left: auto;
      margin-right: .25rem;
    }
    .main-header .language-switcher button {
      border-color: #e4d7cd;
      color: #7a1f2d;
      background: #fffaf3;
      padding: .28rem .5rem;
      font-size: .76rem;
    }
    .main-header .language-switcher button.active,
    .main-header .language-switcher button:hover {
      background: #7a1f2d;
      color: #fff;
      border-color: #7a1f2d;
    }
    .nav.open .mobile-utility-links { display: grid; }
  }
`;
document.head.appendChild(globalStyle);

function removeInternalNotes() {
  document.querySelectorAll('.content-card.warning').forEach(card => {
    const heading = card.querySelector('h2')?.textContent.trim();
    if (heading === '建議網站用字') card.remove();
  });
}

function cleanFooter() {
  document.querySelectorAll('.footer p').forEach(p => {
    p.textContent = '資料以 SFUHK 及 JUPAS 最新官方公布為準。';
  });
}

removeInternalNotes();
cleanFooter();

const currentPage = window.location.pathname.split('/').pop() || 'index.html';
links.forEach(link => {
  const href = link.getAttribute('href') || '';
  const linkPage = href.split('#')[0] || 'index.html';
  if (linkPage === currentPage) link.classList.add('active');
});

function switcherMarkup(extraClass = '') {
  return `<div class="language-switcher ${extraClass}" aria-label="Language selector">
    <button type="button" data-lang="zh-hant">繁</button>
    <button type="button" data-lang="en">EN</button>
    <button type="button" data-lang="zh-hans">简</button>
  </div>`;
}

function addLanguageSwitchers() {
  const utilityNav = document.querySelector('.utility-bar nav');
  if (utilityNav && !utilityNav.querySelector('.language-switcher')) {
    utilityNav.insertAdjacentHTML('beforeend', switcherMarkup('desktop-language-switcher'));
  }
  const mainHeader = document.querySelector('.main-header');
  if (mainHeader && !mainHeader.querySelector('.mobile-language-switcher')) {
    const menuButton = mainHeader.querySelector('.menu-toggle');
    menuButton?.insertAdjacentHTML('beforebegin', switcherMarkup('mobile-language-switcher'));
  }
}

function addMobileUtilityLinks() {
  if (!nav || nav.querySelector('.mobile-utility-links')) return;
  nav.insertAdjacentHTML('afterbegin', `<div class="mobile-utility-links">
    <a href="index.html#announcement">Announcement</a>
    <a href="admissions.html">Apply Now</a>
    <a href="scholarships.html">Student Support</a>
    <a href="faq.html">Search / FAQ</a>
  </div>`);
}

addLanguageSwitchers();
addMobileUtilityLinks();

const textNodes = [];
const originalText = new WeakMap();
function collectTextNodes(root = document.body) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA'].includes(parent.tagName)) return NodeFilter.FILTER_REJECT;
      if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  let node;
  while ((node = walker.nextNode())) {
    textNodes.push(node);
    originalText.set(node, node.nodeValue);
  }
}
collectTextNodes();

const enMap = new Map(Object.entries({
  '資料以 SFUHK 及 JUPAS 最新官方公布為準。': 'Information is subject to the latest official announcements from SFUHK and JUPAS.',
  '開關選單': 'Menu',
  '最新課程資訊摘要': 'Latest Programme Information',
  'HDAI-ICT / BScAI 課程資料整理': 'HDAI-ICT / BScAI Programme Summary',
  '已整理入學、課程、升學、就業、資助、獎學金、公司合作及 internship 支援；詳細內容已分成多個正式分頁。': 'Admissions, programme structure, articulation, career pathways, funding, scholarships, industry collaboration and internship support are organised into dedicated pages.',
  '整合 HDAI-ICT 人工智能及資訊通訊科技高級文憑 與 BScAI 人工智能（榮譽）理學士 的課程、升學、資助及業界資訊，整體版面參考 SFUHK 官方首頁分區。': 'This site summarises HDAI-ICT and BScAI programme information, including programme structure, articulation, funding, scholarships and industry support, using an SFUHK official-site style layout.',
  '查看 HDAI-ICT / BScAI': 'View HDAI-ICT / BScAI',
  '入學路線及申請入口': 'Admissions route and application entry',
  '了解 HD → Degree → Postgrad': 'Understand HD → Degree → Postgraduate pathways',
  '資助、獎學金及貸款': 'Funding, scholarships and loans',
  '參考官方首頁 Subject Areas 呈現方式，集中展示 AI 及 ICT 相關課程。': 'AI and ICT programmes are presented using an official Subject Areas style.',
  '建立 programming、AI、ICT、data、web、cloud 及 network 基礎。': 'Build foundations in programming, AI, ICT, data, web, cloud and networking.',
  '深入 machine learning、deep learning、computer vision、NLP 及 applied AI。': 'Study machine learning, deep learning, computer vision, NLP and applied AI in greater depth.',
  '資助與獎學金': 'Scholarships and Financial Assistance',
  '就業出路': 'Career Pathways',
  '公司合作': 'Industry Collaboration',
  '課程內容': 'Programme Structure',
  '平時讀啲咩？': 'What do students study?',
  '常見問題': 'Frequently Asked Questions',
  '公司合作 / Internship': 'Industry Collaboration / Internship',
  '呢頁以官網「Career Services / Industry」feel 展示實習、公司合作、career talks、company visits 同業界支援。': 'This page presents internships, industry collaboration, career talks, company visits and industry support in a Career Services / Industry style.',
  '課程設有業界連繫及實習支援，包括 internship opportunities、guest lectures、company visits、career planning、industry sharing 及 job opportunities，協助學生了解 AI 及 ICT 行業發展。': 'The programmes provide industry connections and internship support, including internship opportunities, guest lectures, company visits, career planning, industry sharing and job opportunities, helping students understand developments in the AI and ICT sectors.',
  '呢頁用 SFU 官網 Admissions 風格整理入學路線：直接入 BScAI、先讀 HDAI-ICT，再銜接 degree。': 'This page outlines admissions pathways in an SFU-style format: direct entry to BScAI, entry to HDAI-ICT, and articulation to degree study.',
  '入學路線': 'Admissions Pathways',
  '下一步': 'Next Step',
  '點揀？': 'How to choose?',
  '適合邊類學生？': 'Who is it suitable for?',
  '升學方向': 'Articulation Direction',
  '讀完仲可唔可以再上？': 'Can graduates continue to further study?',
  '畢業出路': 'Career Pathways',
  '首頁 / 入學': 'Home / Admissions',
  'Home / Admissions': 'Home / Admissions',
  'Home / Industry Collaboration': 'Home / Industry Collaboration',
  'Home / Programme Offerings': 'Home / Programme Offerings',
  'Home / Search / FAQ': 'Home / Search / FAQ',
  '學生支援': 'Student Support',
  '申請入學': 'Apply Now',
  '搜尋': 'Search'
}));

const phraseHansMap = new Map(Object.entries({
  '資料以 SFUHK 及 JUPAS 最新官方公布為準。': '资料以 SFUHK 及 JUPAS 最新官方公布为准。',
  '人工智能及資訊通訊科技高級文憑': '人工智能及信息通信科技高级文凭',
  '人工智能（榮譽）理學士': '人工智能（荣誉）理学士',
  '最新課程資訊摘要': '最新课程资讯摘要',
  '資助與獎學金': '资助与奖学金',
  '畢業出路': '毕业出路',
  '課程內容': '课程内容',
  '常見問題': '常见问题',
  '開關選單': '开关菜单'
}));

const charHansMap = {
  '學':'学','體':'体','資訊':'资讯','訊':'讯','課':'课','與':'与','榮':'荣','譽':'誉','資':'资','獎':'奖','業':'业','聯':'联','連':'连','繫':'系','參':'参','觀':'观','職':'职','劃':'划','準':'准','確':'确','畢':'毕','頁':'页','網':'网','簡':'简','選':'选','擇':'择','級':'级','憑':'凭','語':'语','為':'为','會':'会','實':'实','習':'习','應':'应','該':'该','現':'现','內':'内','單':'单','後':'后','將':'将','開':'开','關':'关','導':'导','覽':'览','這':'这','個':'个','較':'较','別':'别','條':'条','徑':'径','係':'是','啲':'些','咩':'什么','唔':'不','嘅':'的','喺':'在','佢':'它','哋':'们','睇':'看','寫':'写','過':'过','話':'说','對':'对','讓':'让','風':'风','並':'并','設':'设','時':'时','間':'间','維':'维','護':'护','務':'务','碼':'码','據':'据','數':'数','優':'优','點':'点','適':'适','門':'门','報':'报','讀':'读','銜':'衔','請':'请','當':'当','長':'长','總':'总','結':'结','標':'标','題':'题','動':'动','廣':'广','東':'东','項':'项','嗎':'吗','區':'区','顯':'显','示':'示','師':'师','發':'发','展':'展'
};

function toSimplified(text) {
  const trimmed = text.trim();
  let output = phraseHansMap.has(trimmed) ? text.replace(trimmed, phraseHansMap.get(trimmed)) : text;
  Object.entries(charHansMap).forEach(([from, to]) => {
    output = output.split(from).join(to);
  });
  return output;
}

function translateText(text, lang) {
  const trimmed = text.trim();
  if (!trimmed || lang === 'zh-hant') return text;
  if (lang === 'zh-hans') return toSimplified(text);
  const translated = enMap.get(trimmed);
  return translated ? text.replace(trimmed, translated) : text;
}

function applyLanguage(lang) {
  document.documentElement.lang = lang === 'en' ? 'en' : (lang === 'zh-hans' ? 'zh-Hans' : 'zh-Hant-HK');
  textNodes.forEach(node => {
    const original = originalText.get(node) || node.nodeValue;
    node.nodeValue = translateText(original, lang);
  });
  document.querySelectorAll('.language-switcher button').forEach(button => {
    button.classList.toggle('active', button.dataset.lang === lang);
  });
  localStorage.setItem('sfu-site-lang', lang);
}

document.querySelectorAll('.language-switcher button').forEach(button => {
  button.addEventListener('click', () => applyLanguage(button.dataset.lang));
});

applyLanguage(localStorage.getItem('sfu-site-lang') || 'zh-hant');

toggle?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.nav a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
  });
});

const revealTargets = document.querySelectorAll([
  '.programme-card', '.structure-grid article', '.career-grid article', '.subpage-grid article', '.content-card', '.directory-block', '.cta-banner', '.partner-strip span', '.quick-links a', '.faq details', '.pathway-line article'
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
    window.setTimeout(() => { window.location.href = url.href; }, 260);
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
