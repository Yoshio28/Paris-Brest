(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* Video del hero: fuente según orientación, autoplay muted en loop */
  var video = document.getElementById('hero-video');
  if (video) {
    var portrait = window.matchMedia('(max-aspect-ratio: 4/5)').matches;
    if (portrait) video.poster = video.dataset.posterPortrait;
    var add = function (src, type) { var s = document.createElement('source'); s.src = src; s.type = type; video.appendChild(s); };
    if (portrait) { add(video.dataset.srcPortraitWebm, 'video/webm'); add(video.dataset.srcPortrait, 'video/mp4'); }
    else { add(video.dataset.srcLandscapeWebm, 'video/webm'); add(video.dataset.srcLandscape, 'video/mp4'); }
    video.muted = true;
    if (reduce.matches) {
      video.removeAttribute('autoplay');                 // el poster queda como imagen fija
    } else {
      video.load();
      var p = video.play(); if (p && p.catch) p.catch(function () {});
      // pausa fuera de pantalla para ahorrar batería
      new IntersectionObserver(function (e) {
        if (e[0].isIntersecting) { var q = video.play(); if (q && q.catch) q.catch(function () {}); } else video.pause();
      }).observe(video);
    }
  }

  /* Nav: sombra al hacer scroll + menú móvil */
  var nav = document.getElementById('nav');
  var toggle = document.getElementById('nav-toggle');
  var links = document.getElementById('nav-links');
  var fab = document.querySelector('.fab');
  var onScroll = function () {
    var y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 8);
    if (fab) fab.classList.toggle('is-visible', y > window.innerHeight * 0.6);
  };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  var setMenu = function (open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    links.classList.toggle('is-open', open);
  };
  toggle.addEventListener('click', function () { setMenu(toggle.getAttribute('aria-expanded') !== 'true'); });
  links.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  /* Tabs de la carta (accesibles con flechas) */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));
  var select = function (tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab, panel = document.getElementById(t.getAttribute('aria-controls'));
      t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; t.classList.toggle('is-active', on);
      panel.hidden = !on; panel.classList.toggle('is-active', on);
    });
    if (focus) tab.focus();
  };
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { select(t); });
    t.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); select(tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length], true); }
    });
  });
  // enlaces a #postres / #panaderia activan su pestaña
  document.querySelectorAll('a[href="#postres"],a[href="#panaderia"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      select(document.querySelector('[aria-controls="' + a.getAttribute('href').slice(1) + '"]'));
      document.getElementById('carta').scrollIntoView({ behavior: reduce.matches ? 'auto' : 'smooth' });
    });
  });

  /* Revelado al entrar en viewport */
  var revealEls = document.querySelectorAll('.reveal');
  if (reduce.matches || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* SMIL del mapa se detiene con reduced motion */
  var mapArt = document.querySelector('.map__art');
  if (mapArt && reduce.matches && mapArt.pauseAnimations) mapArt.pauseAnimations();

  var yr = document.getElementById('year'); if (yr) yr.textContent = new Date().getFullYear();
})();
