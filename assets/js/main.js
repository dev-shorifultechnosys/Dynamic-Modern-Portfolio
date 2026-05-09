document.addEventListener('DOMContentLoaded', () => {
  applySiteSettings();
  renderNavbarBrand();
  renderHomepage();
  renderProjectDetail();
  setupNavbarScroll();
});

function applySiteSettings() {
  const site = PortfolioStore.getSite();
  document.documentElement.style.setProperty('--primary', site.primaryColor || '#4f46e5');
  document.documentElement.style.setProperty('--secondary', site.secondaryColor || '#06b6d4');
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) metaTheme.content = site.primaryColor || '#4f46e5';
}

function renderNavbarBrand() {
  const site = PortfolioStore.getSite();
  const about = PortfolioStore.getAbout();
  document.querySelectorAll('[data-brand-name]').forEach(item => {
    item.textContent = site.logoText || site.brandName || about.name || 'Portfolio';
  });
  document.querySelectorAll('[data-site-tagline]').forEach(item => {
    item.textContent = site.tagline || '';
  });
}

function renderHomepage() {
  if (!document.querySelector('[data-homepage]')) return;

  const about = PortfolioStore.getAbout();
  const site = PortfolioStore.getSite();
  const stats = PortfolioStore.getStats();
  const skills = PortfolioStore.getSkills();
  const services = PortfolioStore.getServices();
  const experiences = PortfolioStore.getExperiences();
  const projects = PortfolioStore.getPublishedProjects();
  const testimonials = PortfolioStore.getTestimonials();
  const socials = PortfolioStore.getSocials();
  const contact = PortfolioStore.getContactInfo();

  document.title = `${about.name || site.brandName || 'Portfolio'} | ${about.title || 'Creative Portfolio'}`;
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) metaDescription.content = about.intro || site.tagline || metaDescription.content;

  setText('hero-name', about.name);
  setText('hero-title', about.title);
  setText('hero-intro', about.intro);
  setText('hero-location', about.location);
  setText('hero-availability', about.availability);
  setText('about-title', about.title);
  setText('about-description', about.description);
  setText('about-experience', about.experience);
  setText('about-location', about.location);
  setText('about-availability', about.availability);

  document.querySelectorAll('[data-profile-image]').forEach(img => {
    img.src = about.profileImage || PROFILE_IMAGE;
    img.alt = `${about.name || 'Portfolio'} profile image`;
  });

  renderHeroChips(skills);
  renderStats(stats);
  renderServices(services);
  renderSkills(skills);
  renderExperience(experiences);
  renderProjectFilters(projects);
  renderProjects(projects);
  renderTestimonials(testimonials);
  renderSocials(socials);
  renderContactInfo(contact);
  setupContactForm();
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value || '';
}

function renderHeroChips(skills) {
  const wrapper = document.getElementById('hero-skill-chips');
  if (!wrapper) return;
  wrapper.innerHTML = skills.slice(0, 6).map(skill => `<span>${escapeHtml(skill.name)}</span>`).join('');
}

function renderStats(stats) {
  const wrapper = document.getElementById('stats-wrapper');
  if (!wrapper) return;
  wrapper.innerHTML = stats.map(stat => `
    <div class="col-sm-6 col-lg-3">
      <div class="stat-card p-4 h-100 reveal-card">
        <div class="mini-icon mb-3"><i class="bi ${escapeHtml(stat.icon || 'bi-stars')}"></i></div>
        <h3 class="display-6 fw-black gradient-text mb-1">${escapeHtml(stat.value || '')}</h3>
        <p class="mb-0 text-muted fw-semibold">${escapeHtml(stat.label || '')}</p>
      </div>
    </div>
  `).join('');
}

function renderServices(services) {
  const wrapper = document.getElementById('services-wrapper');
  if (!wrapper) return;
  const sorted = [...services].sort((a, b) => Number(a.order || 0) - Number(b.order || 0));
  wrapper.innerHTML = sorted.map(service => `
    <div class="col-md-6 col-xl-4">
      <article class="service-card h-100 reveal-card">
        <div class="service-icon"><i class="bi ${escapeHtml(service.icon || 'bi-stars')}"></i></div>
        <h3 class="h4 fw-bold mb-3">${escapeHtml(service.title)}</h3>
        <p class="text-muted mb-0">${escapeHtml(service.description || '')}</p>
      </article>
    </div>
  `).join('');
}

function renderSkills(skills) {
  const wrapper = document.getElementById('skills-wrapper');
  const filters = document.getElementById('skill-filters');
  if (!wrapper) return;

  const categories = ['All', ...new Set(skills.map(skill => skill.category).filter(Boolean))];
  if (filters) {
    filters.innerHTML = categories.map((category, index) => `
      <button class="filter-btn ${index === 0 ? 'active' : ''}" data-skill-category="${escapeAttr(category)}">${escapeHtml(category)}</button>
    `).join('');
    filters.querySelectorAll('[data-skill-category]').forEach(button => {
      button.addEventListener('click', () => {
        filters.querySelectorAll('[data-skill-category]').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        const category = button.dataset.skillCategory;
        drawSkills(category === 'All' ? skills : skills.filter(skill => skill.category === category));
      });
    });
  }

  drawSkills(skills);

  function drawSkills(items) {
    wrapper.innerHTML = items.map(skill => `
      <div class="col-md-6 col-xl-4">
        <div class="skill-card h-100 reveal-card">
          <div class="d-flex align-items-start gap-3 mb-3">
            <div class="skill-icon mb-0"><i class="bi ${escapeHtml(skill.icon || 'bi-stars')}"></i></div>
            <div class="flex-grow-1">
              <div class="d-flex justify-content-between align-items-start gap-2">
                <h3 class="h5 fw-bold mb-1">${escapeHtml(skill.name)}</h3>
                <span class="fw-bold text-primary">${Number(skill.level) || 0}%</span>
              </div>
              <span class="small text-muted">${escapeHtml(skill.category || 'Skill')}</span>
            </div>
          </div>
          <p class="text-muted small mb-3">${escapeHtml(skill.description || '')}</p>
          <div class="progress" aria-label="${escapeAttr(skill.name)} skill level">
            <div class="progress-bar" style="width:${Number(skill.level) || 0}%"></div>
          </div>
        </div>
      </div>
    `).join('');
  }
}

function renderExperience(experiences) {
  const wrapper = document.getElementById('experience-wrapper');
  if (!wrapper) return;
  wrapper.innerHTML = experiences.map(item => `
    <div class="timeline-item reveal-card">
      <div class="timeline-dot"></div>
      <div class="timeline-card">
        <div class="d-flex justify-content-between flex-wrap gap-2 mb-2">
          <h3 class="h5 fw-bold mb-0">${escapeHtml(item.role || '')}</h3>
          <span class="badge-soft">${escapeHtml(item.start || '')} - ${escapeHtml(item.end || '')}</span>
        </div>
        <p class="fw-semibold text-primary mb-2">${escapeHtml(item.company || '')}</p>
        <p class="text-muted mb-0">${escapeHtml(item.description || '')}</p>
      </div>
    </div>
  `).join('');
}

function renderProjectFilters(projects) {
  const wrapper = document.getElementById('project-filters');
  const search = document.getElementById('project-search');
  if (!wrapper) return;

  const categories = ['All', ...new Set(projects.map(p => p.category).filter(Boolean))];
  wrapper.innerHTML = categories.map((cat, index) => `
    <button class="filter-btn ${index === 0 ? 'active' : ''}" data-filter="${escapeAttr(cat)}">${escapeHtml(cat)}</button>
  `).join('');

  let activeCategory = 'All';
  let activeSearch = '';

  const applyFilter = () => {
    let items = [...projects];
    if (activeCategory !== 'All') items = items.filter(p => p.category === activeCategory);
    if (activeSearch) {
      const q = activeSearch.toLowerCase();
      items = items.filter(p => [p.title, p.category, p.shortDescription, p.technologies].join(' ').toLowerCase().includes(q));
    }
    renderProjects(items);
  };

  wrapper.querySelectorAll('[data-filter]').forEach(button => {
    button.addEventListener('click', () => {
      wrapper.querySelectorAll('[data-filter]').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      activeCategory = button.dataset.filter;
      applyFilter();
    });
  });

  search?.addEventListener('input', () => {
    activeSearch = search.value.trim();
    applyFilter();
  });
}

function renderProjects(projects) {
  const wrapper = document.getElementById('projects-wrapper');
  if (!wrapper) return;

  if (!projects.length) {
    wrapper.innerHTML = `<div class="col-12"><div class="alert alert-info rounded-4">No matching published projects found.</div></div>`;
    return;
  }

  wrapper.innerHTML = projects.map(project => `
    <div class="col-md-6 col-xl-4">
      <article class="project-card reveal-card">
        <div class="project-image-wrap">
          <img src="${project.image || DEMO_IMAGE}" alt="${escapeAttr(project.title)}" loading="lazy">
          ${project.featured ? '<span class="floating-badge">Featured</span>' : ''}
        </div>
        <div class="project-card-body">
          <div class="d-flex align-items-center justify-content-between gap-2 mb-3">
            <span class="badge-soft">${escapeHtml(project.category || 'Project')}</span>
            <small class="text-muted">${formatDate(project.projectDate)}</small>
          </div>
          <h3 class="h4 fw-bold mb-2">${escapeHtml(project.title)}</h3>
          <p class="text-muted mb-4">${escapeHtml(project.shortDescription || '')}</p>
          <div class="tech-line mb-4">${renderTechTags(project.technologies, 3)}</div>
          <div class="d-flex gap-2 flex-wrap">
            <a class="btn btn-sm btn-primary rounded-pill px-3" href="project-detail.html?slug=${encodeURIComponent(project.slug)}">View Details</a>
            ${project.projectLink ? `<a class="btn btn-sm btn-outline-dark rounded-pill px-3" href="${escapeAttr(project.projectLink)}" target="_blank" rel="noopener">Live Link</a>` : ''}
          </div>
        </div>
      </article>
    </div>
  `).join('');
}

function renderTechTags(techString, limit = 99) {
  return String(techString || '')
    .split(',')
    .map(item => item.trim())
    .filter(Boolean)
    .slice(0, limit)
    .map(item => `<span>${escapeHtml(item)}</span>`)
    .join('');
}

function renderTestimonials(testimonials) {
  const wrapper = document.getElementById('testimonials-wrapper');
  if (!wrapper) return;
  wrapper.innerHTML = testimonials.map(item => `
    <div class="col-md-6 col-xl-4">
      <article class="testimonial-card h-100 reveal-card">
        <div class="stars mb-3">${'★'.repeat(Math.max(0, Math.min(5, Number(item.rating) || 5)))}</div>
        <p class="text-muted mb-4">“${escapeHtml(item.message || '')}”</p>
        <div class="d-flex align-items-center gap-3">
          <div class="avatar-circle">${escapeHtml(getInitials(item.name || 'C'))}</div>
          <div>
            <h3 class="h6 fw-bold mb-1">${escapeHtml(item.name || '')}</h3>
            <p class="small text-muted mb-0">${escapeHtml(item.role || '')}</p>
          </div>
        </div>
      </article>
    </div>
  `).join('');
}

function renderSocials(socials) {
  document.querySelectorAll('[data-social-links]').forEach(wrapper => {
    wrapper.innerHTML = socials.map(social => `
      <a class="social-icon" href="${escapeAttr(social.url)}" target="_blank" rel="noopener" aria-label="${escapeAttr(social.platform)}">
        <i class="bi ${escapeHtml(social.icon || 'bi-link-45deg')}"></i>
      </a>
    `).join('');
  });
}

function renderContactInfo(contact) {
  setText('contact-email', contact.email);
  setText('contact-phone', contact.phone);
  setText('contact-address', contact.address);
  setText('contact-location', contact.location);

  const emailLink = document.getElementById('contact-email-link');
  if (emailLink) emailLink.href = `mailto:${contact.email || ''}`;

  const phoneLink = document.getElementById('contact-phone-link');
  if (phoneLink) phoneLink.href = `tel:${String(contact.phone || '').replace(/[^+0-9]/g, '')}`;

  const whatsapp = document.getElementById('contact-whatsapp');
  if (whatsapp) {
    whatsapp.href = `https://wa.me/${String(contact.whatsapp || '').replace(/[^0-9]/g, '')}`;
    whatsapp.innerHTML = `<i class="bi bi-whatsapp"></i> WhatsApp Me`;
  }
}

function setupContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(form);
    const message = {
      name: String(formData.get('name') || '').trim(),
      email: String(formData.get('email') || '').trim(),
      subject: String(formData.get('subject') || '').trim(),
      message: String(formData.get('message') || '').trim()
    };

    if (!message.name || !message.email || !message.message) {
      showToast('Please fill in name, email, and message.', 'danger');
      return;
    }

    PortfolioStore.addMessage(message);
    form.reset();
    showToast('Message submitted successfully. It is saved in the admin panel.', 'success');
  });
}

function renderProjectDetail() {
  const detailRoot = document.querySelector('[data-project-detail]');
  if (!detailRoot) return;

  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');
  const projects = PortfolioStore.getPublishedProjects();
  const project = projects.find(item => item.slug === slug);
  const site = PortfolioStore.getSite();

  if (!project) {
    detailRoot.innerHTML = `
      <section class="project-detail-hero">
        <div class="container text-center">
          <span class="badge-soft d-inline-block mb-3">Project Detail</span>
          <h1 class="fw-black display-5">Project not found</h1>
          <p class="text-muted">The project may be unpublished or removed.</p>
          <a href="index.html#portfolio" class="btn-primary-custom">Back to Portfolio</a>
        </div>
      </section>
    `;
    return;
  }

  document.title = `${project.title} | ${site.brandName || 'Portfolio Project'}`;
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) metaDescription.content = project.shortDescription || project.description || project.title;

  const related = projects
    .filter(item => item.id !== project.id && item.category === project.category)
    .slice(0, 3);

  detailRoot.innerHTML = `
    <section class="project-detail-hero">
      <div class="container">
        <div class="row align-items-center g-5">
          <div class="col-lg-7">
            <span class="badge-soft d-inline-block mb-3">${escapeHtml(project.category || 'Project')}</span>
            <h1 class="hero-title mb-3">${escapeHtml(project.title)}</h1>
            <p class="lead text-muted">${escapeHtml(project.shortDescription || '')}</p>
            <div class="d-flex gap-2 flex-wrap mt-4">
              ${project.projectLink ? `<a href="${escapeAttr(project.projectLink)}" target="_blank" rel="noopener" class="btn-primary-custom"><i class="bi bi-box-arrow-up-right"></i> Visit Project</a>` : ''}
              <a href="index.html#portfolio" class="btn-outline-custom"><i class="bi bi-arrow-left"></i> Back to Portfolio</a>
            </div>
          </div>
          <div class="col-lg-5">
            <img class="project-detail-image" src="${project.image || DEMO_IMAGE}" alt="${escapeAttr(project.title)}">
          </div>
        </div>
      </div>
    </section>

    <section class="section-padding">
      <div class="container">
        <div class="row g-4">
          <div class="col-lg-8">
            <div class="contact-card p-4 p-lg-5 h-100">
              <h2 class="fw-bold mb-3">Project Overview</h2>
              <p class="text-muted mb-4">${escapeHtml(project.description || '')}</p>
              <h3 class="h5 fw-bold mb-3">Technology Stack</h3>
              <div class="tech-line">${renderTechTags(project.technologies)}</div>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="contact-card p-4 h-100">
              <h2 class="h4 fw-bold mb-4">Project Info</h2>
              <ul class="list-unstyled mb-0 project-meta-list">
                <li><strong>Category</strong><span>${escapeHtml(project.category || '')}</span></li>
                <li><strong>Client</strong><span>${escapeHtml(project.client || '')}</span></li>
                <li><strong>Role</strong><span>${escapeHtml(project.role || '')}</span></li>
                <li><strong>Duration</strong><span>${escapeHtml(project.duration || '')}</span></li>
                <li><strong>Date</strong><span>${formatDate(project.projectDate)}</span></li>
              </ul>
            </div>
          </div>
        </div>

        ${related.length ? `
          <div class="mt-5 pt-4">
            <h2 class="fw-bold mb-4">Related Projects</h2>
            <div class="row g-4">${related.map(project => `
              <div class="col-md-6 col-xl-4">
                <article class="project-card">
                  <div class="project-image-wrap"><img src="${project.image || DEMO_IMAGE}" alt="${escapeAttr(project.title)}"></div>
                  <div class="project-card-body">
                    <span class="badge-soft d-inline-block mb-3">${escapeHtml(project.category || '')}</span>
                    <h3 class="h5 fw-bold">${escapeHtml(project.title)}</h3>
                    <p class="text-muted small">${escapeHtml(project.shortDescription || '')}</p>
                    <a class="btn btn-sm btn-outline-dark rounded-pill px-3" href="project-detail.html?slug=${encodeURIComponent(project.slug)}">View Details</a>
                  </div>
                </article>
              </div>
            `).join('')}</div>
          </div>
        ` : ''}
      </div>
    </section>
  `;
}

function setupNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  const toggle = () => navbar.classList.toggle('navbar-scrolled', window.scrollY > 20);
  toggle();
  window.addEventListener('scroll', toggle, { passive: true });
}

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function getInitials(name) {
  return String(name)
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part.charAt(0).toUpperCase())
    .join('') || 'C';
}

function showToast(message, type = 'success') {
  let toast = document.getElementById('global-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'global-toast';
    toast.className = 'position-fixed bottom-0 end-0 p-3';
    toast.style.zIndex = '1080';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <div class="alert alert-${type} rounded-4 shadow mb-0">${escapeHtml(message)}</div>
  `;
  setTimeout(() => { toast.innerHTML = ''; }, 3400);
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/`/g, '&#096;');
}
