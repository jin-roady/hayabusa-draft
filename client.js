'use strict';
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const motion = () => reduce ? 'instant' : 'smooth';
const header = document.querySelector('.hb-top');
const menu = document.querySelector('.hb-menu');
const nav = document.querySelector('.hb-nav');
const dialog = document.querySelector('#preview-dialog');

// SP menu
function closeMenu(){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');header.classList.remove('menu-open');}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);header.classList.toggle('menu-open',open);});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
window.matchMedia('(min-width: 1001px)').addEventListener('change',()=>closeMenu());
document.querySelectorAll('[data-scroll]').forEach(b=>b.addEventListener('click',()=>{closeMenu();document.getElementById(b.dataset.scroll)?.scrollIntoView({behavior:motion()});}));
document.querySelectorAll('[data-destination]').forEach(b=>b.addEventListener('click',()=>{closeMenu();document.querySelector('#dialog-route').textContent='制作予定のページ：'+b.dataset.destination;dialog.showModal();}));

// Header sits beside the navy side panel over the FV, then turns into a full-width white bar
const onScroll = () => header.classList.toggle('is-solid', window.scrollY > 40);
window.addEventListener('scroll', onScroll, {passive:true}); onScroll();

// Strengths: blur and darken the pinned photo as the content covers it
const strengths = document.querySelector('.hb-strengths');
if (!reduce) {
  let ticking = false;
  const update = () => { ticking = false; const top = strengths.getBoundingClientRect().top; const p = Math.min(1, Math.max(0, -top / (window.innerHeight * .55))); strengths.style.setProperty('--p', p.toFixed(3)); };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, {passive:true});
  window.addEventListener('resize', update); update();
}

// Offices: switch the embedded map to the chosen base
const mapFrame = document.querySelector('.hb-map iframe');
const mapButtons = document.querySelectorAll('[data-map]');
mapButtons.forEach(b=>b.addEventListener('click',()=>{mapFrame.src=b.dataset.map;mapFrame.title='地図：'+b.dataset.mapName;mapButtons.forEach(x=>x.setAttribute('aria-pressed',String(x===b)));if(window.matchMedia('(max-width: 1000px)').matches)mapFrame.scrollIntoView({behavior:motion(),block:'center'});}));
