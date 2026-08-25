function toggleMenu() {
  const hbg = document.getElementById('hbg');
  const isOpen = hbg.classList.toggle('open');
  document.getElementById('mob-menu').classList.toggle('open', isOpen);
  hbg.setAttribute('aria-expanded', isOpen);
}

function closeMenu() {
  const hbg = document.getElementById('hbg');
  hbg.classList.remove('open');
  hbg.setAttribute('aria-expanded', 'false');
  document.getElementById('mob-menu').classList.remove('open');
}

document.addEventListener('click', e => {
  if (!e.target.closest('nav') && !e.target.closest('.mobile-menu')) closeMenu();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMenu();
});

function showTab(id, btn) {
  document.querySelectorAll('.menu-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => {
    b.classList.remove('active');
    b.setAttribute('aria-selected', 'false');
  });
  document.getElementById('tab-' + id).classList.add('active');
  btn.classList.add('active');
  btn.setAttribute('aria-selected', 'true');
}

/* Arrow-key navigation between tabs */
const tabRow = document.querySelector('.tab-row');
if (tabRow) {
  tabRow.addEventListener('keydown', e => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const tabs = Array.from(tabRow.querySelectorAll('.tab-btn'));
    const current = tabs.indexOf(document.activeElement);
    if (current === -1) return;
    e.preventDefault();
    const next = (current + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
    tabs[next].focus();
    tabs[next].click();
  });
}

const ro = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) { setTimeout(() => e.target.classList.add('visible'), i * 70); ro.unobserve(e.target); }
  });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(el => ro.observe(el));

/* NAV: condense + active-link scroll spy */
const navEl = document.getElementById('nav');
if (navEl) {
  const onScroll = () => navEl.classList.toggle('scrolled', window.scrollY > 10);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

const navLinks = document.querySelectorAll('.nav-links a[data-nav]');
if (navLinks.length) {
  const spySections = Array.from(navLinks)
    .map(a => document.getElementById(a.dataset.nav))
    .filter(Boolean);
  const spy = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => a.classList.toggle('active', a.dataset.nav === entry.target.id));
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  spySections.forEach(s => spy.observe(s));
}

/* LIVE OPEN/CLOSED STATUS — lunch 9-14, dinner 18-22, daily */
function fmtMins(mins) {
  const h = Math.floor(mins / 60), m = mins % 60;
  return `${h}:${String(m).padStart(2, '0')}`;
}

function updateStatus() {
  const dot = document.getElementById('status-dot');
  const text = document.getElementById('status-text');
  if (!dot || !text) return;

  const now = new Date();
  const mins = now.getHours() * 60 + now.getMinutes();
  const LUNCH_START = 9 * 60, LUNCH_END = 14 * 60, DINNER_START = 18 * 60, DINNER_END = 22 * 60;
  const isOpen = (mins >= LUNCH_START && mins < LUNCH_END) || (mins >= DINNER_START && mins < DINNER_END);

  let label;
  if (isOpen) {
    label = mins < LUNCH_END ? `Deschis · până la ${fmtMins(LUNCH_END)}` : `Deschis · până la ${fmtMins(DINNER_END)}`;
  } else if (mins < LUNCH_START) {
    label = `Deschidem la ${fmtMins(LUNCH_START)}`;
  } else if (mins < DINNER_START) {
    label = `Deschidem la ${fmtMins(DINNER_START)}`;
  } else {
    label = `Deschidem mâine la ${fmtMins(LUNCH_START)}`;
  }

  dot.classList.toggle('is-open', isOpen);
  dot.classList.toggle('is-closed', !isOpen);
  text.textContent = label;
}
updateStatus();
setInterval(updateStatus, 60000);
