/* ============================================================
   John Bareño — Portafolio
   ============================================================ */
(function () {
  'use strict';

  var root = document.documentElement;

  /* ---------- Tema claro / oscuro ---------- */
  var themeBtn = document.getElementById('themeToggle');
  var themeMeta = document.querySelector('meta[name="theme-color"]');

  function paintMeta() {
    if (themeMeta) {
      themeMeta.setAttribute('content', root.classList.contains('light') ? '#f6f8fa' : '#04070d');
    }
  }

  paintMeta();

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var isLight = root.classList.toggle('light');
      try {
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
      } catch (e) { /* modo privado: el tema no persiste, pero el sitio funciona */ }
      paintMeta();
    });
  }

  /* ---------- Menú móvil ---------- */
  var navToggle = document.getElementById('navToggle');
  var mobileMenu = document.getElementById('mobileMenu');

  function setMenu(open) {
    if (!navToggle || !mobileMenu) return;
    mobileMenu.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    document.body.classList.toggle('nav-open', open);
  }

  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', function () {
      setMenu(navToggle.getAttribute('aria-expanded') !== 'true');
    });

    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setMenu(false);
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 860) setMenu(false);
    });
  }

  /* ---------- Aparición al hacer scroll ---------- */
  var reveals = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        setTimeout(function () { el.classList.add('visible'); }, 70 * i);
        revealObserver.unobserve(el);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(function (el) { revealObserver.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- Enlace activo en el nav ---------- */
  var sections = document.querySelectorAll('main section[id]');
  var navLinks = document.querySelectorAll('.nav-links a');

  if ('IntersectionObserver' in window && sections.length) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.getAttribute('id');
        navLinks.forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('href') === '#' + id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (s) { navObserver.observe(s); });
  }

  /* ---------- Barra de progreso + HUD de coordenadas ---------- */
  var progress = document.getElementById('scrollProgress');
  var hudCoords = document.getElementById('hudCoords');
  var hudZoom = document.getElementById('hudZoom');
  var ticking = false;

  // Bogotá D.C. — el HUD "recorre" un pequeño trayecto a medida que baja el usuario.
  var LAT0 = 4.7060, LAT1 = 4.6320;
  var LON0 = -74.0685, LON1 = -74.1240;

  function dms(value, positive, negative, degPad) {
    var hemi = value >= 0 ? positive : negative;
    var abs = Math.abs(value);
    var deg = Math.floor(abs);
    var minFloat = (abs - deg) * 60;
    var min = Math.floor(minFloat);
    var sec = Math.round((minFloat - min) * 60);

    if (sec === 60) { sec = 0; min += 1; }
    if (min === 60) { min = 0; deg += 1; }

    function pad(n, size) {
      var s = String(n);
      while (s.length < size) s = '0' + s;
      return s;
    }

    return pad(deg, degPad) + '°' + pad(min, 2) + '′' + pad(sec, 2) + '″' + hemi;
  }

  function update() {
    ticking = false;

    var scrollable = document.documentElement.scrollHeight - window.innerHeight;
    var ratio = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;

    if (progress) progress.style.width = (ratio * 100).toFixed(2) + '%';

    if (hudCoords) {
      var lat = LAT0 + (LAT1 - LAT0) * ratio;
      var lon = LON0 + (LON1 - LON0) * ratio;
      hudCoords.textContent = dms(lat, 'N', 'S', 2) + ' ' + dms(lon, 'E', 'W', 3);
    }

    if (hudZoom) {
      hudZoom.textContent = 'Z ' + (12 + ratio * 6).toFixed(1);
    }
  }

  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  }, { passive: true });

  window.addEventListener('resize', update);
  update();
})();
