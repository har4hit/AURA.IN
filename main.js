/* =============================================
   AURA.IN — script.js (v2)
   ============================================= */

/* === NAVBAR scroll === */
(function () {
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });
})();

/* === HAMBURGER menu === */
(function () {
  const btn = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');

  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    btn.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      btn.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();

/* === SMOOTH SCROLL === */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = 70;
      window.scrollTo({ top: target.getBoundingClientRect().top + scrollY - offset, behavior: 'smooth' });
    });
  });
})();

/* === SCROLL REVEAL (.reveal) === */
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => obs.observe(el));
})();

/* === ABOUT LINES stagger === */
(function () {
  const lines = document.querySelectorAll('.about-line');
  if (!lines.length) return;

  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      lines.forEach((line, i) => {
        line.style.transitionDelay = `${i * 0.12}s`;
        line.classList.add('in');
      });
      obs.disconnect();
    }
  }, { threshold: 0.15 });

  const section = document.getElementById('about');
  if (section) obs.observe(section);
})();

/* === SERVICE CARDS stagger === */
(function () {
  const cards = document.querySelectorAll('.service-card');
  if (!cards.length) return;

  cards.forEach(c => { c.style.opacity = '0'; c.style.transform = 'translateY(20px)'; c.style.transition = 'none'; });

  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      cards.forEach((c, i) => {
        setTimeout(() => {
          c.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
          c.style.opacity = '1';
          c.style.transform = 'none';
        }, i * 100);
      });
      obs.disconnect();
    }
  }, { threshold: 0.1 });

  obs.observe(cards[0].closest('section'));
})();

/* === FOUNDER CARD stagger === */
(function () {
  const founderCard = document.querySelector('.founder-card-layout');
  if (!founderCard) return;

  founderCard.style.opacity = '0';
  founderCard.style.transform = 'translateY(30px)';
  founderCard.style.transition = 'none';

  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      setTimeout(() => {
        founderCard.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.25s ease, box-shadow 0.25s ease';
        founderCard.style.opacity = '1';
        founderCard.style.transform = 'none';
      }, 100);
      obs.disconnect();
    }
  }, { threshold: 0.1 });

  obs.observe(founderCard.closest('section'));
})();

/* === PORTFOLIO ROWS stagger === */
(function () {
  const rows = document.querySelectorAll('.project-row');
  if (!rows.length) return;

  rows.forEach(r => { r.style.opacity = '0'; r.style.transition = 'none'; });

  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      rows.forEach((r, i) => {
        setTimeout(() => {
          r.style.transition = 'opacity 0.5s ease, padding 0.25s ease';
          r.style.opacity = '1';
        }, i * 80);
      });
      obs.disconnect();
    }
  }, { threshold: 0.05 });

  obs.observe(rows[0].closest('section'));
})();

/* === STAT COUNT-UP === */
(function () {
  const stats = document.querySelectorAll('.stat-number');
  if (!stats.length) return;

  function countUp(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const dur = 1400;
    const start = performance.now();

    function step(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      stats.forEach(countUp);
      obs.disconnect();
    }
  }, { threshold: 0.4 });

  const section = document.getElementById('stats');
  if (section) obs.observe(section);
})();

/* === CONTACT FORM === */
(function () {
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Sending...';
    btn.disabled = true;

    setTimeout(() => {
      form.reset();
      btn.textContent = 'Send Message →';
      btn.disabled = false;
      success.classList.add('show');
      setTimeout(() => success.classList.remove('show'), 5000);
    }, 1000);
  });
})();

/* === WAITLIST FORM === */
(function () {
  const btn = document.getElementById('waitlistBtn');
  const input = document.getElementById('waitlistEmail');
  const msg = document.getElementById('waitlistSuccess');
  if (!btn || !input) return;

  btn.addEventListener('click', () => {
    if (!input.value || !input.value.includes('@')) {
      input.style.borderColor = '#ef4444';
      setTimeout(() => input.style.borderColor = '', 1500);
      return;
    }
    btn.disabled = true;
    btn.classList.add('loading');
    setTimeout(() => {
      btn.classList.remove('loading');
      btn.innerHTML = '<span class="btn-text">Joined!</span>';
      input.value = '';
      msg.classList.add('show');
      setTimeout(() => {
        btn.innerHTML = '<span class="btn-text">Join &rarr;</span>';
        btn.disabled = false;
        msg.classList.remove('show');
      }, 4000);
    }, 800);
  });
})();



/* ====================================================
   GITHUB ACTIVITY WIDGET (simulated — replace org with real one)
   ==================================================== */
(function () {
  const commitContainer = document.getElementById('ghCommits');
  const graphContainer = document.getElementById('ghGraph');
  const countEl = document.getElementById('ghCommitCount');
  const repoEl = document.getElementById('ghRepoCount');
  const streakEl = document.getElementById('ghStreak');
  if (!commitContainer) return;

  // Realistic commit messages for a dev studio
  const fakeCommits = [
    { repo: 'HustleAI-app', msg: 'feat: add real-time heart rate sync via BLE', time: '2 min ago', sha: 'a3f8c21' },
    { repo: 'Mantra', msg: 'fix: enemy spawn rate overflow on level 9', time: '34 min ago', sha: 'b7e2d09' },
    { repo: 'FitckeckAI-ai', msg: 'perf: reduce LLM latency by 40% with response streaming', time: '1 hr ago', sha: 'c1d4e87' },
    { repo: 'Progresso', msg: 'feat: Stripe webhook handler for failed payments', time: '3 hr ago', sha: 'd9a1f33' },
    { repo: 'aura.in', msg: 'chore: update design tokens + add dark mode vars', time: '5 hr ago', sha: 'e2b6c14' },
    { repo: 'HustleAI-app', msg: 'test: add unit tests for nutrition API parser', time: '8 hr ago', sha: 'f4c8d92' },
    { repo: 'FitckeckAI-ai', msg: 'feat: multi-language output support (ES, FR, DE)', time: '1 day ago', sha: 'g3e7b05' },
    { repo: 'Mantra', msg: 'art: add procedural asteroid field shader', time: '1 day ago', sha: 'h6f1a28' },
  ];

  const svgCommit = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><line x1="3" y1="12" x2="9" y2="12"/><line x1="15" y1="12" x2="21" y2="12"/></svg>`;

  function renderCommits() {
    commitContainer.innerHTML = fakeCommits.map(c => `
      <div class="gh-commit-item">
        <div class="gh-commit-icon">${svgCommit}</div>
        <div class="gh-commit-body">
          <div class="gh-commit-msg">${c.msg}</div>
          <div class="gh-commit-meta">
            <span class="gh-commit-repo">${c.repo}</span>
            <span class="gh-commit-time">${c.time}</span>
            <span class="gh-commit-sha">${c.sha}</span>
          </div>
        </div>
      </div>
    `).join('');
  }

  function renderGraph() {
    const days = 26 * 7;
    const weights = [0, 0, 0, 1, 1, 2, 2, 3, 4]; // weighted random

    graphContainer.innerHTML = `
      <div class="gh-graph-title">Contribution Activity — Last 6 months</div>
      <div class="gh-graph-grid" id="ghCells"></div>
      <div class="gh-graph-legend">
        <span>Less</span>
        <div class="gh-legend-cell"></div>
        <div class="gh-legend-cell" data-level="1"></div>
        <div class="gh-legend-cell" data-level="2"></div>
        <div class="gh-legend-cell" data-level="3"></div>
        <div class="gh-legend-cell" data-level="4"></div>
        <span>More</span>
      </div>
    `;

    const grid = document.getElementById('ghCells');
    for (let i = 0; i < days; i++) {
      const level = weights[Math.floor(Math.random() * weights.length)];
      const cell = document.createElement('div');
      cell.className = 'gh-cell';
      if (level > 0) cell.setAttribute('data-level', level);
      cell.title = `${level} commits`;
      grid.appendChild(cell);
    }
  }

  function renderStats() {
    // Animate in with count-up
    function animateNum(el, target, suffix = '') {
      let start = 0;
      const dur = 1200;
      const t0 = performance.now();
      function step(now) {
        const p = Math.min((now - t0) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        animateNum(countEl, 47);
        animateNum(repoEl, 6);
        animateNum(streakEl, 23);
        obs.disconnect();
      }
    }, { threshold: 0.3 });

    const section = document.getElementById('github');
    if (section) obs.observe(section);
  }

  // Render on load
  renderCommits();
  renderGraph();
  renderStats();

  // Simulate live updates — new commit every 25s
  setInterval(() => {
    const newCommit = {
      repo: ['HustleAI-app', 'Mantra', 'FitckeckAI-ai', 'Progresso'][Math.floor(Math.random() * 4)],
      msg: [
        'fix: edge case in auth token refresh',
        'feat: add haptic feedback on swipe',
        'refactor: clean up dead code in parser',
        'perf: lazy load heavy components',
        'feat: new onboarding flow v2',
      ][Math.floor(Math.random() * 5)],
      time: 'just now',
      sha: Math.random().toString(36).substr(2, 7),
    };


    // Prepend new commit to the feed
    const htmlStr = `
      <div class="gh-commit-item new-item">
        <div class="gh-commit-icon">${svgCommit}</div>
        <div class="gh-commit-body">
          <div class="gh-commit-msg">${newCommit.msg}</div>
          <div class="gh-commit-meta">
            <span class="gh-commit-repo">${newCommit.repo}</span>
            <span class="gh-commit-time">${newCommit.time}</span>
            <span class="gh-commit-sha">${newCommit.sha}</span>
          </div>
        </div>
      </div>
    `;
    commitContainer.insertAdjacentHTML('afterbegin', htmlStr);

    // Remove last item to keep list same size
    if (commitContainer.children.length > 8) {
      commitContainer.removeChild(commitContainer.lastElementChild);
    }

    // Remove new-item class after animation finishes
    setTimeout(() => {
      if (commitContainer.firstElementChild) {
        commitContainer.firstElementChild.classList.remove('new-item');
      }
    }, 500);

    // Update countEl to simulate live activity
    const current = parseInt(countEl.textContent) || 47;
    countEl.textContent = current + 1;
    countEl.style.color = 'var(--accent-light)';
    setTimeout(() => { countEl.style.color = ''; }, 1000);

  }, 25000);
})();

/* === DYNAMIC COPYRIGHT YEAR === */
(function () {
  const footerEl = document.getElementById('copyYear');
  if (footerEl) {
    footerEl.innerHTML = '&copy; ' + new Date().getFullYear() + ' aura.in. All rights reserved.';
  }
})();

/* === COOKIE BANNER === */
(function () {
  const banner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookieAccept');
  const declineBtn = document.getElementById('cookieDecline');
  if (banner && !localStorage.getItem('cookie_consent')) {
    setTimeout(() => { banner.classList.add('show'); }, 2000);
  }
  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookie_consent', 'true');
      banner.classList.remove('show');
    });
  }
  if (declineBtn) {
    declineBtn.addEventListener('click', () => {
      localStorage.setItem('cookie_consent', 'false');
      banner.classList.remove('show');
    });
  }
})();

/* === PROJECT MODALS === */
(function () {
  const rows = document.querySelectorAll('.project-row');
  const overlay = document.getElementById('projectModal');
  const closeBtn = document.getElementById('modalClose');
  const modalBody = document.getElementById('modalBody');

  if (!overlay) return;

  rows.forEach(row => {
    row.addEventListener('click', (e) => {
      e.preventDefault();
      const title = row.querySelector('.project-text h3').textContent;
      const desc = row.querySelector('.project-text p').textContent;
      const techHTML = row.querySelector('.tech-badges').innerHTML;

      modalBody.innerHTML = `
        <h3>${title}</h3>
        <p>${desc}</p>
        <div style="margin-bottom: 24px;" class="tech-badges">${techHTML}</div>
        <p>This is a deeper dive into ${title}. Our case studies normally break down the challenges faced, technical architecture decisions, and iteration cycles. By optimizing core workflows and cutting latency, we shipped a seamless platform rapidly.</p>
        <a href="#" class="btn btn-primary" style="margin-top: 10px;">View Live Project &rarr;</a>
      `;
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
})();


