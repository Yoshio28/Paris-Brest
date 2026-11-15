/* Parallax por capas: translate3d en rAF, solo para capas visibles.
   data-parallax="0.35" → la capa se desplaza 35 % de la distancia de scroll
   relativa al centro del viewport (positivo = más lento / más lejos). */
(function () {
  'use strict';
  var mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  var layers = [];
  var active = new Set();
  var ticking = false;
  var vh = window.innerHeight;

  function collect() {
    layers = Array.prototype.map.call(document.querySelectorAll('[data-parallax]'), function (el) {
      return { el: el, speed: parseFloat(el.dataset.parallax) || 0, host: el.closest('section') || el, fade: el.hasAttribute('data-fade') };
    });
  }

  function update() {
    ticking = false;
    if (mq.matches) return;
    var mobileScale = window.innerWidth < 735 ? 0.6 : 1;   // amplitud menor en móvil
    active.forEach(function (l) {
      var r = l.host.getBoundingClientRect();
      var delta = (r.top + r.height / 2) - vh / 2;          // 0 cuando la sección está centrada
      if (l.host.classList.contains('hero')) delta = r.top;  // el hero parte de 0
      var y = -delta * l.speed * mobileScale;
      l.el.style.transform = 'translate3d(0,' + y.toFixed(2) + 'px,0)';
      if (l.fade) l.el.style.opacity = Math.max(0, 1 - Math.max(0, -r.top) / (r.height * 0.6)).toFixed(3);
    });
  }

  function request() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }

  function reset() {
    layers.forEach(function (l) { l.el.style.transform = ''; l.el.style.opacity = ''; });
  }

  function init() {
    collect();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        layers.forEach(function (l) { if (l.host === e.target) { e.isIntersecting ? active.add(l) : active.delete(l); } });
      });
      request();
    }, { rootMargin: '20% 0px 20% 0px' });
    new Set(layers.map(function (l) { return l.host; })).forEach(function (h) { io.observe(h); });

    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', function () { vh = window.innerHeight; request(); }, { passive: true });
    var onChange = function () { if (mq.matches) reset(); else request(); };
    mq.addEventListener ? mq.addEventListener('change', onChange) : mq.addListener(onChange);
    request();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
