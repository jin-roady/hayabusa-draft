'use strict';
(() => {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const root = document.documentElement;
  const running = new Set();
  let observer;
  const selectors = [
    '.hb-about-text .hb-title', '.hb-about-copy', '.hb-about-text>p', '.hb-about-photos',
    '.hb-vision .hb-title', '.hb-vision-copy', '.hb-vision-text>p', '.hb-vision-media',
    '.hb-split>div', '.hb-biz-list>li', '.hb-biz-photo', '.hb-strengths-head', '.hb-figures>li',
    '.hb-relief-head', '.hb-relief-list>li', '.hb-equip-grid>.hb-equip', '.hb-strip>li',
    '.hb-offices-title', '.hb-offices li', '.hb-contact-inner>div',
    '.sp-section-head', '.sp-service-text', '.sp-service>.sp-photo', '.sp-two>figure',
    '.sp-two>div', '.sp-history>li', '.sp-gallery-item', '.sp-message>p', '.sp-cta>div'
  ].join(',');
  function stopMotion() {
    observer?.disconnect();
    running.forEach(animation => animation.cancel());
    running.clear();
    document.querySelectorAll('[data-reveal=pending]').forEach(el => el.dataset.reveal = 'shown');
    root.classList.remove('motion-ready');
  }
  function animate(el, delay = 0, distance = 20, duration = 620) {
    if (preference.matches || !el.animate) return;
    const animation = el.animate([
      {opacity:0, transform:`translate3d(0,${distance}px,0)`},
      {opacity:1, transform:'translate3d(0,0,0)'}
    ], {duration, delay, easing:'cubic-bezier(.22,.68,.3,1)', fill:'both'});
    running.add(animation);
    animation.onfinish = () => {running.delete(animation); animation.cancel();};
  }
  if (!preference.matches && 'IntersectionObserver' in window) {
    try {
      observer = new IntersectionObserver(entries => {
        entries.filter(entry => entry.isIntersecting).forEach((entry, index) => {
          const el = entry.target;
          observer.unobserve(el);
          el.dataset.reveal = 'shown';
          animate(el, Math.min(index, 3) * 65);
        });
      }, {threshold:0.06, rootMargin:'0px 0px -24px 0px'});
      const targets = document.querySelectorAll(selectors);
      targets.forEach(el => {el.dataset.reveal = 'pending'; observer.observe(el);});
      root.classList.add('motion-ready');
      document.querySelectorAll('.hb-hero-copy>*').forEach((el, i) => animate(el, i * 100, 18, 720));
      document.querySelectorAll('.sp-hero-copy>*').forEach((el, i) => animate(el, i * 75, 16, 650));
    } catch (_) {stopMotion();}
  }
  preference.addEventListener('change', event => {if(event.matches) stopMotion();});
  // Reveal keyboard destinations immediately, including content reached by anchors.
  document.addEventListener('focusin', event => {
    const pending = event.target.closest?.('[data-reveal=pending]');
    if (pending) {pending.dataset.reveal = 'shown'; observer?.unobserve(pending);}
  });
  const progress = document.createElement('div');
  progress.className = 'site-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.append(progress);
  const top = document.createElement('button');
  top.type = 'button'; top.className = 'site-top'; top.hidden = true;
  top.setAttribute('aria-label', 'ページ上部へ戻る');
  const arrow = document.createElement('span'); arrow.textContent = '↑'; arrow.setAttribute('aria-hidden','true');
  const label = document.createElement('small'); label.textContent = 'TOP'; label.setAttribute('aria-hidden','true');
  top.append(arrow, label); document.body.append(top);
  top.addEventListener('click', () => window.scrollTo({top:0, behavior:preference.matches?'auto':'smooth'}));
  let queued = false;
  function update() {
    queued = false;
    const distance = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    progress.style.transform = `scaleX(${distance ? Math.min(1, Math.max(0, window.scrollY / distance)) : 0})`;
    top.hidden = window.scrollY < 800;
  }
  function queue() {if(!queued){queued=true;requestAnimationFrame(update);}}
  window.addEventListener('scroll', queue, {passive:true});
  window.addEventListener('resize', queue, {passive:true});
  window.addEventListener('pageshow', update);
  document.addEventListener('toggle', queue, true);
  update();
})();
