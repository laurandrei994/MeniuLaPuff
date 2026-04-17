function toggleMenu() {
  document.getElementById('hbg').classList.toggle('open');
  document.getElementById('mob-menu').classList.toggle('open');
}

function closeMenu() {
  document.getElementById('hbg').classList.remove('open');
  document.getElementById('mob-menu').classList.remove('open');
}

document.addEventListener('click', e => {
  if (!e.target.closest('nav') && !e.target.closest('.mobile-menu')) closeMenu();
});

function showTab(id, btn) {
  document.querySelectorAll('.menu-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + id).classList.add('active');
  btn.classList.add('active');
}

const ro = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) { setTimeout(() => e.target.classList.add('visible'), i * 70); ro.unobserve(e.target); }
  });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(el => ro.observe(el));
