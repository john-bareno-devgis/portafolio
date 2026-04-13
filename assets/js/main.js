// Scroll reveal
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, 80 * i);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });
reveals.forEach(el => observer.observe(el));

// Smooth scroll para links del nav
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href === '#') return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

// Formulario de contacto (conecta con tu backend o servicio de email)
function handleSubmit(btn) {
  const form = btn.closest('.contact-form');
  const inputs = form.querySelectorAll('.form-input');
  let valid = true;
  inputs.forEach(inp => {
    if (!inp.value.trim()) {
      inp.style.borderColor = 'rgba(255,80,80,0.5)';
      valid = false;
    } else {
      inp.style.borderColor = '';
    }
  });
  if (!valid) return;

  btn.textContent = 'Enviando...';
  btn.disabled = true;

  // Aquí puedes conectar con un servicio como Formspree, EmailJS, etc.
  // Ejemplo con Formspree: fetch('https://formspree.io/f/YOUR_ID', { method: 'POST', ... })
  setTimeout(() => {
    btn.textContent = '¡Mensaje enviado! ✓';
    btn.style.background = '#0f6e56';
    btn.style.color = '#e8edf5';
  }, 1200);
}

// Navbar activo según sección
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.getAttribute('id');
  });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current ? 'var(--accent)' : '';
  });
});

// Theme toggle
const toggle = document.getElementById('themeToggle');
const html = document.documentElement;
const saved = localStorage.getItem('theme');

toggle.addEventListener('click', () => {
  const isLight = html.classList.toggle('light');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
});
