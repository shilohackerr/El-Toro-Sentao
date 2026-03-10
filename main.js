// ════════════════════════════════════════════════════════════
//  TORO SENTAO — JavaScript Principal
//  Maneja: navbar, partículas de brasas, menú,
//          slider de testimonios, scroll reveal y más
// ════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {

  // ─────────────────────────────────────────────────────────
  //  NAVBAR — scroll + hamburger
  // ─────────────────────────────────────────────────────────
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    document.getElementById('backTop').classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  // Cerrar menú al hacer click en un link
  navLinks.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ─────────────────────────────────────────────────────────
  //  BACK TO TOP
  // ─────────────────────────────────────────────────────────
  document.getElementById('backTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ─────────────────────────────────────────────────────────
  //  PARALLAX HERO
  // ─────────────────────────────────────────────────────────
  const heroBg = document.getElementById('heroBg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      if (window.scrollY < window.innerHeight) {
        heroBg.style.transform = `scale(1.05) translateY(${window.scrollY * 0.25}px)`;
      }
    }, { passive: true });
  }

  // ─────────────────────────────────────────────────────────
  //  PARTÍCULAS DE BRASAS (Canvas)
  // ─────────────────────────────────────────────────────────
  const canvas = document.getElementById('emberCanvas');
  const ctx    = canvas.getContext('2d');
  let W, H;

  const resize = () => {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  };
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const EMBER_COUNT = 55;
  const embers = [];

  function createEmber() {
    const x = Math.random() * W;
    return {
      x,
      y:      H + 10,
      vx:     (Math.random() - 0.5) * 0.8,
      vy:     -(Math.random() * 1.5 + 0.5),
      size:   Math.random() * 2.5 + 0.5,
      life:   1,
      decay:  Math.random() * 0.004 + 0.002,
      hue:    Math.random() > 0.5 ? 30 : 15,  // naranja o rojo
      twinkle: Math.random() * Math.PI * 2,
    };
  }

  for (let i = 0; i < EMBER_COUNT; i++) {
    const e = createEmber();
    e.y = Math.random() * H;
    e.life = Math.random();
    embers.push(e);
  }

  function drawEmbers() {
    ctx.clearRect(0, 0, W, H);
    embers.forEach(e => {
      e.twinkle += 0.06;
      const flicker = 0.7 + Math.sin(e.twinkle) * 0.3;
      const alpha   = e.life * flicker;

      ctx.beginPath();
      ctx.arc(e.x, e.y, e.size * flicker, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${e.hue}, 100%, ${55 + e.life * 30}%, ${alpha * 0.7})`;
      ctx.fill();

      // Glow
      const g = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.size * 4 * flicker);
      g.addColorStop(0, `hsla(${e.hue}, 100%, 70%, ${alpha * 0.25})`);
      g.addColorStop(1, `hsla(${e.hue}, 100%, 50%, 0)`);
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.size * 4, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();

      // Movimiento
      e.x   += e.vx + Math.sin(e.twinkle * 0.4) * 0.3;
      e.y   += e.vy;
      e.life -= e.decay;

      if (e.life <= 0 || e.y < -10) {
        Object.assign(e, createEmber());
      }
    });
    requestAnimationFrame(drawEmbers);
  }
  drawEmbers();

  // ─────────────────────────────────────────────────────────
  //  RENDERIZAR MENÚ
  // ─────────────────────────────────────────────────────────
  const menuGrid = document.getElementById('menuGrid');

  function renderMenu(filter = 'all') {
    const items = TORO_DATA.menu.filter(p =>
      p.disponible && (filter === 'all' || p.categoria === filter)
    );

    menuGrid.innerHTML = '';

    items.forEach((p, i) => {
      const card = document.createElement('article');
      card.className = 'menu-card reveal';
      card.setAttribute('data-cat', p.categoria);
      card.style.transitionDelay = `${i * 0.07}s`;
      card.innerHTML = `
        <div class="menu-card-img">
          <span>${p.emoji}</span>
          <div class="menu-card-tag">${p.etiqueta}</div>
        </div>
        <div class="menu-card-body">
          <h3 class="menu-card-title">${p.nombre}</h3>
          <p class="menu-card-desc">${p.descripcion}</p>
          <div class="menu-card-footer">
            <div class="menu-card-price">
              ${p.precio === 'Consultar'
                ? '<span>Precio:</span> Consultar'
                : `<span>B/.</span> ${p.precio}`}
            </div>
            <div class="menu-card-badge">${p.badge}</div>
          </div>
        </div>
      `;
      menuGrid.appendChild(card);
    });

    // Activar reveal para las tarjetas recién creadas
    setTimeout(() => observeReveal(), 50);
  }

  // Filtros
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderMenu(btn.dataset.filter);
    });
  });

  renderMenu();

  // ─────────────────────────────────────────────────────────
  //  SLIDER DE TESTIMONIOS
  // ─────────────────────────────────────────────────────────
  const track = document.getElementById('testimoniosTrack');
  const dotsContainer = document.getElementById('testimoniosDots');
  let currentSlide = 0;
  let autoSlideTimer;
  const perSlide = window.innerWidth < 768 ? 1 : 2;

  function renderTestimonios() {
    track.innerHTML = '';
    TORO_DATA.testimonios.forEach(t => {
      const stars = '⭐'.repeat(t.estrellas);
      const card = document.createElement('div');
      card.className = 'testi-card reveal';
      card.innerHTML = `
        <div class="testi-quote-icon">"</div>
        <div class="testi-stars">${stars}</div>
        <p class="testi-text">"${t.texto}"</p>
        <div class="testi-author">
          <div class="testi-avatar">${t.inicial}</div>
          <div>
            <div class="testi-name">${t.autor}</div>
            <div class="testi-location">📍 ${t.lugar}</div>
          </div>
        </div>
      `;
      track.appendChild(card);
    });

    // Dots
    const totalSlides = Math.ceil(TORO_DATA.testimonios.length / perSlide);
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('button');
      dot.className = `dot ${i === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  }

  function goTo(idx) {
    const totalSlides = Math.ceil(TORO_DATA.testimonios.length / perSlide);
    currentSlide = (idx + totalSlides) % totalSlides;
    const cardW = track.children[0]?.offsetWidth + 28 || 0;
    track.style.transform = `translateX(-${currentSlide * perSlide * cardW}px)`;
    document.querySelectorAll('.dot').forEach((d, i) =>
      d.classList.toggle('active', i === currentSlide)
    );
  }

  function startAutoSlide() {
    autoSlideTimer = setInterval(() => goTo(currentSlide + 1), 4500);
  }

  renderTestimonios();
  startAutoSlide();

  track.addEventListener('mouseenter', () => clearInterval(autoSlideTimer));
  track.addEventListener('mouseleave', () => startAutoSlide());

  // Swipe en móvil
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(diff > 0 ? currentSlide + 1 : currentSlide - 1);
  }, { passive: true });

  // ─────────────────────────────────────────────────────────
  //  SCROLL REVEAL (IntersectionObserver)
  // ─────────────────────────────────────────────────────────
  function observeReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal:not(.visible)').forEach(el => observer.observe(el));
  }

  observeReveal();

  // Marcar secciones grandes para reveal
  document.querySelectorAll(
    '.esencia-container, .menu-header, .testimonios-header, .ubicacion-info, .mapa-embed'
  ).forEach(el => el.classList.add('reveal'));

  setTimeout(observeReveal, 100);

  // ─────────────────────────────────────────────────────────
  //  ACTIVE NAV LINK según sección visible
  // ─────────────────────────────────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinkEls.forEach(link => {
          link.style.color = link.getAttribute('href') === `#${entry.target.id}`
            ? 'var(--gold-light)'
            : '';
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObserver.observe(s));

  // ─────────────────────────────────────────────────────────
  //  SMOOTH SCROLL para links internos
  // ─────────────────────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = navbar.offsetHeight + 16;
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.pageYOffset - offset,
          behavior: 'smooth',
        });
      }
    });
  });

  // ─────────────────────────────────────────────────────────
  //  ACTUALIZAR LINKS DE WHATSAPP con número real del config
  // ─────────────────────────────────────────────────────────
  const wa = TORO_DATA.config.whatsapp;
  document.querySelectorAll('[href*="wa.me"]').forEach(link => {
    const url = new URL(link.href);
    link.href = `https://wa.me/${wa}${url.search}`;
  });

  console.log('%c🐂 Toro Sentao — Sitio cargado correctamente', 'color:#C84B11;font-weight:bold;font-size:14px;');
  console.log('%cEdita js/data.js para actualizar el menú y testimonios.', 'color:#888;font-size:11px;');
});
