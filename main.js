/* ========================================
   YATTA DOJO CLUBE — Interações
   ======================================== */

(function () {
  'use strict';

  /* ---------- Ano automático no footer ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Header com scroll ---------- */
  const header = document.getElementById('header');
  const onScroll = () => {
    if (window.scrollY > 50) header.classList.add('header--scrolled');
    else header.classList.remove('header--scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Menu mobile ---------- */
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');
  const navLinks = nav.querySelectorAll('.nav__link');

  const toggleMenu = () => {
    const isOpen = nav.classList.toggle('nav--open');
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  hamburger.addEventListener('click', toggleMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (nav.classList.contains('nav--open')) toggleMenu();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('nav--open')) toggleMenu();
  });

  /* ---------- Scroll suave ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#' || href.length < 2) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('is-visible'), i * 80);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- Parallax no hero ---------- */
  const heroVideo = document.querySelector('.hero__video');
  if (heroVideo && window.matchMedia('(min-width: 720px)').matches) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y < window.innerHeight) {
        heroVideo.style.transform = `translateY(${y * 0.4}px)`;
      }
    }, { passive: true });
  }

  /* ---------- Mapa (Leaflet + OpenStreetMap) ---------- */
  const mapEl = document.getElementById('map');
  if (mapEl && typeof L !== 'undefined') {
    // Coordenadas: Adventure Mall, Vila Velha/ES
    const yatta = [-20.34115, -40.28572];

    const map = L.map('map', { scrollWheelZoom: false }).setView(yatta, 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // Marcador dourado (combina com a logo)
    const goldIcon = L.divIcon({
      className: '',
      html: `<div style="
        width:36px;height:36px;background:#D4A017;
        border:3px solid #1F2A37;border-radius:50% 50% 50% 0;
        transform:rotate(-45deg);
        box-shadow:0 4px 12px rgba(0,0,0,0.4);
      "><div style="width:10px;height:10px;background:#1F2A37;border-radius:50%;margin:10px auto 0;transform:rotate(45deg);"></div></div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 36],
      popupAnchor: [0, -36],
    });

    L.marker(yatta, { icon: goldIcon })
      .addTo(map)
      .bindPopup('<strong style="font-family:Bebas Neue;letter-spacing:1px;font-size:16px;color:#1F2A37;">Yatta Dojo Clube</strong><br/><span style="font-size:13px;color:#4B5563;">Vila Velha/ES</span>');

    // Habilita zoom só com clique (evita conflito com scroll da página)
    map.on('click', () => map.scrollWheelZoom.enable());
  }

})();
