const animationLink = document.createElement('link');
animationLink.rel = 'stylesheet';
animationLink.href = 'assets/animations.css?motion=1';
document.head.appendChild(animationLink);

const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const links = document.querySelectorAll('.nav a');
const topButton = document.querySelector('.back-to-top');

const globalStyle = document.createElement('style');
globalStyle.textContent = `
  .crest {
    width: 168px !important;
    height: 52px !important;
    border: 0 !important;
    border-radius: 0 !important;
    background: transparent url('assets/sfu-logo.svg?logo=4') center / contain no-repeat !important;
    color: transparent !important;
    font-size: 0 !important;
    flex: 0 0 168px !important;
  }
  .brand { gap: 1rem !important; }
  .brand > span:last-child strong { color: #7a1f2d !important; }
  .language-switcher {
    display: inline-flex;
    gap: 0.25rem;
    align-items: center;
    margin-left: 0.8rem;
    padding-left: 0.8rem;
    border-left: 1px solid rgba(255,255,255,.25);
  }
  .language-switcher button {
    border: 1px solid rgba(255,255,255,.35);
    background: transparent;
    color: #fff;
    border-radius: 999px;
    padding: .22rem .55rem;
    font-size: .78rem;
    font-weight: 800;
    cursor: pointer;
    transition: background-color .2s ease, color .2s ease;
  }
  .language-switcher button.active,
  .language-switcher button:hover {
    background: #fff;
    color: #7a1f2d;
  }
  @media (max-width: 760px) {
    .crest {
      width: 132px !important;
      height: 38px !important;
      flex-basis: 132px !important;
    }
    .brand > span:last-child { display: none !important; }
    .language-switcher {
      margin-left: 0;
      padding-left: 0;
      border-left: 0;
      margin-top: .4rem;
    }
  }
`;
document.head.appendChild(globalStyle);

const transitionCover = document.createElement('div');
transitionCover.className = 'page-transition-cover';
document.body.appendChild(transitionCover);

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

function addLanguageSwitcher() {
  const utilityNav = document.querySelector('.utility-bar nav');
  if (!utilityNav || document.querySelector('.language-switcher')) return;
  const wrap = document.createElement('div');
  wrap.className = 'language-switcher';
  wrap.setAttribute('aria-label', 'Language selector');
  wrap.innerHTML = `
    <button type="button" data-lang="zh-hant">繁</button>
    <button type="button" data-lang="en">EN</button>
    <button type="button" data-lang="zh-hans">简</button>
  `;
  utilityNav.appendChild(wrap);
}

addLanguageSwitcher();

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
  'Saint Francis University': 'Saint Francis University',
  'AI & ICT Programme Information': 'AI & ICT Programme Information',
  'Announcement': 'Announcement',
  'Apply Now': 'Apply Now',
  'Student Support': 'Student Support',
  'Search': 'Search',
  'Admissions': 'Admissions',
  'Programme List': 'Programme List',
  'HDAI-ICT': 'HDAI-ICT',
  'BScAI': 'BScAI',
  'Articulation': 'Articulation',
  'Scholarships': 'Scholarships',
  'Career': 'Career',
  'Industry': 'Industry',
  'Programme Admissions': 'Programme Admissions',
  'Artificial Intelligence & ICT': 'Artificial Intelligence & ICT',
  '整合 HDAI-ICT 人工智能及資訊通訊科技高級文憑 與 BScAI 人工智能（榮譽）理學士 的課程、升學、資助及業界資訊，整體版面參考 SFUHK 官方首頁分區。': 'This site summarises HDAI-ICT and BScAI programme information, including programme structure, articulation, funding, scholarships and industry support, using an SFUHK official-site style layout.',
  '最新課程資訊摘要': 'Latest Programme Information',
  'HDAI-ICT / BScAI 課程資料整理': 'HDAI-ICT / BScAI Programme Summary',
  '已整理入學、課程、升學、就業、資助、獎學金、公司合作及 internship 支援；詳細內容已分成多個正式分頁。': 'Admissions, programme structure, articulation, career pathways, funding, scholarships, industry collaboration and internship support are organised into dedicated pages.',
  '查看 HDAI-ICT / BScAI': 'View HDAI-ICT / BScAI',
  '入學路線及申請入口': 'Admissions route and application entry',
  '了解 HD → Degree → Postgrad': 'Understand HD → Degree → Postgraduate pathways',
  '資助、獎學金及貸款': 'Funding, scholarships and loans',
  'Subject Areas': 'Subject Areas',
  'Techno-Humanities': 'Techno-Humanities',
  '參考官方首頁 Subject Areas 呈現方式，集中展示 AI 及 ICT 相關課程。': 'AI and ICT programmes are presented using an official Subject Areas style.',
  'Higher Diploma': 'Higher Diploma',
  'Higher Diploma in Artificial Intelligence and Information and Communication Technology': 'Higher Diploma in Artificial Intelligence and Information and Communication Technology',
  '建立 programming、AI、ICT、data、web、cloud 及 network 基礎。': 'Build foundations in programming, AI, ICT, data, web, cloud and networking.',
  'View Programme Details →': 'View Programme Details →',
  'Bachelor Degree': 'Bachelor Degree',
  'Bachelor of Science (Honours) in Artificial Intelligence': 'Bachelor of Science (Honours) in Artificial Intelligence',
  '深入 machine learning、deep learning、computer vision、NLP 及 applied AI。': 'Study machine learning, deep learning, computer vision, NLP and applied AI in greater depth.',
  '資助與獎學金': 'Scholarships and Financial Assistance',
  '就業出路': 'Career Pathways',
  '公司合作': 'Industry Collaboration',
  '課程內容': 'Programme Structure',
  '資料以 SFUHK 及 JUPAS 最新官方公布為準。': 'Information is subject to the latest official announcements from SFUHK and JUPAS.',
  'Home / Programme Offerings': 'Home / Programme Offerings',
  'Programme Offerings': 'Programme Offerings',
  'AI & ICT Programme List': 'AI & ICT Programme List',
  '參考 SFUHK 官方「Programme Offerings」頁面做法，將 AI 相關課程按學士及副學位分開展示，方便學生比較入學、升學及就業方向。': 'AI-related programmes are organised by undergraduate and sub-degree level for easier comparison of admissions, articulation and career pathways.',
  'In this section': 'In this section',
  'Undergraduate Programmes': 'Undergraduate Programmes',
  'Sub-degree Programmes': 'Sub-degree Programmes',
  '點揀？': 'How to choose?',
  'HDAI-ICT 適合想先打 IT、programming、AI、web、cloud、data 基礎，再升 degree 或投身初階 IT 工作嘅學生。BScAI 就適合想直接讀 AI 學士，深入 machine learning、deep learning、computer vision、NLP 同 applied AI 嘅學生。': 'HDAI-ICT suits students who want to build IT, programming, AI, web, cloud and data foundations before articulation or entry-level IT work. BScAI suits students who want to study an AI bachelor’s degree directly and go deeper into machine learning, deep learning, computer vision, NLP and applied AI.',
  'Home / Admissions': 'Home / Admissions',
  '呢頁用 SFU 官網 Admissions 風格整理入學路線：直接入 BScAI、先讀 HDAI-ICT，再銜接 degree。': 'This page outlines admissions pathways in an SFU-style format: direct entry to BScAI, entry to HDAI-ICT, and articulation to degree study.',
  'Overview': 'Overview',
  'Fees & Support': 'Fees & Support',
  '入學路線': 'Admissions Pathways',
  'Direct Entry': 'Direct Entry',
  'DSE / 同等學歷 → BScAI 人工智能（榮譽）理學士': 'HKDSE / equivalent qualifications → BScAI',
  'Sub-degree Entry': 'Sub-degree Entry',
  'DSE / 同等學歷 → HDAI-ICT 高級文憑': 'HKDSE / equivalent qualifications → HDAI-ICT',
  'HDAI-ICT → BScAI / BScDET，視乎 GPA 及學術要求': 'HDAI-ICT → BScAI / BScDET, subject to GPA and academic requirements',
  'BScAI 入學重點': 'BScAI Admissions Highlights',
  'BScAI 是 4 年全日制人工智能學士課程，JUPAS code 為 JSSA04，並設 SSSDP 資助學額。適合想直接讀 AI、ML、data、computer vision、NLP 及 applied AI 的學生。': 'BScAI is a four-year full-time AI bachelor’s degree. Its JUPAS code is JSSA04 and it offers SSSDP-subsidised places for eligible local students. It suits students interested in AI, ML, data, computer vision, NLP and applied AI.',
  'HDAI-ICT 入學重點': 'HDAI-ICT Admissions Highlights',
  'HDAI-ICT 是 2 年全日制 / 3 年兼讀制高級文憑，教學語言為英文並輔以中文。適合想先打好 AI + ICT 基礎，再升學或就業的學生。': 'HDAI-ICT is a two-year full-time / three-year part-time higher diploma. The medium of instruction is English supplemented by Chinese. It suits students who want AI + ICT foundations for further study or employment.',
  '下一步': 'Next Step',
  '先比較 Programme List，再睇 Scholarships / Articulation，會最清楚自己應該行 HD 路線定直接 Degree 路線。': 'Compare the programme list first, then review scholarships and articulation pathways to decide whether the HD route or direct degree route is more suitable.',
  'Home / Programme List / HDAI-ICT': 'Home / Programme List / HDAI-ICT',
  'Sub-degree Programme': 'Sub-degree Programme',
  'HDAI-ICT 係 AI + ICT 高級文憑路線，適合想先打好 IT、programming、AI、data、web、cloud 及 network 基礎嘅學生。': 'HDAI-ICT is an AI + ICT higher diploma pathway for students who want to build foundations in IT, programming, AI, data, web, cloud and networking.',
  'Programme Menu': 'Programme Menu',
  'Introduction': 'Introduction',
  'Career Pathways': 'Career Pathways',
  'Financial Support': 'Financial Support',
  'Programme Overview': 'Programme Overview',
  'Programme Code': 'Programme Code',
  'Duration': 'Duration',
  'Medium': 'Medium',
  'QF Level': 'QF Level',
  '2-year full-time / 3-year part-time': '2-year full-time / 3-year part-time',
  'English supplemented by Chinese': 'English supplemented by Chinese',
  'Level 4': 'Level 4',
  '平時讀啲咩？': 'What do students study?',
  'Year 1：打底': 'Year 1: Foundation',
  'Introduction to IT, AI and Metaverse、Computer Programming、Discrete Mathematics and Linear Algebra、Statistics and Data Analysis、語文及通識科目。': 'Introduction to IT, AI and Metaverse, Computer Programming, Discrete Mathematics and Linear Algebra, Statistics and Data Analysis, languages and general education subjects.',
  'Year 2：應用': 'Year 2: Application',
  'Data Structures and Algorithms、Calculus、Network, Cloud and Security、Web Design and Development、Artificial Intelligence、Machine Learning、Applied ICT Project。': 'Data Structures and Algorithms, Calculus, Network, Cloud and Security, Web Design and Development, Artificial Intelligence, Machine Learning and Applied ICT Project.',
  '適合邊類學生？': 'Who is it suitable for?',
  '想入 AI / IT 行業，但想先用高級文憑打底。': 'Students who want to enter AI / IT but prefer to build foundations through a higher diploma first.',
  'DSE 未必直接入 degree，但想之後銜接 BScAI / BScDET。': 'Students who may not enter degree study directly after DSE but want to articulate to BScAI / BScDET later.',
  '想學 programming、web、cloud、data、AI project 嘅實用技能。': 'Students who want practical skills in programming, web, cloud, data and AI projects.',
  '升學方向': 'Articulation Direction',
  '完成 HDAI-ICT 後，可按 GPA 及課程要求準備銜接 BScAI 或 BScDET。': 'After completing HDAI-ICT, students may prepare to articulate to BScAI or BScDET subject to GPA and programme requirements.',
  'Home / Programme List / BScAI': 'Home / Programme List / BScAI',
  "Bachelor's Degree Programme": "Bachelor's Degree Programme",
  'BScAI 係人工智能學士路線，主打 AI、machine learning、deep learning、computer vision、NLP、data 及跨學科 AI 應用。': 'BScAI is an AI bachelor’s degree pathway focusing on AI, machine learning, deep learning, computer vision, NLP, data and cross-disciplinary AI applications.',
  '4-year full-time programme': '4-year full-time programme',
  'English': 'English',
  'Level 5': 'Level 5',
  'Funding': 'Funding',
  'SSSDP subsidised places for eligible local students': 'SSSDP subsidised places for eligible local students',
  'Year 1–2：AI + IT 基礎': 'Year 1–2: AI + IT Foundations',
  'Computer Programming、Advanced Programming、Discrete Mathematics、Statistics、Web Design、Network / Cloud / Security、Data Structures、Artificial Intelligence、Machine Learning、Calculus。': 'Computer Programming, Advanced Programming, Discrete Mathematics, Statistics, Web Design, Network / Cloud / Security, Data Structures, Artificial Intelligence, Machine Learning and Calculus.',
  'Year 3–4：AI 專業主菜': 'Year 3–4: Advanced AI Core',
  'Software Engineering、Deep Learning、Computer Vision and Image Processing、Natural Language Processing、IT Professional Practice and Ethics、Final Year Project。': 'Software Engineering, Deep Learning, Computer Vision and Image Processing, Natural Language Processing, IT Professional Practice and Ethics and Final Year Project.',
  'Applied AI 選修方向': 'Applied AI Elective Areas',
  '讀完仲可唔可以再上？': 'Can graduates continue to further study?',
  '可以。BScAI 畢業後可申請 MSc、MPhil 或 PhD，例如 AI、Machine Learning、Data Science、Computer Science、Cybersecurity、Software Engineering。': 'Yes. After BScAI, graduates may apply for MSc, MPhil or PhD programmes in areas such as AI, Machine Learning, Data Science, Computer Science, Cybersecurity and Software Engineering.',
  'Home / Articulation': 'Home / Articulation',
  'Further Study': 'Further Study',
  'Articulation Pathway': 'Articulation Pathway',
  '由 HDAI-ICT 升上 BScAI / BScDET，再上 MSc、MPhil 或 PhD，成條路線清楚拆開。': 'This page outlines the full pathway from HDAI-ICT to BScAI / BScDET and then to MSc, MPhil or PhD study.',
  'Pathway': 'Pathway',
  'Start with HD': 'Start with HD',
  'Bachelor Degree': 'Bachelor Degree',
  'HDAI-ICT': 'HDAI-ICT',
  '完成 2 年高級文憑，建立 AI、ICT、programming、web、cloud、data 及 project 基礎。': 'Complete the two-year higher diploma and build foundations in AI, ICT, programming, web, cloud, data and projects.',
  'BScAI / BScDET': 'BScAI / BScDET',
  '達到指定 GPA 及學術要求後，可準備銜接相關學士課程。': 'Subject to GPA and academic requirements, students may prepare to articulate to related bachelor’s degree programmes.',
  'MSc / MPhil / PhD': 'MSc / MPhil / PhD',
  '完成 BScAI 後，可申請 AI、Data Science、Computer Science、Cybersecurity、Software Engineering 等深造課程。': 'After completing BScAI, graduates may apply for postgraduate programmes in AI, Data Science, Computer Science, Cybersecurity, Software Engineering and related fields.',
  'HD → Degree': 'HD → Degree',
  'HDAI-ICT 畢業生如達到最低 GPA 要求，可準備銜接 SFUHK 相關學士課程，例如 BScAI 或 BScDET。實際入學及學分豁免安排要按大學最新規定。': 'HDAI-ICT graduates who meet the minimum GPA requirement may prepare to articulate to related SFUHK bachelor’s degree programmes such as BScAI or BScDET. Actual admission and credit transfer arrangements are subject to the latest university regulations.',
  'Degree → Postgraduate': 'Degree → Postgraduate',
  'BScAI 畢業後可繼續申請 taught master、postgraduate diploma、MPhil 或 PhD。想行研究路線，Final Year Project、GPA、推薦信及 AI / data project 經驗會好重要。': 'After BScAI, graduates may apply for taught master’s degrees, postgraduate diplomas, MPhil or PhD programmes. For research pathways, the final year project, GPA, recommendation letters and AI / data project experience are important.',
  'Home / Student Support / Scholarships': 'Home / Student Support / Scholarships',
  'Scholarships & Financial Assistance': 'Scholarships & Financial Assistance',
  '用官方 Student Support 頁面風格，整理 BScAI / HDAI-ICT 可留意嘅資助、獎學金及貸款。': 'This page presents funding, scholarships and loans relevant to BScAI and HDAI-ICT in a Student Support style.',
  'Student Support': 'Student Support',
  'Scholarships': 'Scholarships',
  'Admission Scholarship Schemes': 'Admission Scholarship Schemes',
  '按入學成績考慮，例如 Entrance Scholarship / Academic Achievement Scholarship。': 'Considered based on admission results, such as Entrance Scholarship / Academic Achievement Scholarship.',
  'Internal Articulation Scholarships': 'Internal Articulation Scholarships',
  '適用於合資格內部銜接學生。': 'Applicable to eligible internal articulation students.',
  'Financial Assistance': 'Financial Assistance',
  '重要提醒': 'Important Note',
  '好多獎學金由大學按成績或資格自動考慮；不同獎學金通常不可同時領取。實際資格、金額及申請安排要以 SFUHK 最新公布為準。': 'Many scholarships are considered automatically based on results or eligibility. Different scholarships are usually not tenable concurrently. Actual eligibility, amount and application arrangements are subject to SFUHK’s latest announcements.',
  'Home / Career Services': 'Home / Career Services',
  '畢業出路': 'Career Pathways',
  '參考 SFU Career Services 概念，將 AI & ICT 畢業後可行嘅職涯方向分門別類展示。': 'This page presents AI & ICT career directions using a Career Services style.',
  'Programming / Software': 'Programming / Software',
  'Programmer、Software Developer、Web Developer、App Developer、Front-end / Back-end Engineer。': 'Programmer, Software Developer, Web Developer, App Developer, Front-end / Back-end Engineer.',
  'AI / Data': 'AI / Data',
  'AI Data Analyst、Machine Learning Engineer、Deep Learning Engineer、Big Data Engineer。': 'AI Data Analyst, Machine Learning Engineer, Deep Learning Engineer, Big Data Engineer.',
  'Systems / Cloud': 'Systems / Cloud',
  'System Analyst、Database Developer、Cloud / Network / Security 相關技術職位。': 'System Analyst, Database Developer and Cloud / Network / Security related technical roles.',
  'Applied AI': 'Applied AI',
  'AI and FinTech Developer、AI and Healthcare Developer、AI in Education / Translation / Robotics。': 'AI and FinTech Developer, AI and Healthcare Developer, AI in Education / Translation / Robotics.',
  'Career Readiness': 'Career Readiness',
  '網站文字可以寫「提供職涯規劃、CV / interview 支援、career talks、company visits、實習及畢業就業資訊」，但唔好寫成保證工作 offer。': 'The site may describe career planning, CV / interview support, career talks, company visits, internship and graduate employment information, without implying guaranteed job offers.',
  'Home / Industry Collaboration': 'Home / Industry Collaboration',
  'Industry Collaboration': 'Industry Collaboration',
  '公司合作 / Internship': 'Industry Collaboration / Internship',
  '呢頁以官網「Career Services / Industry」feel 展示實習、公司合作、career talks、company visits 同業界支援。': 'This page presents internships, industry collaboration, career talks, company visits and industry support in a Career Services / Industry style.',
  'Industry Support': 'Industry Support',
  '課程設有業界連繫及實習支援，包括 internship opportunities、guest lectures、company visits、career planning、industry sharing 及 job opportunities，協助學生了解 AI 及 ICT 行業發展。': 'The programmes provide industry connections and internship support, including internship opportunities, guest lectures, company visits, career planning, industry sharing and job opportunities, helping students understand developments in the AI and ICT sectors.',
  'Home / Search / FAQ': 'Home / Search / FAQ',
  'Search / FAQ': 'Search / FAQ',
  '常見問題': 'Frequently Asked Questions',
  '將原本首頁 FAQ 獨立成一頁，更似 SFU 官網嘅 Search / support 分頁結構。': 'The FAQ is separated into its own page to better match an official Search / Support page structure.',
  'HDAI-ICT 係咪一定要好識 coding？': 'Do HDAI-ICT students need strong coding skills?',
  '唔一定。課程會由 IT、programming、maths、statistics 同 AI 基礎開始。不過有興趣自己練 Python / web 會更易跟上。': 'Not necessarily. The programme starts from IT, programming, maths, statistics and AI foundations. Practising Python / web skills will make it easier to follow.',
  'HD 讀完係咪一定升到 Degree？': 'Does completing HD guarantee degree articulation?',
  '唔係自動保證。一般要完成課程並達到指定 GPA / 學術要求，實際安排要以大學最新公布為準。': 'No. Students generally need to complete the programme and meet specified GPA / academic requirements. Actual arrangements are subject to the latest university announcements.',
  '資助同獎學金點分？': 'What is the difference between funding and scholarships?',
  '資助通常係政府或助學金 / 貸款支援；獎學金通常按成績、入學表現、銜接路線或特定資格考慮。': 'Funding usually refers to government assistance, bursaries or loans; scholarships are usually considered based on results, admission performance, articulation route or specific eligibility.'
}));

const zhHansPhraseMap = new Map(Object.entries({
  '資料以 SFUHK 及 JUPAS 最新官方公布為準。': '资料以 SFUHK 及 JUPAS 最新官方公布为准。',
  '公司合作 / Internship': '公司合作 / Internship',
  '人工智能及資訊通訊科技高級文憑': '人工智能及信息通信科技高级文凭',
  '人工智能（榮譽）理學士': '人工智能（荣誉）理学士',
  '最新課程資訊摘要': '最新课程资讯摘要',
  '資助與獎學金': '资助与奖学金',
  '畢業出路': '毕业出路',
  '課程內容': '课程内容',
  '常見問題': '常见问题'
}));

const tradToSimp = {
  '學':'学','體':'体','資訊':'资讯','訊':'讯','課':'课','程':'程','與':'与','榮':'荣','譽':'誉','理':'理','學':'学','士':'士','資':'资','獎':'奖','助':'助','業':'业','聯':'联','連':'连','繫':'系','參':'参','觀':'观','職':'职','劃':'划','準':'准','確':'确','畢':'毕','華':'华','頁':'页','網':'网','站':'站','簡':'简','繁':'繁','體':'体','選':'选','擇':'择','級':'级','憑':'凭','語':'语','為':'为','會':'会','實':'实','習':'习','應':'应','該':'该','現':'现','內':'内','單':'单','後':'后','將':'将','開':'开','關':'关','導':'导','覽':'览','這':'这','個':'个','較':'较','別':'别','條':'条','徑':'径','係':'是','啲':'些','咩':'什么','唔':'不','嘅':'的','喺':'在','佢':'它','哋':'们','睇':'看','寫':'写','埋':'上','過':'过','話':'说','對':'对','讓':'让','風':'风','較':'较','並':'并','設':'设','時':'时','間':'间','維':'维','護':'护','務':'务','碼':'码','據':'据','據':'据','數':'数','碼':'码','優':'优','點':'点','適':'适','門':'门','報':'报','讀':'读','銜':'衔','接':'接','實':'实','際':'际','規':'规','則':'则','申':'申','請':'请','當':'当','長':'长','總':'总','結':'结','覽':'览','標':'标','題':'题','啟':'启','動':'动','廣':'广','東':'东','選':'选','項':'项','嗎':'吗','嗎':'吗'
};

function toSimplified(text) {
  if (zhHansPhraseMap.has(text.trim())) {
    return text.replace(text.trim(), zhHansPhraseMap.get(text.trim()));
  }
  let output = text;
  Object.entries(tradToSimp).forEach(([from, to]) => {
    output = output.split(from).join(to);
  });
  return output;
}

function translateText(text, lang) {
  const trimmed = text.trim();
  if (!trimmed) return text;
  if (lang === 'zh-hant') return text;
  if (lang === 'zh-hans') return toSimplified(text);
  if (lang === 'en') {
    const translated = enMap.get(trimmed);
    return translated ? text.replace(trimmed, translated) : text;
  }
  return text;
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
