const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
    const suffix = el.dataset.suffix || '';
    if (reduceMotion) {
      el.textContent = formatNumber(target, decimals) + suffix;
      return;
    }
    const duration = 1200;
    const start = performance.now();
    function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = formatNumber(target * eased, decimals) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.proof-number').forEach(el => {
  el.dataset.suffix = el.dataset.target === '2.5' ? '+' : '';
  counterObserver.observe(el);
});

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
    desc: 'Developed a full payment and money transfer module on OutSystems for Infath, a government auctions platform under the Saudi Ministry of Justice. The system integrates with external banking APIs to handle real time transaction processing, automated invoice generation and payment reconciliation across multiple banking providers.',
    highlights: [
      'Integrated external banking APIs for real time transaction processing',
      'Built automated invoice generation and payment tracking workflows',
      'Implemented secure API authentication flows with token management',
      'Handled multi provider payment routing with error recovery',
      'Designed for high availability with transaction rollback support'
    ],
    tags: ['OutSystems', 'REST APIs', 'Banking', 'Enterprise', 'Payment Processing'],
    links: [
      { label: 'Infath platform', url: 'https://infath.gov.sa/en/home/' }
    ]
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
    links: [
      { label: 'GitHub repo', url: 'https://github.com/rexsez/Auto-GRC' }
    ]
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

  wrapper.querySelector('.project-detail').innerHTML =
    '<div class="project-detail-content">' +
    '<p class="project-detail-desc body-3">' + data.desc + '</p>' +
    '<div class="project-detail-section"><h4 class="title-4">Key highlights</h4>' +
    '<ul class="dot-list body-5">' + data.highlights.map(h => '<li>' + h + '</li>').join('') + '</ul></div>' +
    '<div class="project-detail-section"><h4 class="title-4">Technologies</h4>' +
    '<div class="tag-list">' + data.tags.map(t => '<span>' + t + '</span>').join('') + '</div></div>' +
    linksHtml +
    '</div>';

  wrapper.classList.add('active');
  wrapper.querySelector('.project-card').setAttribute('aria-expanded', 'true');
}
