/* Dynamic Portfolio Website Storage Layer
   Pure HTML, CSS, JavaScript, Bootstrap version.
   Data is stored in browser localStorage for demo/local usage.
*/

const STORAGE_KEYS = {
  site: 'dp_site',
  about: 'dp_about',
  stats: 'dp_stats',
  skills: 'dp_skills',
  services: 'dp_services',
  experiences: 'dp_experiences',
  projects: 'dp_projects',
  testimonials: 'dp_testimonials',
  socials: 'dp_socials',
  contactInfo: 'dp_contact_info',
  messages: 'dp_messages',
  auth: 'dp_auth'
};

const DEMO_IMAGE = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1100" viewBox="0 0 1600 1100">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0f172a"/>
      <stop offset="0.48" stop-color="#4f46e5"/>
      <stop offset="1" stop-color="#06b6d4"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="28" stdDeviation="30" flood-color="#020617" flood-opacity="0.25"/>
    </filter>
  </defs>
  <rect width="1600" height="1100" rx="60" fill="url(#g)"/>
  <circle cx="1270" cy="190" r="250" fill="#ffffff" opacity="0.14"/>
  <circle cx="220" cy="940" r="320" fill="#ffffff" opacity="0.10"/>
  <rect x="190" y="170" width="1220" height="760" rx="44" fill="rgba(255,255,255,0.16)" stroke="rgba(255,255,255,0.42)" filter="url(#shadow)"/>
  <rect x="290" y="300" width="1020" height="92" rx="24" fill="rgba(255,255,255,0.22)"/>
  <rect x="290" y="450" width="520" height="310" rx="30" fill="rgba(255,255,255,0.18)"/>
  <rect x="860" y="450" width="450" height="130" rx="30" fill="rgba(255,255,255,0.24)"/>
  <rect x="860" y="630" width="450" height="130" rx="30" fill="rgba(255,255,255,0.15)"/>
  <text x="800" y="365" text-anchor="middle" fill="#ffffff" font-family="Arial" font-size="58" font-weight="800">Portfolio Project</text>
  <text x="800" y="825" text-anchor="middle" fill="#dffbff" font-family="Arial" font-size="30">Modern case study preview</text>
</svg>`)}`;

const PROFILE_IMAGE = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1000" viewBox="0 0 1000 1000">
  <defs>
    <linearGradient id="p" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0f172a"/>
      <stop offset="0.56" stop-color="#4f46e5"/>
      <stop offset="1" stop-color="#06b6d4"/>
    </linearGradient>
  </defs>
  <rect width="1000" height="1000" rx="72" fill="url(#p)"/>
  <circle cx="780" cy="160" r="180" fill="#fff" opacity="0.12"/>
  <circle cx="210" cy="810" r="250" fill="#fff" opacity="0.10"/>
  <circle cx="500" cy="360" r="145" fill="#ffffff" opacity="0.94"/>
  <path d="M250 835c38-170 153-260 250-260s212 90 250 260" fill="#ffffff" opacity="0.94"/>
  <text x="500" y="930" text-anchor="middle" fill="#dffbff" font-family="Arial" font-size="42" font-weight="700">Your Profile</text>
</svg>`)}`;

function makeId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || makeId('project');
}

function getData(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    console.error('Storage read error:', error);
    return fallback;
  }
}

function setData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

const DEFAULT_DATA = {
  site: {
    brandName: 'Alex Morgan',
    logoText: 'AM Portfolio',
    tagline: 'Modern portfolio website with dynamic admin control.',
    primaryColor: '#4f46e5',
    secondaryColor: '#06b6d4',
    darkModeHero: true
  },
  about: {
    name: 'Alex Morgan',
    title: 'Creative Web Designer & Frontend Developer',
    intro: 'I create clean, fast, and conversion-focused digital experiences for brands, startups, and small businesses.',
    description: 'I design and build modern portfolio websites, business websites, landing pages, and frontend interfaces. My work focuses on clean design, smooth responsiveness, fast loading, SEO-friendly structure, and easy content control from the admin panel.',
    experience: '5+ Years Experience',
    availability: 'Available for freelance and remote projects',
    location: 'Dhaka, Bangladesh',
    profileImage: PROFILE_IMAGE
  },
  stats: [
    { id: 'stat_years', label: 'Years Experience', value: '5+', icon: 'bi-award' },
    { id: 'stat_projects', label: 'Projects Completed', value: '80+', icon: 'bi-kanban' },
    { id: 'stat_clients', label: 'Happy Clients', value: '45+', icon: 'bi-people' },
    { id: 'stat_response', label: 'Responsive Focus', value: '100%', icon: 'bi-phone' }
  ],
  skills: [
    { id: makeId('skill'), name: 'HTML5', category: 'Frontend', level: 96, icon: 'bi-filetype-html', description: 'Semantic structure, landing pages, portfolio sections, and SEO-friendly HTML layouts.' },
    { id: makeId('skill'), name: 'CSS3', category: 'Frontend', level: 94, icon: 'bi-filetype-css', description: 'Modern layouts, animation, glass cards, grid, flexbox, and responsive styling.' },
    { id: makeId('skill'), name: 'JavaScript ES6', category: 'Frontend', level: 88, icon: 'bi-lightning-charge', description: 'Dynamic rendering, filters, forms, localStorage, and interactive UI logic.' },
    { id: makeId('skill'), name: 'Bootstrap 5', category: 'Frontend', level: 92, icon: 'bi-bootstrap', description: 'Responsive components, grids, forms, utility classes, and clean UI systems.' },
    { id: makeId('skill'), name: 'Responsive Design', category: 'UI/UX', level: 95, icon: 'bi-phone-flip', description: 'Desktop, tablet, and mobile layouts with retina-ready visual scaling.' },
    { id: makeId('skill'), name: 'UI/UX Design', category: 'UI/UX', level: 86, icon: 'bi-palette', description: 'Modern interface design, spacing, visual hierarchy, and user-friendly sections.' },
    { id: makeId('skill'), name: 'Figma', category: 'Design', level: 82, icon: 'bi-vector-pen', description: 'Wireframes, clean visual systems, layout planning, and design handoff.' },
    { id: makeId('skill'), name: 'WordPress', category: 'CMS', level: 84, icon: 'bi-wordpress', description: 'Portfolio, business websites, custom pages, plugins, and content structure.' },
    { id: makeId('skill'), name: 'Elementor', category: 'CMS', level: 88, icon: 'bi-window-sidebar', description: 'Custom landing pages, dynamic sections, responsive controls, and templates.' },
    { id: makeId('skill'), name: 'PHP Basics', category: 'Backend', level: 68, icon: 'bi-filetype-php', description: 'Basic server-side structure, forms, and CMS customization understanding.' },
    { id: makeId('skill'), name: 'SEO Structure', category: 'Marketing', level: 80, icon: 'bi-graph-up-arrow', description: 'Headings, meta flow, page structure, fast loading, and keyword-focused layout.' },
    { id: makeId('skill'), name: 'Git & GitHub', category: 'Tools', level: 74, icon: 'bi-github', description: 'Version control, project backup, code organization, and deployment workflow.' },
    { id: makeId('skill'), name: 'Admin Dashboard', category: 'Dashboard', level: 86, icon: 'bi-speedometer2', description: 'CRUD panels, forms, tables, image previews, and content management logic.' },
    { id: makeId('skill'), name: 'Performance Optimization', category: 'Frontend', level: 78, icon: 'bi-speedometer', description: 'Cleaner code, optimized visual structure, lightweight scripts, and smooth loading.' }
  ],
  services: [
    { id: makeId('service'), title: 'Portfolio Website Design', icon: 'bi-person-workspace', description: 'Modern personal portfolio websites with hero, about, skills, project showcase, contact form, and admin-managed content.', order: 1 },
    { id: makeId('service'), title: 'Business Website Design', icon: 'bi-building', description: 'Clean and professional websites for service businesses, agencies, consultants, and startups with strong conversion flow.', order: 2 },
    { id: makeId('service'), title: 'Landing Page Design', icon: 'bi-layout-text-window-reverse', description: 'Fast, focused, and mobile-friendly landing pages built for leads, product launches, campaigns, and service promotions.', order: 3 },
    { id: makeId('service'), title: 'Frontend Development', icon: 'bi-code-square', description: 'Responsive HTML, CSS, Bootstrap, and JavaScript frontend development with dynamic sections and polished interactions.', order: 4 },
    { id: makeId('service'), title: 'WordPress & Elementor', icon: 'bi-wordpress', description: 'Editable WordPress pages, Elementor layouts, service sections, contact areas, and conversion-focused page structures.', order: 5 },
    { id: makeId('service'), title: 'Admin Panel Setup', icon: 'bi-sliders', description: 'Simple dashboard systems to add, edit, delete, and manage website content without touching the code.', order: 6 }
  ],
  experiences: [
    { id: makeId('exp'), role: 'Frontend Developer', company: 'Freelance Projects', start: '2023', end: 'Present', description: 'Building responsive websites, portfolios, landing pages, and admin-driven static systems for small businesses and personal brands.' },
    { id: makeId('exp'), role: 'Web Designer', company: 'Remote Clients', start: '2021', end: '2023', description: 'Designed clean interfaces, service pages, portfolio sections, and visual layouts focused on clarity, speed, and user trust.' },
    { id: makeId('exp'), role: 'UI Content Designer', company: 'Creative Projects', start: '2020', end: '2021', description: 'Worked on page structure, content blocks, visual hierarchy, and mobile-friendly layouts for digital projects.' }
  ],
  projects: [
    {
      id: makeId('project'),
      title: 'Business Portfolio Website',
      slug: 'business-portfolio-website',
      category: 'Web Design',
      projectDate: '2026-04-20',
      projectLink: 'https://example.com',
      client: 'Personal Brand',
      role: 'Design & Frontend',
      duration: '7 Days',
      featured: true,
      status: 'published',
      shortDescription: 'A clean personal portfolio for a service professional with dynamic content sections.',
      description: 'This project includes a modern homepage, project showcase, about section, skill cards, service blocks, contact section, and mobile responsive layout. It was designed to improve personal branding, client trust, and lead generation.',
      technologies: 'HTML, CSS, JavaScript, Bootstrap, localStorage',
      image: DEMO_IMAGE,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: makeId('project'),
      title: 'Agency Landing Page',
      slug: 'agency-landing-page',
      category: 'Landing Page',
      projectDate: '2026-03-15',
      projectLink: 'https://example.com',
      client: 'Digital Agency',
      role: 'Frontend Development',
      duration: '5 Days',
      featured: true,
      status: 'published',
      shortDescription: 'A conversion-focused landing page for a digital agency.',
      description: 'This landing page was built with a strong hero section, service cards, process blocks, testimonial layout, and direct contact flow. The layout focuses on clarity, trust, and lead generation.',
      technologies: 'Bootstrap, JavaScript, SEO Structure',
      image: DEMO_IMAGE,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: makeId('project'),
      title: 'Ecommerce Product Showcase',
      slug: 'ecommerce-product-showcase',
      category: 'Ecommerce',
      projectDate: '2026-02-10',
      projectLink: 'https://example.com',
      client: 'Online Store',
      role: 'UI & Frontend',
      duration: '6 Days',
      featured: false,
      status: 'published',
      shortDescription: 'A product-focused design for an online store.',
      description: 'This project shows a clean product grid, product detail style section, strong CTA buttons, responsive card layout, and simple content management flow for ecommerce users.',
      technologies: 'HTML, Bootstrap, Responsive UI',
      image: DEMO_IMAGE,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: makeId('project'),
      title: 'Admin Dashboard System',
      slug: 'admin-dashboard-system',
      category: 'Dashboard',
      projectDate: '2026-01-18',
      projectLink: 'https://example.com',
      client: 'Internal Tool',
      role: 'JavaScript Logic',
      duration: '8 Days',
      featured: true,
      status: 'published',
      shortDescription: 'A simple admin dashboard for managing website content.',
      description: 'This dashboard supports login, projects, skills, services, testimonials, contact messages, site settings, image preview, import, export, and reset actions using browser localStorage.',
      technologies: 'JavaScript, localStorage, Bootstrap, HTML Forms',
      image: DEMO_IMAGE,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  testimonials: [
    { id: makeId('testimonial'), name: 'Sabrina Rahman', role: 'Startup Founder', rating: 5, message: 'The portfolio website looks premium, loads fast, and the admin panel makes content updates very easy.' },
    { id: makeId('testimonial'), name: 'Daniel Carter', role: 'Agency Owner', rating: 5, message: 'Clean design, responsive layout, and a strong project presentation. Exactly what I needed for client work.' },
    { id: makeId('testimonial'), name: 'Nadia Islam', role: 'Freelancer', rating: 5, message: 'The site feels modern and professional. I can update projects, skills, and testimonials without editing code.' }
  ],
  socials: [
    { id: makeId('social'), platform: 'Facebook', url: 'https://facebook.com', icon: 'bi-facebook' },
    { id: makeId('social'), platform: 'LinkedIn', url: 'https://linkedin.com', icon: 'bi-linkedin' },
    { id: makeId('social'), platform: 'GitHub', url: 'https://github.com', icon: 'bi-github' },
    { id: makeId('social'), platform: 'Behance', url: 'https://behance.net', icon: 'bi-behance' },
    { id: makeId('social'), platform: 'Dribbble', url: 'https://dribbble.com', icon: 'bi-dribbble' }
  ],
  contactInfo: {
    email: 'hello@example.com',
    phone: '+880 1234 567890',
    address: 'Dhaka, Bangladesh',
    whatsapp: '+8801234567890',
    location: 'Available for remote and local projects'
  },
  messages: []
};

function seedIfMissing(key, value) {
  if (!localStorage.getItem(key)) setData(key, value);
}

function mergeArrayDefaults(key, defaults, uniqueField) {
  const current = getData(key, []);
  if (!Array.isArray(current) || !current.length) {
    setData(key, defaults);
    return;
  }
  const currentValues = new Set(current.map(item => String(item[uniqueField] || '').toLowerCase()));
  const additions = defaults.filter(item => !currentValues.has(String(item[uniqueField] || '').toLowerCase()));
  if (additions.length) setData(key, [...current, ...additions]);
}

function seedPortfolioData() {
  seedIfMissing(STORAGE_KEYS.site, DEFAULT_DATA.site);
  seedIfMissing(STORAGE_KEYS.about, DEFAULT_DATA.about);
  seedIfMissing(STORAGE_KEYS.stats, DEFAULT_DATA.stats);
  seedIfMissing(STORAGE_KEYS.projects, DEFAULT_DATA.projects);
  seedIfMissing(STORAGE_KEYS.socials, DEFAULT_DATA.socials);
  seedIfMissing(STORAGE_KEYS.contactInfo, DEFAULT_DATA.contactInfo);
  seedIfMissing(STORAGE_KEYS.messages, DEFAULT_DATA.messages);

  mergeArrayDefaults(STORAGE_KEYS.skills, DEFAULT_DATA.skills, 'name');
  mergeArrayDefaults(STORAGE_KEYS.services, DEFAULT_DATA.services, 'title');
  mergeArrayDefaults(STORAGE_KEYS.experiences, DEFAULT_DATA.experiences, 'role');
  mergeArrayDefaults(STORAGE_KEYS.testimonials, DEFAULT_DATA.testimonials, 'name');
}

seedPortfolioData();

const PortfolioStore = {
  keys: STORAGE_KEYS,

  getSite() { return getData(STORAGE_KEYS.site, DEFAULT_DATA.site); },
  saveSite(data) { setData(STORAGE_KEYS.site, data); },

  getAbout() { return getData(STORAGE_KEYS.about, DEFAULT_DATA.about); },
  saveAbout(data) { setData(STORAGE_KEYS.about, data); },

  getStats() { return getData(STORAGE_KEYS.stats, []); },
  saveStats(data) { setData(STORAGE_KEYS.stats, data); },

  getSkills() { return getData(STORAGE_KEYS.skills, []); },
  saveSkills(data) { setData(STORAGE_KEYS.skills, data); },

  getServices() { return getData(STORAGE_KEYS.services, []); },
  saveServices(data) { setData(STORAGE_KEYS.services, data); },

  getExperiences() { return getData(STORAGE_KEYS.experiences, []); },
  saveExperiences(data) { setData(STORAGE_KEYS.experiences, data); },

  getProjects() { return getData(STORAGE_KEYS.projects, []); },
  saveProjects(data) { setData(STORAGE_KEYS.projects, data); },

  getPublishedProjects() {
    return this.getProjects().filter(project => project.status === 'published');
  },

  getTestimonials() { return getData(STORAGE_KEYS.testimonials, []); },
  saveTestimonials(data) { setData(STORAGE_KEYS.testimonials, data); },

  getSocials() { return getData(STORAGE_KEYS.socials, []); },
  saveSocials(data) { setData(STORAGE_KEYS.socials, data); },

  getContactInfo() { return getData(STORAGE_KEYS.contactInfo, DEFAULT_DATA.contactInfo); },
  saveContactInfo(data) { setData(STORAGE_KEYS.contactInfo, data); },

  getMessages() { return getData(STORAGE_KEYS.messages, []); },
  saveMessages(data) { setData(STORAGE_KEYS.messages, data); },

  addMessage(message) {
    const messages = this.getMessages();
    messages.unshift({
      id: makeId('msg'),
      ...message,
      status: 'unread',
      createdAt: new Date().toISOString()
    });
    this.saveMessages(messages);
  },

  exportAll() {
    return {
      version: '2.0.0',
      exportedAt: new Date().toISOString(),
      site: this.getSite(),
      about: this.getAbout(),
      stats: this.getStats(),
      skills: this.getSkills(),
      services: this.getServices(),
      experiences: this.getExperiences(),
      projects: this.getProjects(),
      testimonials: this.getTestimonials(),
      socials: this.getSocials(),
      contactInfo: this.getContactInfo(),
      messages: this.getMessages()
    };
  },

  importAll(data) {
    if (!data || typeof data !== 'object') throw new Error('Invalid import file.');
    const importKeys = ['site', 'about', 'stats', 'skills', 'services', 'experiences', 'projects', 'testimonials', 'socials', 'contactInfo', 'messages'];
    importKeys.forEach(key => {
      if (key in data) setData(STORAGE_KEYS[key], data[key]);
    });
  },

  resetDemoData() {
    Object.values(STORAGE_KEYS).forEach(key => {
      if (key !== STORAGE_KEYS.auth) localStorage.removeItem(key);
    });
    seedPortfolioData();
  },

  login(email, password) {
    if (email === 'admin@example.com' && password === 'admin123') {
      setData(STORAGE_KEYS.auth, {
        loggedIn: true,
        email,
        loggedAt: new Date().toISOString()
      });
      return true;
    }
    return false;
  },

  logout() {
    localStorage.removeItem(STORAGE_KEYS.auth);
  },

  isLoggedIn() {
    const auth = getData(STORAGE_KEYS.auth, null);
    return Boolean(auth && auth.loggedIn);
  }
};
