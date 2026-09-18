// Mobile nav toggle
const toggle = document.getElementById('nav-toggle');
const navLinks = document.querySelector('.nav-links');

toggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Scroll fade-in
const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -40px 0px' };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll(
  '.about-text, .about-terminal, .timeline-item, .edu-card, .skill-card, .cert-item, .project-wrapper, .contact-desc, .contact-links'
).forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});

// Stat counter animation
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-target'), 10);
      let current = 0;
      const step = Math.ceil(target / 30);
      const interval = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(interval);
        }
        el.textContent = current;
      }, 40);
      statObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(el => statObserver.observe(el));

// Project data
const projectData = {
  1: {
    title: 'Payment & Banking Integration',
    desc: 'Developed a full payment and money-transfer module on OutSystems for Infath, a government auctions platform under the Saudi Ministry of Justice. The system integrates with external banking APIs to handle real-time transaction processing, automated invoice generation, and payment reconciliation across multiple banking providers.',
    highlights: [
      'Integrated external banking APIs for real-time transaction processing',
      'Built automated invoice generation and payment tracking workflows',
      'Implemented secure API authentication flows with token management',
      'Handled multi-provider payment routing with error recovery',
      'Designed for high-availability with transaction rollback support'
    ],
    tags: ['OutSystems', 'REST APIs', 'Banking', 'Enterprise', 'Payment Processing'],
    links: [
      { label: 'Infath Platform', url: 'https://infath.gov.sa/en/home/' }
    ]
  },
  2: {
    title: 'Calorie Fit',
    desc: 'Fitness and nutrition calculator platform with a suite of tools — TDEE, BMR, BMI, macro, body-fat and water intake calculators — plus long-form training and nutrition content. Built as a fully static site for speed and SEO, internationalized into four languages, and served from nginx with proper cache headers, sitemap, hreflang, and structured metadata.',
    highlights: [
      'Six interactive calculators covering the core nutrition and body-composition workflow',
      'Internationalized into English, Spanish, Portuguese and Arabic with per-locale routing and hreflang',
      'Static-first architecture — sub-second loads and clean cache headers for HTML vs. assets',
      'SEO groundwork: canonical URLs, Open Graph, sitemap.xml, structured data, alt-language links',
      'Blog and training-guide content pipeline (Hyrox, body recomposition, supplementation)'
    ],
    tags: ['HTML/CSS/JS', 'Tailwind', 'SEO', 'i18n', 'Nginx', 'Static Site'],
    links: [
      { label: 'Live Site', url: 'https://calorie-fit.com/' }
    ]
  },
  3: {
    title: 'Pega Production Environment',
    desc: 'Created the production environment for an internal Pega application on OCI. The main objective was migrating the platform from a standalone Docker-based deployment to a Kubernetes cluster using OKE — enabling scalability, rolling updates, and proper environment isolation for production workloads.',
    highlights: [
      'Migrated the Pega platform from Docker to Kubernetes (OKE) on OCI',
      'Configured OKE cluster with proper resource allocation and pod scaling',
      'Set up environment isolation between development, staging, and production',
      'Established container image pipelines for consistent deployments',
      'Enabled rolling updates and rollback capabilities for zero-downtime releases'
    ],
    tags: ['Kubernetes', 'OCI', 'Docker', 'Pega', 'OKE'],
    links: []
  },
  4: {
    title: 'DDoS Defense System',
    desc: 'Real-time DDoS detection and mitigation system. A machine learning model classifies incoming network traffic as benign or malicious. Once an IP is flagged, it gets added to a blacklist — all subsequent requests from that IP are blocked at the kernel level using XDP/eBPF before they reach the application. Traffic and blocking activity are visualized through Kibana dashboards.',
    highlights: [
      'ML model classifies live network traffic and flags malicious IPs',
      'Flagged IPs are blacklisted — all subsequent requests are blocked via XDP/eBPF',
      'Blocking happens at the kernel level before traffic reaches the application',
      'Kibana dashboards for real-time traffic and blocking visibility',
      'Fully containerized with Docker Compose for single-command deployment'
    ],
    tags: ['C', 'XDP/eBPF', 'Python', 'Machine Learning', 'Kibana', 'Docker', 'Redis'],
    links: [
      { label: 'GitHub Repo', url: 'https://github.com/rexsez/ddos-defense' }
    ]
  },
  5: {
    title: 'Auto-GRC',
    desc: 'Automated Governance, Risk & Compliance engine for Infrastructure-as-Code. Validates Kubernetes, Docker, Terraform, and IAM configurations against security benchmarks — CIS, NIST, ISO 27001, PCI DSS — and blocks non-compliant deployments before they reach production. Includes AI-powered violation explanations and natural-language policy generation.',
    highlights: [
      'Validates infrastructure files through OPA policies in milliseconds',
      'Blocks CI/CD pipelines when compliance violations are detected',
      'AI-powered remediation guidance and policy generation from plain English',
      'Supports Kubernetes, Docker, Terraform, and IAM across multiple standards',
      'Full audit trail with validation history and dashboard analytics'
    ],
    tags: ['Python', 'FastAPI', 'Next.js', 'OPA', 'PostgreSQL', 'Docker', 'AI', 'Rego'],
    links: [
      { label: 'GitHub Repo', url: 'https://github.com/rexsez/Auto-GRC' }
    ]
  },
  6: {
    title: 'Sales Automation System',
    desc: 'Designed and developed an end-to-end sales automation system on Pega to manage the full lifecycle of business opportunities. The platform centralizes contact management, ROI calculations, cost analysis, timelines, and historical data — replacing fragmented spreadsheets with a unified workflow.',
    highlights: [
      'Built a centralized CRM-style platform for managing business opportunities',
      'Automated ROI and cost calculations with dynamic data inputs',
      'Designed workflow automation for opportunity lifecycle tracking',
      'Integrated historical data analysis for sales forecasting',
      'Created role-based dashboards for sales teams and management'
    ],
    tags: ['Pega', 'Automation', 'CRM', 'Low-Code', 'Enterprise'],
    links: []
  }
};

// Project detail panels
document.querySelector('.projects-grid').addEventListener('click', (e) => {
  const card = e.target.closest('.project-card');
  if (!card) return;
  if (e.target.closest('a')) return;
  const wrapper = card.closest('.project-wrapper[data-project]');
  if (!wrapper) return;
  toggleDetail(wrapper);
});

function toggleDetail(wrapper) {
  const id = wrapper.getAttribute('data-project');
  const isActive = wrapper.classList.contains('active');

  document.querySelectorAll('.project-wrapper.active').forEach(w => {
    w.classList.remove('active');
    w.querySelector('.project-detail').innerHTML = '';
  });

  if (isActive) return;

  const data = projectData[id];
  if (!data) return;

  const detailEl = wrapper.querySelector('.project-detail');

  let linksHtml = '';
  if (data.links && data.links.length > 0) {
    linksHtml = '<div class="project-detail-links">' +
      data.links.map(link =>
        '<a href="' + link.url + '" class="project-detail-link" target="_blank" rel="noopener">' + link.label + ' &#8599;</a>'
      ).join('') + '</div>';
  }

  detailEl.innerHTML =
    '<div class="project-detail-inner"><div class="project-detail-content">' +
    '<p class="project-detail-desc">' + data.desc + '</p>' +
    '<div class="project-detail-section"><h4>Key Highlights</h4><ul>' +
    data.highlights.map(h => '<li>' + h + '</li>').join('') +
    '</ul></div>' +
    '<div class="project-detail-section"><h4>Technologies</h4><div class="project-tags">' +
    data.tags.map(t => '<span>' + t + '</span>').join('') +
    '</div></div>' +
    linksHtml +
    '</div></div>';

  requestAnimationFrame(() => wrapper.classList.add('active'));
}
