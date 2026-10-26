/* =============================================
   AURA.IN — projects-data.js
   The one place project content lives. It feeds the pop-up on the home page
   (projects.js) and the crawlable pages in /work.
   Edit here, then run: npm run build:pages
   ============================================= */

const PROJECTS = {
  erp: {
    seo: { title: 'Glass Factory ERP', type: 'SoftwareApplication', category: 'BusinessApplication', os: 'Web', description: 'Vishwakarma Tuff ERP by Aura: custom ERP for a glass factory: order pipeline, cutting, fabrication and toughening tracking, and automated invoicing.' },
    title: 'Vishwakarma Tuff ERP',
    logo: 'IMG/p-erp.webp',
    tile: 'black',
    summary: 'Order pipeline, production tracking and automated invoicing for a glass factory.',
    facts: { Type: 'Custom software', Year: '2026', Platform: 'Web app', Client: 'Vishwakarma Tuff Glass' },
    about: [
      'Vishwakarma Tuff Glass cuts, fabricates and toughens glass to order. The ERP tracks every order, and every sheet of glass in it, from the moment it is booked to the day it is dispatched.',
      'The owner opens one dashboard to see what was cut, fabricated and toughened today, which orders are running late, and which glass has been stuck in the process for more than 48 hours.',
    ],
    features: [
      'Order entry and a pipeline from booking to dispatch',
      'Daily totals for cutting, fabrication and toughening in square metres',
      'Alerts for delayed orders, rework, held glass and glass stuck over 48 hours',
      'Customer records, label printing and glass inventory',
      'Payment follow-ups and automated invoicing',
      'Reports by day, week or any date range',
    ],
    stack: ['JavaScript', 'Node.js', 'Supabase'],
    images: [
      { src: 'IMG/erp-dashboard.webp', w: 1250, h: 568, alt: 'ERP dashboard with today\'s orders and cutting, fabrication and toughening totals', caption: 'The owner\'s dashboard for today' },
    ],
    links: { github: 'https://github.com/har4hit' },
  },
  grow: {
    seo: { title: 'Fitness Tracker App', type: 'MobileApplication', category: 'HealthApplication', os: 'Android, iOS', description: 'Grow AI by Aura: a real-time fitness tracker app for iOS and Android with 50K downloads in its first 3 months.' },
    title: 'Grow AI',
    logo: 'IMG/p-grow.webp',
    tile: 'grey',
    summary: 'Real-time fitness tracker with 50K downloads in its first 3 months.',
    facts: { Type: 'Mobile app', Year: '2025', Platform: 'iOS and Android', Result: '50K downloads in 3 months' },
    about: [
      'Grow AI tracks workouts as they happen and turns them into daily progress people can see. It was built as one React Native app for iOS and Android, with a Supabase and Firebase backend.',
    ],
    features: [
      'Real-time workout tracking',
      'Daily and weekly progress',
      'One codebase for iOS and Android',
    ],
    stack: ['React Native', 'Supabase', 'Firebase'],
    images: [],
    links: { github: 'https://github.com/har4hit' },
  },
  mantra: {
    seo: { title: 'Indian Folklore Horror Game', type: 'VideoGame', category: 'GameApplication', os: '', description: 'Mantra by Aura: a horror game rooted in Indian folklore, built in Unity and featured on the App Store on launch day.' },
    title: 'Mantra',
    logo: 'IMG/p-mantra.webp',
    tile: 'cover',
    summary: 'Horror game rooted in Indian folklore, featured on the App Store on launch day.',
    facts: { Type: 'Game', Year: '2025', Engine: 'Unity', Result: 'Featured on the App Store on launch day' },
    about: [
      'Mantra is a horror game rooted in Indian folklore. It is built in Unity with C#, with Steamworks and PlayFab behind it for accounts and live updates.',
    ],
    features: [
      'Built in Unity for mobile and PC',
      'Steamworks integration',
      'PlayFab for player accounts and live updates',
    ],
    stack: ['Unity', 'C#', 'Steamworks', 'PlayFab'],
    images: [], // the key art is already the page's main picture; add gameplay screenshots here
    links: { github: 'https://github.com/har4hit' },
  },
  progresso: {
    seo: { title: 'Micro-finance App for Gen Z', type: 'SoftwareApplication', category: 'FinanceApplication', os: 'Web', description: 'Progresso by Aura: a micro-finance web app for Gen Z, built with Next.js and Stripe, that reached revenue in 60 days.' },
    title: 'Progresso',
    logo: 'IMG/p-progresso.webp',
    tile: 'black',
    summary: 'Micro-finance tool for Gen Z that went from zero to revenue in 60 days.',
    facts: { Type: 'Fintech app', Year: '2024', Platform: 'Web', Result: 'Revenue in 60 days' },
    about: [
      'Progresso helps young people manage small amounts of money: saving, tracking and paying. It went from first commit to paying users in 60 days.',
    ],
    features: [
      'Built with Next.js and TypeScript',
      'Payments through Stripe',
      'Accounts and data on Supabase',
    ],
    stack: ['TypeScript', 'Next.js', 'Supabase', 'Stripe'],
    images: [],
    links: { github: 'https://github.com/har4hit' },
  },
};

const escHTML = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// The detail markup, shared by the pop-up (heading 'h2', asset base '') and the /work pages ('h1', '../').
function projectHTML(id, { heading = 'h2', base = '', nextHref = n => '#project/' + n } = {}) {
  const p = PROJECTS[id];
  const ids = Object.keys(PROJECTS);
  const next = ids[(ids.indexOf(id) + 1) % ids.length];
  const esc = escHTML;
  const facts = Object.entries(p.facts).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('');
  const links = [
    p.links.live && `<a class="btn btn-dark" href="${esc(p.links.live)}" target="_blank" rel="noopener noreferrer">Visit the live site</a>`,
    p.links.store && `<a class="btn btn-dark" href="${esc(p.links.store)}" target="_blank" rel="noopener noreferrer">Get the app</a>`,
    p.links.github && `<a class="btn btn-outline-dark" href="${esc(p.links.github)}" target="_blank" rel="noopener noreferrer">View code on GitHub</a>`,
  ].filter(Boolean).join('');
  const gallery = p.images.length ? `
      <section class="pd-gallery">
        <h3>Screens</h3>
        ${p.images.map(i => `
          <figure>
            <img src="${esc(base + i.src)}" alt="${esc(i.alt)}" width="${i.w}" height="${i.h}" loading="lazy" />
            <figcaption>${esc(i.caption)}</figcaption>
          </figure>`).join('')}
      </section>` : '';
  return `
      <header class="pd-head">
        <div class="pd-media project-media tile-${p.tile}"><img src="${esc(base + p.logo)}" alt="${esc(p.title)} logo" width="800" height="800" /></div>
        <div class="pd-intro">
          <${heading} id="pdTitle">${esc(p.title)}</${heading}>
          <p class="pd-summary">${esc(p.summary)}</p>
          <dl class="pd-facts">${facts}</dl>
          <div class="btn-row">${links}</div>
        </div>
      </header>
      <section class="pd-about">
        <h3>What we built</h3>
        <div class="pd-about-text">
          ${p.about.map(t => `<p>${esc(t)}</p>`).join('')}
          <ul>${p.features.map(f => `<li>${esc(f)}</li>`).join('')}</ul>
          <p class="pd-stack">Built with ${esc(p.stack.join(', '))}</p>
        </div>
      </section>
      ${gallery}
      <a class="pd-next" href="${nextHref(next)}" data-next="${next}">
        <span>Next project</span>
        <strong>${esc(PROJECTS[next].title)}</strong>
      </a>`;
}

if (typeof module !== 'undefined') module.exports = { PROJECTS, projectHTML, escHTML };
