document.addEventListener('DOMContentLoaded', () => {
  setupLoginPage();
  setupDashboardPage();
});

function setupLoginPage() {
  const loginForm = document.getElementById('login-form');
  if (!loginForm) return;

  if (PortfolioStore.isLoggedIn()) {
    window.location.href = 'dashboard.html#overview';
    return;
  }

  loginForm.addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(loginForm);
    const email = String(formData.get('email') || '').trim();
    const password = String(formData.get('password') || '').trim();

    if (PortfolioStore.login(email, password)) {
      window.location.href = 'dashboard.html#overview';
    } else {
      showAdminNotice('Invalid email or password.', 'danger');
    }
  });
}

function setupDashboardPage() {
  if (!document.querySelector('[data-admin-dashboard]')) return;

  if (!PortfolioStore.isLoggedIn()) {
    window.location.href = 'login.html';
    return;
  }

  bindAdminNavigation();
  bindAdminForms();
  bindAdminActions();
  refreshAdminUI();
  showSectionFromHash();
}

function bindAdminNavigation() {
  document.querySelectorAll('[data-admin-link]').forEach(link => {
    link.addEventListener('click', () => {
      setTimeout(showSectionFromHash, 0);
      document.getElementById('admin-sidebar')?.classList.remove('show');
    });
  });

  window.addEventListener('hashchange', showSectionFromHash);

  document.getElementById('mobile-admin-toggle')?.addEventListener('click', () => {
    document.getElementById('admin-sidebar')?.classList.toggle('show');
  });

  document.getElementById('logout-btn')?.addEventListener('click', () => {
    PortfolioStore.logout();
    window.location.href = 'login.html';
  });
}

function showSectionFromHash() {
  const hash = (window.location.hash || '#overview').replace('#', '');
  const section = document.getElementById(`section-${hash}`) || document.getElementById('section-overview');

  document.querySelectorAll('.admin-section').forEach(item => item.classList.remove('active'));
  section.classList.add('active');

  document.querySelectorAll('[data-admin-link]').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${hash}`);
  });

  const titleMap = {
    overview: 'Dashboard Overview',
    site: 'Site Settings',
    about: 'About Me Management',
    stats: 'Stats Management',
    services: 'Services Management',
    skills: 'Skills Management',
    experience: 'Experience Management',
    projects: 'Project Management',
    testimonials: 'Testimonials Management',
    socials: 'Social Links Management',
    'contact-info': 'Contact Information',
    messages: 'Contact Messages',
    tools: 'Backup & Data Tools'
  };
  const pageTitle = document.getElementById('admin-page-title');
  if (pageTitle) pageTitle.textContent = titleMap[hash] || 'Dashboard Overview';
}

function bindAdminForms() {
  bindSiteForm();
  bindAboutForm();
  bindStatForm();
  bindServiceForm();
  bindSkillForm();
  bindExperienceForm();
  bindProjectForm();
  bindTestimonialForm();
  bindSocialForm();
  bindContactInfoForm();
}

function bindAdminActions() {
  document.getElementById('profile-image-file')?.addEventListener('change', event => {
    readFileAsDataUrl(event.target.files[0]).then(dataUrl => {
      if (!dataUrl) return;
      document.getElementById('about-profile-existing').value = dataUrl;
      document.getElementById('about-profile-preview').src = dataUrl;
    });
  });

  document.getElementById('project-image-file')?.addEventListener('change', event => {
    readFileAsDataUrl(event.target.files[0]).then(dataUrl => {
      if (!dataUrl) return;
      document.getElementById('project-image-existing').value = dataUrl;
      const preview = document.getElementById('project-image-preview');
      preview.src = dataUrl;
      preview.classList.remove('d-none');
    });
  });

  document.getElementById('export-data-btn')?.addEventListener('click', exportPortfolioData);
  document.getElementById('import-data-file')?.addEventListener('change', importPortfolioData);
  document.getElementById('reset-demo-data-btn')?.addEventListener('click', () => {
    if (!confirm('This will reset all portfolio demo data. Continue?')) return;
    PortfolioStore.resetDemoData();
    refreshAdminUI();
    showAdminNotice('Demo data reset successfully.', 'success');
  });
}

function refreshAdminUI() {
  applyAdminTheme();
  renderDashboardStats();
  loadSiteForm();
  loadAboutForm();
  renderStatsTable();
  renderServicesTable();
  renderSkillsTable();
  renderExperienceTable();
  renderProjectsTable();
  renderTestimonialsTable();
  renderSocialsTable();
  loadContactInfoForm();
  renderMessages();
}

function applyAdminTheme() {
  const site = PortfolioStore.getSite();
  document.documentElement.style.setProperty('--primary', site.primaryColor || '#4f46e5');
  document.documentElement.style.setProperty('--secondary', site.secondaryColor || '#06b6d4');
}

function renderDashboardStats() {
  const wrapper = document.getElementById('dashboard-stats');
  if (!wrapper) return;

  const projects = PortfolioStore.getProjects();
  const skills = PortfolioStore.getSkills();
  const services = PortfolioStore.getServices();
  const testimonials = PortfolioStore.getTestimonials();
  const messages = PortfolioStore.getMessages();

  const stats = [
    { label: 'Total Projects', value: projects.length, icon: 'bi-folder2-open' },
    { label: 'Published Projects', value: projects.filter(p => p.status === 'published').length, icon: 'bi-check-circle' },
    { label: 'Total Skills', value: skills.length, icon: 'bi-bar-chart' },
    { label: 'Services', value: services.length, icon: 'bi-briefcase' },
    { label: 'Testimonials', value: testimonials.length, icon: 'bi-chat-quote' },
    { label: 'Unread Messages', value: messages.filter(m => m.status === 'unread').length, icon: 'bi-envelope' }
  ];

  wrapper.innerHTML = stats.map(stat => `
    <div class="col-sm-6 col-xl-4 col-xxl-2">
      <div class="admin-card h-100 compact-card">
        <div class="mini-icon mb-3"><i class="bi ${stat.icon}"></i></div>
        <div class="h2 fw-black mb-0">${stat.value}</div>
        <div class="text-muted fw-semibold small">${stat.label}</div>
      </div>
    </div>
  `).join('');
}

function bindSiteForm() {
  const form = document.getElementById('site-form');
  if (!form) return;
  form.addEventListener('submit', event => {
    event.preventDefault();
    PortfolioStore.saveSite({
      brandName: valueOf('site-brand-name'),
      logoText: valueOf('site-logo-text'),
      tagline: valueOf('site-tagline'),
      primaryColor: valueOf('site-primary-color') || '#4f46e5',
      secondaryColor: valueOf('site-secondary-color') || '#06b6d4',
      darkModeHero: document.getElementById('site-dark-hero').checked
    });
    refreshAdminUI();
    showAdminNotice('Site settings saved successfully.', 'success');
  });
}

function loadSiteForm() {
  const form = document.getElementById('site-form');
  if (!form) return;
  const site = PortfolioStore.getSite();
  setValue('site-brand-name', site.brandName);
  setValue('site-logo-text', site.logoText);
  setValue('site-tagline', site.tagline);
  setValue('site-primary-color', site.primaryColor || '#4f46e5');
  setValue('site-secondary-color', site.secondaryColor || '#06b6d4');
  document.getElementById('site-dark-hero').checked = Boolean(site.darkModeHero);
}

function bindAboutForm() {
  const form = document.getElementById('about-form');
  if (!form) return;
  form.addEventListener('submit', event => {
    event.preventDefault();
    PortfolioStore.saveAbout({
      name: valueOf('about-name'),
      title: valueOf('about-title-input'),
      intro: valueOf('about-intro'),
      description: valueOf('about-description-input'),
      experience: valueOf('about-experience-input'),
      availability: valueOf('about-availability-input'),
      location: valueOf('about-location-input'),
      profileImage: valueOf('about-profile-existing') || PROFILE_IMAGE
    });
    refreshAdminUI();
    showAdminNotice('About content saved successfully.', 'success');
  });
}

function loadAboutForm() {
  const form = document.getElementById('about-form');
  if (!form) return;
  const about = PortfolioStore.getAbout();
  setValue('about-name', about.name);
  setValue('about-title-input', about.title);
  setValue('about-intro', about.intro);
  setValue('about-description-input', about.description);
  setValue('about-experience-input', about.experience);
  setValue('about-availability-input', about.availability);
  setValue('about-location-input', about.location);
  setValue('about-profile-existing', about.profileImage);
  document.getElementById('about-profile-preview').src = about.profileImage || PROFILE_IMAGE;
}

function bindStatForm() {
  const form = document.getElementById('stat-form');
  if (!form) return;
  form.addEventListener('submit', event => {
    event.preventDefault();
    const stats = PortfolioStore.getStats();
    const id = valueOf('stat-id') || makeId('stat');
    const data = {
      id,
      label: valueOf('stat-label'),
      value: valueOf('stat-value'),
      icon: valueOf('stat-icon') || 'bi-stars'
    };
    saveById(stats, id, data);
    PortfolioStore.saveStats(stats);
    resetStatForm();
    refreshAdminUI();
    showAdminNotice('Stat saved successfully.', 'success');
  });
}

function renderStatsTable() {
  const table = document.getElementById('stats-table');
  if (!table) return;
  const stats = PortfolioStore.getStats();
  table.innerHTML = stats.length ? stats.map(stat => `
    <tr>
      <td><i class="bi ${escapeHtml(stat.icon || 'bi-stars')}"></i></td>
      <td><strong>${escapeHtml(stat.value)}</strong></td>
      <td>${escapeHtml(stat.label)}</td>
      <td class="text-end">${actionButtons('Stat', stat.id)}</td>
    </tr>
  `).join('') : emptyRow(4, 'No stats found.');
}

function editStat(id) {
  const stat = PortfolioStore.getStats().find(item => item.id === id);
  if (!stat) return;
  setValue('stat-id', stat.id);
  setValue('stat-label', stat.label);
  setValue('stat-value', stat.value);
  setValue('stat-icon', stat.icon);
  focusField('stat-label');
}

function deleteStat(id) {
  if (!confirm('Delete this stat?')) return;
  PortfolioStore.saveStats(PortfolioStore.getStats().filter(item => item.id !== id));
  refreshAdminUI();
  showAdminNotice('Stat deleted successfully.', 'success');
}

function resetStatForm() {
  document.getElementById('stat-form')?.reset();
  setValue('stat-id', '');
}

function bindServiceForm() {
  const form = document.getElementById('service-form');
  if (!form) return;
  form.addEventListener('submit', event => {
    event.preventDefault();
    const services = PortfolioStore.getServices();
    const id = valueOf('service-id') || makeId('service');
    const data = {
      id,
      title: valueOf('service-title'),
      icon: valueOf('service-icon') || 'bi-stars',
      description: valueOf('service-description'),
      order: Number(valueOf('service-order')) || services.length + 1
    };
    saveById(services, id, data);
    PortfolioStore.saveServices(services);
    resetServiceForm();
    refreshAdminUI();
    showAdminNotice('Service saved successfully.', 'success');
  });
}

function renderServicesTable() {
  const table = document.getElementById('services-table');
  if (!table) return;
  const services = [...PortfolioStore.getServices()].sort((a, b) => Number(a.order || 0) - Number(b.order || 0));
  table.innerHTML = services.length ? services.map(service => `
    <tr>
      <td>${escapeHtml(service.order || '')}</td>
      <td><i class="bi ${escapeHtml(service.icon || 'bi-stars')}"></i></td>
      <td><strong>${escapeHtml(service.title)}</strong><br><small class="text-muted">${escapeHtml(service.description || '').slice(0, 110)}</small></td>
      <td class="text-end">${actionButtons('Service', service.id)}</td>
    </tr>
  `).join('') : emptyRow(4, 'No services found.');
}

function editService(id) {
  const service = PortfolioStore.getServices().find(item => item.id === id);
  if (!service) return;
  setValue('service-id', service.id);
  setValue('service-title', service.title);
  setValue('service-icon', service.icon);
  setValue('service-description', service.description);
  setValue('service-order', service.order);
  focusField('service-title');
}

function deleteService(id) {
  if (!confirm('Delete this service?')) return;
  PortfolioStore.saveServices(PortfolioStore.getServices().filter(item => item.id !== id));
  refreshAdminUI();
  showAdminNotice('Service deleted successfully.', 'success');
}

function resetServiceForm() {
  document.getElementById('service-form')?.reset();
  setValue('service-id', '');
}

function bindSkillForm() {
  const form = document.getElementById('skill-form');
  if (!form) return;
  form.addEventListener('submit', event => {
    event.preventDefault();
    const skills = PortfolioStore.getSkills();
    const id = valueOf('skill-id') || makeId('skill');
    const data = {
      id,
      name: valueOf('skill-name'),
      category: valueOf('skill-category') || 'General',
      level: Math.min(100, Math.max(0, Number(valueOf('skill-level')) || 0)),
      icon: valueOf('skill-icon') || 'bi-stars',
      description: valueOf('skill-description')
    };
    saveById(skills, id, data);
    PortfolioStore.saveSkills(skills);
    resetSkillForm();
    refreshAdminUI();
    showAdminNotice('Skill saved successfully.', 'success');
  });
}

function renderSkillsTable() {
  const table = document.getElementById('skills-table');
  if (!table) return;
  const skills = PortfolioStore.getSkills();
  table.innerHTML = skills.length ? skills.map(skill => `
    <tr>
      <td><i class="bi ${escapeHtml(skill.icon || 'bi-stars')}"></i></td>
      <td><strong>${escapeHtml(skill.name)}</strong><br><small class="text-muted">${escapeHtml(skill.description || '').slice(0, 100)}</small></td>
      <td>${escapeHtml(skill.category || '')}</td>
      <td><div class="admin-progress"><span style="width:${Number(skill.level) || 0}%"></span></div><small>${Number(skill.level) || 0}%</small></td>
      <td class="text-end">${actionButtons('Skill', skill.id)}</td>
    </tr>
  `).join('') : emptyRow(5, 'No skills found.');
}

function editSkill(id) {
  const skill = PortfolioStore.getSkills().find(item => item.id === id);
  if (!skill) return;
  setValue('skill-id', skill.id);
  setValue('skill-name', skill.name);
  setValue('skill-category', skill.category);
  setValue('skill-level', skill.level);
  setValue('skill-icon', skill.icon);
  setValue('skill-description', skill.description);
  focusField('skill-name');
}

function deleteSkill(id) {
  if (!confirm('Delete this skill?')) return;
  PortfolioStore.saveSkills(PortfolioStore.getSkills().filter(skill => skill.id !== id));
  refreshAdminUI();
  showAdminNotice('Skill deleted successfully.', 'success');
}

function resetSkillForm() {
  document.getElementById('skill-form')?.reset();
  setValue('skill-id', '');
}

function bindExperienceForm() {
  const form = document.getElementById('experience-form');
  if (!form) return;
  form.addEventListener('submit', event => {
    event.preventDefault();
    const experiences = PortfolioStore.getExperiences();
    const id = valueOf('experience-id') || makeId('exp');
    const data = {
      id,
      role: valueOf('experience-role'),
      company: valueOf('experience-company'),
      start: valueOf('experience-start'),
      end: valueOf('experience-end'),
      description: valueOf('experience-description')
    };
    saveById(experiences, id, data);
    PortfolioStore.saveExperiences(experiences);
    resetExperienceForm();
    refreshAdminUI();
    showAdminNotice('Experience saved successfully.', 'success');
  });
}

function renderExperienceTable() {
  const table = document.getElementById('experience-table');
  if (!table) return;
  const experiences = PortfolioStore.getExperiences();
  table.innerHTML = experiences.length ? experiences.map(item => `
    <tr>
      <td><strong>${escapeHtml(item.role)}</strong><br><small class="text-muted">${escapeHtml(item.company || '')}</small></td>
      <td>${escapeHtml(item.start || '')} - ${escapeHtml(item.end || '')}</td>
      <td>${escapeHtml(item.description || '').slice(0, 120)}</td>
      <td class="text-end">${actionButtons('Experience', item.id)}</td>
    </tr>
  `).join('') : emptyRow(4, 'No experience items found.');
}

function editExperience(id) {
  const item = PortfolioStore.getExperiences().find(row => row.id === id);
  if (!item) return;
  setValue('experience-id', item.id);
  setValue('experience-role', item.role);
  setValue('experience-company', item.company);
  setValue('experience-start', item.start);
  setValue('experience-end', item.end);
  setValue('experience-description', item.description);
  focusField('experience-role');
}

function deleteExperience(id) {
  if (!confirm('Delete this experience item?')) return;
  PortfolioStore.saveExperiences(PortfolioStore.getExperiences().filter(item => item.id !== id));
  refreshAdminUI();
  showAdminNotice('Experience deleted successfully.', 'success');
}

function resetExperienceForm() {
  document.getElementById('experience-form')?.reset();
  setValue('experience-id', '');
}

function bindProjectForm() {
  const form = document.getElementById('project-form');
  if (!form) return;
  form.addEventListener('submit', event => {
    event.preventDefault();
    const projects = PortfolioStore.getProjects();
    const id = valueOf('project-id') || makeId('project');
    const existing = projects.find(p => p.id === id);
    const title = valueOf('project-title');
    const now = new Date().toISOString();
    const data = {
      id,
      title,
      slug: slugify(title),
      category: valueOf('project-category'),
      projectDate: valueOf('project-date'),
      projectLink: valueOf('project-link'),
      client: valueOf('project-client'),
      role: valueOf('project-role'),
      duration: valueOf('project-duration'),
      featured: document.getElementById('project-featured').checked,
      status: valueOf('project-status') || 'published',
      shortDescription: valueOf('project-short-description'),
      description: valueOf('project-description'),
      technologies: valueOf('project-technologies'),
      image: valueOf('project-image-existing') || DEMO_IMAGE,
      createdAt: existing?.createdAt || now,
      updatedAt: now
    };
    saveById(projects, id, data, true);
    PortfolioStore.saveProjects(projects);
    resetProjectForm();
    refreshAdminUI();
    showAdminNotice('Project saved successfully.', 'success');
  });
}

function renderProjectsTable() {
  const table = document.getElementById('projects-table');
  if (!table) return;
  const projects = PortfolioStore.getProjects();
  table.innerHTML = projects.length ? projects.map(project => `
    <tr>
      <td><img src="${project.image || DEMO_IMAGE}" alt="${escapeAttr(project.title)}"></td>
      <td><strong>${escapeHtml(project.title)}</strong><br><small class="text-muted">${escapeHtml(project.slug || '')}</small></td>
      <td>${escapeHtml(project.category || '')}</td>
      <td><span class="badge ${project.status === 'published' ? 'text-bg-success' : 'text-bg-secondary'} rounded-pill">${escapeHtml(project.status || '')}</span>${project.featured ? '<br><span class="badge text-bg-warning rounded-pill mt-1">Featured</span>' : ''}</td>
      <td>${formatAdminDate(project.projectDate)}</td>
      <td class="text-end">${actionButtons('Project', project.id)}</td>
    </tr>
  `).join('') : emptyRow(6, 'No projects found.');
}

function editProject(id) {
  const project = PortfolioStore.getProjects().find(item => item.id === id);
  if (!project) return;
  setValue('project-id', project.id);
  setValue('project-title', project.title);
  setValue('project-category', project.category);
  setValue('project-date', project.projectDate);
  setValue('project-link', project.projectLink);
  setValue('project-client', project.client);
  setValue('project-role', project.role);
  setValue('project-duration', project.duration);
  document.getElementById('project-featured').checked = Boolean(project.featured);
  setValue('project-status', project.status || 'published');
  setValue('project-short-description', project.shortDescription);
  setValue('project-description', project.description);
  setValue('project-technologies', project.technologies);
  setValue('project-image-existing', project.image);
  const preview = document.getElementById('project-image-preview');
  preview.src = project.image || DEMO_IMAGE;
  preview.classList.remove('d-none');
  focusField('project-title');
}

function deleteProject(id) {
  if (!confirm('Are you sure you want to delete this project?')) return;
  PortfolioStore.saveProjects(PortfolioStore.getProjects().filter(project => project.id !== id));
  refreshAdminUI();
  showAdminNotice('Project deleted successfully.', 'success');
}

function resetProjectForm() {
  document.getElementById('project-form')?.reset();
  setValue('project-id', '');
  setValue('project-image-existing', '');
  document.getElementById('project-image-preview')?.classList.add('d-none');
}

function bindTestimonialForm() {
  const form = document.getElementById('testimonial-form');
  if (!form) return;
  form.addEventListener('submit', event => {
    event.preventDefault();
    const testimonials = PortfolioStore.getTestimonials();
    const id = valueOf('testimonial-id') || makeId('testimonial');
    const data = {
      id,
      name: valueOf('testimonial-name'),
      role: valueOf('testimonial-role'),
      rating: Math.min(5, Math.max(1, Number(valueOf('testimonial-rating')) || 5)),
      message: valueOf('testimonial-message')
    };
    saveById(testimonials, id, data);
    PortfolioStore.saveTestimonials(testimonials);
    resetTestimonialForm();
    refreshAdminUI();
    showAdminNotice('Testimonial saved successfully.', 'success');
  });
}

function renderTestimonialsTable() {
  const table = document.getElementById('testimonials-table');
  if (!table) return;
  const testimonials = PortfolioStore.getTestimonials();
  table.innerHTML = testimonials.length ? testimonials.map(item => `
    <tr>
      <td><strong>${escapeHtml(item.name)}</strong><br><small class="text-muted">${escapeHtml(item.role || '')}</small></td>
      <td>${'★'.repeat(Number(item.rating) || 5)}</td>
      <td>${escapeHtml(item.message || '').slice(0, 130)}</td>
      <td class="text-end">${actionButtons('Testimonial', item.id)}</td>
    </tr>
  `).join('') : emptyRow(4, 'No testimonials found.');
}

function editTestimonial(id) {
  const item = PortfolioStore.getTestimonials().find(row => row.id === id);
  if (!item) return;
  setValue('testimonial-id', item.id);
  setValue('testimonial-name', item.name);
  setValue('testimonial-role', item.role);
  setValue('testimonial-rating', item.rating);
  setValue('testimonial-message', item.message);
  focusField('testimonial-name');
}

function deleteTestimonial(id) {
  if (!confirm('Delete this testimonial?')) return;
  PortfolioStore.saveTestimonials(PortfolioStore.getTestimonials().filter(item => item.id !== id));
  refreshAdminUI();
  showAdminNotice('Testimonial deleted successfully.', 'success');
}

function resetTestimonialForm() {
  document.getElementById('testimonial-form')?.reset();
  setValue('testimonial-id', '');
}

function bindSocialForm() {
  const form = document.getElementById('social-form');
  if (!form) return;
  form.addEventListener('submit', event => {
    event.preventDefault();
    const socials = PortfolioStore.getSocials();
    const id = valueOf('social-id') || makeId('social');
    const data = {
      id,
      platform: valueOf('social-platform'),
      url: valueOf('social-url'),
      icon: valueOf('social-icon') || 'bi-link-45deg'
    };
    saveById(socials, id, data);
    PortfolioStore.saveSocials(socials);
    resetSocialForm();
    refreshAdminUI();
    showAdminNotice('Social link saved successfully.', 'success');
  });
}

function renderSocialsTable() {
  const table = document.getElementById('socials-table');
  if (!table) return;
  const socials = PortfolioStore.getSocials();
  table.innerHTML = socials.length ? socials.map(social => `
    <tr>
      <td><i class="bi ${escapeHtml(social.icon || 'bi-link-45deg')}"></i></td>
      <td><strong>${escapeHtml(social.platform)}</strong></td>
      <td><a href="${escapeAttr(social.url)}" target="_blank" rel="noopener">${escapeHtml(social.url)}</a></td>
      <td class="text-end">${actionButtons('Social', social.id)}</td>
    </tr>
  `).join('') : emptyRow(4, 'No social links found.');
}

function editSocial(id) {
  const social = PortfolioStore.getSocials().find(item => item.id === id);
  if (!social) return;
  setValue('social-id', social.id);
  setValue('social-platform', social.platform);
  setValue('social-url', social.url);
  setValue('social-icon', social.icon);
  focusField('social-platform');
}

function deleteSocial(id) {
  if (!confirm('Delete this social link?')) return;
  PortfolioStore.saveSocials(PortfolioStore.getSocials().filter(social => social.id !== id));
  refreshAdminUI();
  showAdminNotice('Social link deleted successfully.', 'success');
}

function resetSocialForm() {
  document.getElementById('social-form')?.reset();
  setValue('social-id', '');
}

function bindContactInfoForm() {
  const form = document.getElementById('contact-info-form');
  if (!form) return;
  form.addEventListener('submit', event => {
    event.preventDefault();
    PortfolioStore.saveContactInfo({
      email: valueOf('contact-email-input'),
      phone: valueOf('contact-phone-input'),
      address: valueOf('contact-address-input'),
      whatsapp: valueOf('contact-whatsapp-input'),
      location: valueOf('contact-location-input')
    });
    refreshAdminUI();
    showAdminNotice('Contact information saved successfully.', 'success');
  });
}

function loadContactInfoForm() {
  const form = document.getElementById('contact-info-form');
  if (!form) return;
  const contact = PortfolioStore.getContactInfo();
  setValue('contact-email-input', contact.email);
  setValue('contact-phone-input', contact.phone);
  setValue('contact-address-input', contact.address);
  setValue('contact-whatsapp-input', contact.whatsapp);
  setValue('contact-location-input', contact.location);
}

function renderMessages() {
  const wrapper = document.getElementById('messages-wrapper');
  if (!wrapper) return;
  const messages = PortfolioStore.getMessages();

  if (!messages.length) {
    wrapper.innerHTML = `<div class="alert alert-info rounded-4">No contact messages yet.</div>`;
    return;
  }

  wrapper.innerHTML = messages.map(message => `
    <article class="message-card ${message.status === 'unread' ? 'unread' : ''}">
      <div class="d-flex justify-content-between gap-3 flex-wrap">
        <div>
          <h3 class="h5 fw-bold mb-1">${escapeHtml(message.subject || 'No subject')}</h3>
          <p class="small text-muted mb-2">From ${escapeHtml(message.name)} • ${escapeHtml(message.email)} • ${formatAdminDate(message.createdAt)}</p>
        </div>
        <span class="badge ${message.status === 'unread' ? 'text-bg-warning' : 'text-bg-success'} rounded-pill align-self-start">${escapeHtml(message.status || '')}</span>
      </div>
      <p class="text-muted mb-3">${escapeHtml(message.message || '')}</p>
      <div class="d-flex gap-2 flex-wrap">
        <a class="btn btn-sm btn-outline-primary rounded-pill" href="mailto:${escapeAttr(message.email)}">Reply</a>
        <button class="btn btn-sm btn-outline-success rounded-pill" onclick="toggleMessageStatus('${message.id}')">Mark ${message.status === 'unread' ? 'Read' : 'Unread'}</button>
        <button class="btn btn-sm btn-outline-danger rounded-pill" onclick="deleteMessage('${message.id}')">Delete</button>
      </div>
    </article>
  `).join('');
}

function toggleMessageStatus(id) {
  const messages = PortfolioStore.getMessages();
  const message = messages.find(item => item.id === id);
  if (!message) return;
  message.status = message.status === 'unread' ? 'read' : 'unread';
  PortfolioStore.saveMessages(messages);
  refreshAdminUI();
}

function deleteMessage(id) {
  if (!confirm('Delete this message?')) return;
  PortfolioStore.saveMessages(PortfolioStore.getMessages().filter(message => message.id !== id));
  refreshAdminUI();
  showAdminNotice('Message deleted successfully.', 'success');
}

function exportPortfolioData() {
  const data = PortfolioStore.exportAll();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showAdminNotice('Backup exported successfully.', 'success');
}

function importPortfolioData(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      PortfolioStore.importAll(data);
      refreshAdminUI();
      showAdminNotice('Backup imported successfully.', 'success');
    } catch (error) {
      showAdminNotice(error.message || 'Could not import backup file.', 'danger');
    } finally {
      event.target.value = '';
    }
  };
  reader.readAsText(file);
}

function readFileAsDataUrl(file) {
  return new Promise(resolve => {
    if (!file) return resolve('');
    if (!file.type.startsWith('image/')) {
      showAdminNotice('Please select a valid image file.', 'danger');
      return resolve('');
    }
    if (file.size > 900 * 1024) {
      showAdminNotice('Use an image under 900KB for localStorage demo stability.', 'warning');
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}

function saveById(collection, id, data, insertFirst = false) {
  const index = collection.findIndex(item => item.id === id);
  if (index >= 0) collection[index] = data;
  else if (insertFirst) collection.unshift(data);
  else collection.push(data);
}

function valueOf(id) {
  return String(document.getElementById(id)?.value || '').trim();
}

function setValue(id, value) {
  const element = document.getElementById(id);
  if (element) element.value = value || '';
}

function focusField(id) {
  document.getElementById(id)?.focus();
}

function actionButtons(name, id) {
  return `
    <button class="btn btn-sm btn-outline-primary rounded-pill" onclick="edit${name}('${id}')"><i class="bi bi-pencil"></i></button>
    <button class="btn btn-sm btn-outline-danger rounded-pill" onclick="delete${name}('${id}')"><i class="bi bi-trash"></i></button>
  `;
}

function emptyRow(cols, text) {
  return `<tr><td colspan="${cols}" class="text-center text-muted py-4">${escapeHtml(text)}</td></tr>`;
}

function formatAdminDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function showAdminNotice(message, type = 'success') {
  let notice = document.getElementById('admin-notice');
  if (!notice) {
    notice = document.createElement('div');
    notice.id = 'admin-notice';
    notice.className = 'position-fixed top-0 end-0 p-3';
    notice.style.zIndex = '1080';
    document.body.appendChild(notice);
  }
  notice.innerHTML = `<div class="alert alert-${type} rounded-4 shadow mb-0">${escapeHtml(message)}</div>`;
  setTimeout(() => { notice.innerHTML = ''; }, 3600);
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
