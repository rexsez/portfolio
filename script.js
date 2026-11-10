const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Contact address is assembled at runtime so it never appears in the raw HTML
(function () {
  const address = ['contact', 'hisham-alsaadawi.com'].join('@');
  document.querySelectorAll('[data-mail]').forEach(a => {
    a.href = 'mailto:' + address;
  });
})();

// Mobile menu
const toggle = document.getElementById('nav-toggle');
const panel = document.getElementById('menu-panel');

function setMenu(open) {
  toggle.setAttribute('aria-expanded', String(open));
  panel.classList.toggle('open', open);
  panel.inert = !open;
  document.documentElement.classList.toggle('menu-open', open);
}

toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
panel.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') setMenu(false);
});
window.matchMedia('(min-width: 769px)').addEventListener('change', (e) => {
  if (e.matches) setMenu(false);
});

// Current section in nav
const navLinks = document.querySelectorAll('.nav-links a, .menu-panel a');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const id = entry.target.id;
    navLinks.forEach(a => {
      if (a.getAttribute('href') === '#' + id) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  });
}, { rootMargin: '-40% 0px -55% 0px' });

['about', 'experience', 'projects', 'skills', 'contact'].forEach(id => {
  const el = document.getElementById(id);
  if (el) sectionObserver.observe(el);
});

// Scroll reveal, once per element
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Proof number counters
function formatNumber(value, decimals) {
  return value.toFixed(decimals);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    counterObserver.unobserve(el);
    const target = parseFloat(el.dataset.target);
    const decimals = parseInt(el.dataset.decimals || (Number.isInteger(target) ? '0' : '1'), 10);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    if (reduceMotion) {
      el.textContent = prefix + formatNumber(target, decimals) + suffix;
      return;
    }
    const duration = 1200;
    const start = performance.now();
    function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = prefix + formatNumber(target * eased, decimals) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.proof-number').forEach(el => counterObserver.observe(el));

// Tagline: words light up one at a time as they cross the trigger line
(function () {
  const tagline = document.getElementById('tagline');
  if (!tagline) return;
  const words = tagline.textContent.trim().split(/\s+/);
  tagline.setAttribute('aria-label', words.join(' '));
  tagline.textContent = '';
  const spans = words.map((w, i) => {
    const span = document.createElement('span');
    span.className = 'word';
    span.setAttribute('aria-hidden', 'true');
    span.textContent = w;
    tagline.appendChild(span);
    if (i < words.length - 1) tagline.appendChild(document.createTextNode(' '));
    return span;
  });

  if (reduceMotion) {
    spans.forEach(s => s.classList.add('on'));
    return;
  }

  const wordObserver = new IntersectionObserver((entries) => {
    const entering = entries
      .filter(e => e.isIntersecting)
      .sort((a, b) => spans.indexOf(a.target) - spans.indexOf(b.target));
    entering.forEach((entry, i) => {
      entry.target.style.transitionDelay = Math.min(i * 40, 400) + 'ms';
      entry.target.classList.add('on');
      wordObserver.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -40% 0px' });

  spans.forEach(s => wordObserver.observe(s));
})();

// Project data
const projectData = {
  1: {
    desc: 'Built the payment system of a high value online auctions platform on OutSystems. It replaced bank cheques with online payments through a national electronic payment system. Bidders pay their entry fee online and are cleared to bid. When an auction closes, the platform sends the result to the payment API: entry fees are refunded automatically to bidders who did not win, the winner\'s remaining amount is issued for online payment, and the proceeds are transferred to the seller\'s bank through a B2B integration. Over $10 billion has been processed through this payment flow since launch.',
    highlights: [
      'Replaced bank cheque payments with online payments through a national electronic payment system',
      'Bidders pay their entry fee online and are cleared to bid',
      'Entry fees are refunded automatically to bidders who did not win',
      'The winner\'s remaining amount is issued for online payment when the auction closes',
      'Proceeds are settled to the seller\'s bank through a B2B integration',
      'Over $10 billion processed through the payment flow since launch'
    ],
    tags: ['OutSystems', 'REST APIs', 'Payment integration', 'B2B settlement', 'Enterprise'],
    note: 'Mostly backend work inside the client\'s system, so there are no screenshots to share. The image on the card is an illustration of the payment flow.',
    links: []
  },
  2: {
    desc: 'Fitness and nutrition calculator platform with TDEE, BMR, BMI, macro, body fat and water intake calculators, plus long form training and nutrition content. Built as a fully static site for speed and SEO, available in four languages, and served from nginx with proper cache headers, sitemap, hreflang and structured metadata.',
    highlights: [
      'Six interactive calculators covering the core nutrition and body composition workflow',
      'English, Spanish, Portuguese and Arabic versions with per locale routing and hreflang',
      'Static first architecture with fast loads and separate cache headers for HTML and assets',
      'SEO groundwork: canonical URLs, Open Graph, sitemap.xml, structured data and alternate language links',
      'Blog and training guide content pipeline covering Hyrox, body recomposition and supplementation'
    ],
    tags: ['HTML/CSS/JS', 'Tailwind', 'SEO', 'i18n', 'Nginx', 'Static Site'],
    shots: [
      { src: 'images/projects/calorie-fit-desktop.webp', w: 1600, h: 1350, alt: 'Calorie Fit calorie calculator with BMR, maintenance and goal results', caption: 'Calorie calculator with results, desktop' },
      { src: 'images/projects/calorie-fit-phone.webp', w: 600, h: 1298, alt: 'Calorie Fit home page on a phone', caption: 'Home page on a phone', phone: true }
    ],
    links: [
      { label: 'Live site', url: 'https://calorie-fit.com/' }
    ]
  },
  3: {
    desc: 'Created the production environment for an internal Pega application on OCI. The main objective was migrating the platform from a standalone Docker deployment to a Kubernetes cluster using OKE, enabling scalability, rolling updates and proper environment isolation for production workloads.',
    highlights: [
      'Migrated the Pega platform from Docker to Kubernetes (OKE) on OCI',
      'Configured the OKE cluster with proper resource allocation and pod scaling',
      'Set up environment isolation between development, staging and production',
      'Established container image pipelines for consistent deployments',
      'Enabled rolling updates and rollback for zero downtime releases'
    ],
    tags: ['Kubernetes', 'OCI', 'Docker', 'Pega', 'OKE'],
    note: 'Internal employer infrastructure, so screenshots can\'t be shared. The image on the card is an illustration of the setup.',
    links: []
  },
  4: {
    desc: 'Real time DDoS detection and mitigation system. A machine learning model classifies incoming network traffic as benign or malicious. Once an IP is flagged, it is added to a blacklist and all later requests from that IP are blocked at the kernel level using XDP/eBPF before they reach the application. Traffic and blocking activity are visualized through Kibana dashboards.',
    highlights: [
      'ML model classifies live network traffic and flags malicious IPs',
      'Flagged IPs are blacklisted and all later requests are blocked via XDP/eBPF',
      'Blocking happens at the kernel level before traffic reaches the application',
      'Kibana dashboards for real time traffic and blocking visibility',
      'Fully containerized with Docker Compose for single command deployment'
    ],
    tags: ['C', 'XDP/eBPF', 'Python', 'Machine Learning', 'Kibana', 'Docker', 'Redis'],
    shots: [
      { src: 'images/projects/ddos-dashboard.webp', lightUi: true, w: 1400, h: 486, alt: 'Kibana dashboard with classified traffic, an ML traffic chart and tables of XDP blocks and drops', caption: 'Kibana dashboard: classified traffic, ML traffic analysis, XDP blocks and drops' }
    ],
    links: [
      { label: 'GitHub repo', url: 'https://github.com/rexsez/ddos-defense' }
    ]
  },
  5: {
    desc: 'Automated governance, risk and compliance engine for infrastructure as code. Validates Kubernetes, Docker, Terraform and IAM configurations against security benchmarks (CIS, NIST, ISO 27001, PCI DSS) and blocks non compliant deployments before they reach production. Includes AI generated violation explanations and natural language policy generation.',
    highlights: [
      'Validates infrastructure files through OPA policies in milliseconds',
      'Blocks CI/CD pipelines when compliance violations are detected',
      'AI remediation guidance and policy generation from plain English',
      'Supports Kubernetes, Docker, Terraform and IAM across multiple standards',
      'Full audit trail with validation history and dashboard analytics'
    ],
    tags: ['Python', 'FastAPI', 'Next.js', 'OPA', 'PostgreSQL', 'Docker', 'AI', 'Rego'],
    shots: [
      { src: 'images/projects/auto-grc-history.webp', lightUi: true, w: 1600, h: 1000, alt: 'Auto-GRC validation history with a failed Terraform run showing critical, high and low violations, fixes and compliance references', caption: 'Validation history: each violation comes with a fix and its CIS, NIST and ISO references' }
    ],
    links: [
      { label: 'GitHub repo', url: 'https://github.com/rexsez/Auto-GRC' }
    ]
  },
  7: {
    desc: 'A self-hosted automation setup on a Linux VPS. Command Center is a passkey-secured mobile web app that runs Claude Code tasks and sends push notifications for tasks and scheduled jobs. A Python sync turns course announcements and emails into to-dos with deadlines in Notion, and sends one daily digest.',
    highlights: [
      'Passkey-secured mobile web app for running tasks and receiving push notifications',
      'Push notifications for tasks and scheduled jobs',
      'Python sync that turns course announcements and emails into to-dos with deadlines in Notion',
      'One daily digest instead of many separate messages',
      'Scheduled jobs managed with systemd and cron, served behind nginx'
    ],
    tags: ['Node.js', 'Express', 'SQLite', 'Python', 'systemd', 'nginx'],
    shots: [
      { src: 'images/projects/automation-notifications.webp', light: 'images/projects/automation-notifications-light.webp', w: 600, h: 1298, alt: 'Notification list with daily digest, new to-do, finished task and job results', caption: 'Notifications by project and source', phone: true },
      { src: 'images/projects/automation-digest.webp', light: 'images/projects/automation-digest-light.webp', w: 600, h: 1298, alt: 'Daily digest listing three to-dos due this week', caption: 'Daily digest of upcoming deadlines', phone: true }
    ],
    links: []
  },
  6: {
    desc: 'Designed and developed a sales automation system on Pega to manage the full lifecycle of business opportunities. The platform centralizes contact management, ROI calculations, cost analysis, timelines and historical data, replacing fragmented spreadsheets with a unified workflow.',
    highlights: [
      'Built a centralized CRM style platform for managing business opportunities',
      'Automated ROI and cost calculations with dynamic data inputs',
      'Designed workflow automation for opportunity lifecycle tracking',
      'Integrated historical data analysis for sales forecasting',
      'Created role based dashboards for sales teams and management'
    ],
    tags: ['Pega', 'Automation', 'CRM', 'Low Code', 'Enterprise'],
    note: 'Internal employer system, so screenshots can\'t be shared. The image on the card is an illustration of the pipeline.',
    links: []
  }
};

// Project detail panels
const projectsGrid = document.querySelector('.projects-grid');

projectsGrid.addEventListener('click', (e) => {
  const card = e.target.closest('.project-card');
  if (!card || e.target.closest('a')) return;
  toggleDetail(card.closest('.project-wrapper'));
});

projectsGrid.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const card = e.target.closest('.project-card');
  if (!card || e.target !== card) return;
  e.preventDefault();
  toggleDetail(card.closest('.project-wrapper'));
});

function closeProject(wrapper) {
  wrapper.classList.remove('active');
  wrapper.querySelector('.project-card').setAttribute('aria-expanded', 'false');
  wrapper.querySelector('.project-detail').innerHTML = '';
}

function toggleDetail(wrapper) {
  const wasActive = wrapper.classList.contains('active');
  document.querySelectorAll('.project-wrapper.active').forEach(closeProject);
  if (wasActive) return;

  const data = projectData[wrapper.dataset.project];
  if (!data) return;

  const linksHtml = data.links.length
    ? '<div class="project-detail-links">' + data.links.map(link =>
        '<a href="' + link.url + '" class="btn btn-primary button-sm" target="_blank" rel="noopener">' +
        link.label + '<i class="ph ph-arrow-up-right" aria-hidden="true"></i></a>'
      ).join('') + '</div>'
    : '';

  const shotsHtml = data.shots && data.shots.length
    ? '<div class="project-detail-section"><h4 class="title-4">Screenshots</h4><div class="shot-gallery">' +
      data.shots.map(shot =>
        '<figure' + (shot.phone ? ' class="phone"' : '') + '>' +
        '<a href="' + shot.src + '" target="_blank" rel="noopener">' +
        (shot.light ? '<picture><source srcset="' + shot.light + '" media="(prefers-color-scheme: light)">' : '') +
        '<img' + (shot.lightUi ? ' class="light-ui"' : '') + ' src="' + shot.src + '" width="' + shot.w + '" height="' + shot.h + '" alt="' + shot.alt + '" loading="lazy" decoding="async">' +
        (shot.light ? '</picture>' : '') + '</a>' +
        '<figcaption class="body-5">' + shot.caption + '</figcaption></figure>'
      ).join('') + '</div></div>'
    : '';

  wrapper.querySelector('.project-detail').innerHTML =
    '<div class="project-detail-content">' +
    '<p class="project-detail-desc body-3">' + data.desc + '</p>' +
    (data.note ? '<p class="project-note body-5"><i class="ph ph-info" aria-hidden="true"></i>' + data.note + '</p>' : '') +
    shotsHtml +
    '<div class="project-detail-section"><h4 class="title-4">Key highlights</h4>' +
    '<ul class="dot-list body-5">' + data.highlights.map(h => '<li>' + h + '</li>').join('') + '</ul></div>' +
    '<div class="project-detail-section"><h4 class="title-4">Technologies</h4>' +
    '<div class="tag-list">' + data.tags.map(t => '<span>' + t + '</span>').join('') + '</div></div>' +
    linksHtml +
    '</div>';

  wrapper.classList.add('active');
  wrapper.querySelector('.project-card').setAttribute('aria-expanded', 'true');
}
