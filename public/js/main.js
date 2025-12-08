/* Main site interactions:
   - Loader in, then hide
   - Exit overlay transitions on link clicks
   - Scroll reveal + parallax
   - Ripple micro-interactions
*/
const q = (s, r=document) => r.querySelector(s);
const qa = (s, r=document) => [...r.querySelectorAll(s)];

window.addEventListener('DOMContentLoaded', () => {
  // Loader
  const loader = q('#loader');
  setTimeout(() => loader?.classList.add('hidden'), 500);

  // Year
  const y = q('#year'); if (y) y.textContent = new Date().getFullYear();

  // Exit overlay for page transitions
  const exitOverlay = q('#exitOverlay');
  qa('a.link-exit').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href) return;
      e.preventDefault();
      exitOverlay.classList.add('active');
      setTimeout(() => { window.location.href = href; }, 450);
    });
  });

  // Reveal on scroll
  const io = new IntersectionObserver((entries) => {
    entries.forEach(ent => {
      if (ent.isIntersecting) ent.target.classList.add('visible');
    });
  }, { threshold: 0.14 });
  qa('.reveal').forEach(el => io.observe(el));

  // Parallax on hero image
  const parallaxEl = q('.parallax');
  window.addEventListener('scroll', () => {
    const y = window.scrollY * 0.12;
    if (parallaxEl) parallaxEl.style.setProperty('--parallax-y', `${y}px`);
  });

  // Hero tilt on pointer move
  const heroCard = q('.hero-card');
  const heroFigure = q('.hero-figure');
  if (heroCard && heroFigure){
    const resetTilt = () => {
      heroFigure.style.setProperty('--tilt-x', '0deg');
      heroFigure.style.setProperty('--tilt-y', '0deg');
    };
    heroCard.addEventListener('pointermove', (e) => {
      const rect = heroCard.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;
      const maxTilt = 8;
      heroFigure.style.setProperty('--tilt-x', `${relX * maxTilt}deg`);
      heroFigure.style.setProperty('--tilt-y', `${-relY * maxTilt}deg`);
    });
    heroCard.addEventListener('pointerleave', resetTilt);
    heroCard.addEventListener('pointerup', resetTilt);
  }

  // Ripple effects
  const rippleTargets = [...qa('.btn'), ...qa('.card')];
  rippleTargets.forEach(el => {
    el.addEventListener('pointerdown', (e) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty('--rx', `${e.clientX - rect.left}px`);
      el.style.setProperty('--ry', `${e.clientY - rect.top}px`);
      el.style.setProperty('--rsize', `${Math.max(rect.width, rect.height)}px`);
      el.classList.remove('rippling');
      void el.offsetWidth; // reflow
      el.classList.add('rippling');
      el.style.setProperty('--rsize','140px');
      el.style.setProperty('--rx',`${e.clientX-rect.left}px`);
      el.style.setProperty('--ry',`${e.clientY-rect.top}px`);
      el.style.setProperty('--rsize','140px');
      el.style.setProperty('--rcol','#fff');
      el.style.cssText += `--rx:${e.clientX-rect.left}px;--ry:${e.clientY-rect.top}px`;
      el.addEventListener('animationend', ()=> el.classList.remove('rippling'), {once:true});
    });
  });
});
