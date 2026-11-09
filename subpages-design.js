'use strict';
(() => {
  if (!document.body.classList.contains('hb-subpage')) return;
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const running = new Set();
  let revealObserver;
  function animate(el, keyframes, delay = 0, duration = 650) {
    if (!el || preference.matches || !el.animate) return;
    const animation = el.animate(keyframes, {duration, delay, easing:'cubic-bezier(.22,.68,.3,1)', fill:'both'});
    running.add(animation);
    animation.onfinish = () => {running.delete(animation); animation.cancel();};
  }
  const entrance = [{opacity:0,transform:'translateY(22px)'},{opacity:1,transform:'translateY(0)'}];
  function restore() {
    revealObserver?.disconnect();
    running.forEach(animation => animation.cancel());running.clear();
    document.querySelectorAll('[data-sp-reveal=pending]').forEach(el => el.dataset.spReveal = 'shown');
    document.body.classList.remove('sp-motion-ready');
  }
  if (!preference.matches && 'IntersectionObserver' in window) {
    try {
      revealObserver = new IntersectionObserver(entries => {
        entries.filter(entry => entry.isIntersecting).forEach((entry, i) => {
          revealObserver.unobserve(entry.target);
          entry.target.dataset.spReveal = 'shown';
          animate(entry.target, entrance, Math.min(i,3) * 70);
        });
      }, {threshold:0.06,rootMargin:'0px 0px -24px 0px'});
      document.querySelectorAll('.sp-section-head,.sp-service-text,.sp-service>.sp-photo,.sp-message-photo,.sp-message>p,.sp-history>li,.sp-gallery-item,.sp-related>a,.hb-equip-grid>.hb-equip,.sp-two>figure,.sp-two>div,.sp-cta>div').forEach(el => {
        el.dataset.spReveal = 'pending';revealObserver.observe(el);
      });
      document.body.classList.add('sp-motion-ready');
      animate(document.querySelector('.sp-editorial-heading h1'),entrance,0,650);
      animate(document.querySelector('.sp-editorial-en'),entrance,90,700);
      animate(document.querySelector('.sp-hero-copy h2'),entrance,160,720);
      animate(document.querySelector('.sp-hero-copy>p'),entrance,250,650);
      animate(document.querySelector('.sp-editorial-scene>.sp-photo'),[{clipPath:'inset(0 0 0 100%)'},{clipPath:'inset(0 0 0 0)'}],0,850);
    } catch (_) {restore();}
  }
  preference.addEventListener('change',event => {if(event.matches) restore();});
  document.addEventListener('focusin',event => {
    const target=event.target.closest?.('[data-sp-reveal=pending]');
    if(target){target.dataset.spReveal='shown';revealObserver?.unobserve(target);}
  });
  // Preserve the existing gallery's filter and dialog; add a short regrouping cue.
  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click',() => {
    const gallery=document.querySelector('.sp-gallery');
    gallery.dataset.activeFilter=button.dataset.filter;
    animate(gallery,[{opacity:.5},{opacity:1}],0,260);
  }));
  const fleetRows=document.querySelectorAll('[data-fleet-group]');
  document.querySelectorAll('[data-fleet]').forEach(button => button.addEventListener('click',() => {
    document.querySelectorAll('[data-fleet]').forEach(el=>el.setAttribute('aria-pressed',String(el===button)));
    let count=0;
    fleetRows.forEach(row=>{row.hidden=button.dataset.fleet!=='all'&&row.dataset.fleetGroup!==button.dataset.fleet;if(!row.hidden)count++;});
    document.querySelector('.sp-fleet-count').textContent=`${count}項目を表示しています。`;
  }));
  const localLinks=[...document.querySelectorAll('.sp-jump a[href^="#"],.sp-policy-nav a[href^="#"]')];
  const locations=localLinks.map(link=>({link,section:document.getElementById(link.hash.slice(1))})).filter(item=>item.section);
  if(locations.length){
    let queued=false;
    const update=()=>{
      queued=false;
      const headerHeight=document.querySelector('.hb-top')?.offsetHeight||84;
      const jump=document.querySelector('.sp-jump');
      const offset=headerHeight+(jump&&window.innerWidth>1000?jump.offsetHeight:0)+60;
      let active=locations[0];
      locations.forEach(item=>{if(item.section.getBoundingClientRect().top<=offset)active=item;});
      locations.forEach(item=>{if(item===active)item.link.setAttribute('aria-current','location');else item.link.removeAttribute('aria-current');});
    };
    const queue=()=>{if(!queued){queued=true;requestAnimationFrame(update);}};
    window.addEventListener('scroll',queue,{passive:true});window.addEventListener('resize',queue,{passive:true});update();
  }
})();
