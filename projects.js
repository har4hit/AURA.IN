/* =============================================
   AURA.IN — projects.js
   Opens a project as a full-screen detail page when its card is tapped.
   Content and markup live in projects-data.js.
   ============================================= */

(function () {
  const dialog = document.getElementById('projectDialog');
  const body = document.getElementById('pdBody');
  const closeBtn = document.getElementById('pdClose');
  if (!dialog || !body) return;

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let openId = null;
  let pushed = false;

  function render(id) {
    body.innerHTML = projectHTML(id);
    dialog.scrollTop = 0;
  }

  // Open: the page grows out of the tapped card's picture; close: it shrinks back into it.
  // State changes happen at once; the animation is only the picture of it, so rapid taps stay in order.
  let anim = null;
  let token = 0;
  function reveal(fromEl, reverse) {
    if (anim) anim.cancel();
    const r = fromEl && fromEl.getBoundingClientRect();
    const onScreen = r && r.bottom > 0 && r.top < innerHeight;
    const timing = { duration: reduceMotion ? 1 : 650, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', direction: reverse ? 'reverse' : 'normal' };
    anim = onScreen
      ? dialog.animate({ clipPath: [
          `inset(${r.top}px ${innerWidth - r.right}px ${innerHeight - r.bottom}px ${r.left}px round 20px)`,
          'inset(0px 0px 0px 0px round 0px)',
        ] }, timing)
      : dialog.animate({ opacity: [0, 1], transform: ['translateY(32px)', 'none'] }, timing);
    // never wait on frames that may not come (a background tab pauses animations)
    return Promise.race([anim.finished.catch(() => {}), new Promise(r => setTimeout(r, timing.duration + 100))]);
  }

  function open(id, card, push = true) {
    if (!PROJECTS[id]) return;
    token++;
    render(id);
    if (!dialog.open) dialog.showModal();
    document.documentElement.classList.add('pd-open');
    reveal(card && card.querySelector('.project-media') || card || document.querySelector(`.project[data-project="${id}"] .project-media`), false);
    if (push && openId === null) { history.pushState({ pd: id }, '', `#project/${id}`); pushed = true; }
    else history.replaceState({ pd: id }, '', `#project/${id}`);
    openId = id;
  }

  function close(fromHistory = false) {
    if (openId === null) return;
    const id = openId;
    openId = null;
    const mine = ++token;
    const card = document.querySelector(`.project[data-project="${id}"]`);
    reveal(card && card.querySelector('.project-media'), true).then(() => {
      if (mine !== token) return; // reopened meanwhile
      dialog.close();
      document.documentElement.classList.remove('pd-open');
    });
    // Back button closes a detail page we pushed; a deep link just drops its hash.
    if (!fromHistory) {
      if (pushed) history.back();
      else history.replaceState(null, '', location.pathname + location.search);
    }
    pushed = false;
  }

  document.querySelectorAll('[data-project]').forEach(card => {
    card.addEventListener('click', e => {
      if (!PROJECTS[card.dataset.project]) return; // the hero caption may point at #contact instead
      e.preventDefault();
      open(card.dataset.project, card);
    });
  });

  body.addEventListener('click', e => {
    const next = e.target.closest('[data-next]');
    if (!next) return;
    e.preventDefault();
    const id = next.dataset.next;
    render(id);
    body.animate({ opacity: [0, 1], transform: ['translateY(24px)', 'none'] }, { duration: reduceMotion ? 1 : 450, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
    history.replaceState({ pd: id }, '', `#project/${id}`);
    openId = id;
  });

  closeBtn.addEventListener('click', () => close());
  dialog.addEventListener('cancel', e => { e.preventDefault(); close(); }); // Esc
  dialog.addEventListener('click', e => { if (e.target === dialog) close(); });

  addEventListener('popstate', () => {
    const m = location.hash.match(/^#project\/(\w+)/);
    if (m && PROJECTS[m[1]]) open(m[1], null, false);
    else close(true);
  });

  // Deep link: /#project/erp opens straight into the detail page.
  const m = location.hash.match(/^#project\/(\w+)/);
  if (m && PROJECTS[m[1]]) open(m[1], null, false);
})();
