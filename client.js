'use strict';
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const motion = () => reduce ? 'instant' : 'smooth';
const header = document.querySelector('.hb-top');
const menu = document.querySelector('.hb-menu');
const nav = document.querySelector('.hb-nav');
function closeMenu(){nav?.classList.remove('open');menu?.setAttribute('aria-expanded','false');header?.classList.remove('menu-open');}
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);header.classList.toggle('menu-open',open);});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
window.matchMedia('(min-width: 1001px)').addEventListener('change',closeMenu);
nav?.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.querySelectorAll('[data-scroll]').forEach(button=>button.addEventListener('click',()=>{closeMenu();document.getElementById(button.dataset.scroll)?.scrollIntoView({behavior:motion()});}));
const onScroll=()=>header?.classList.toggle('is-solid',document.body.classList.contains('hb-subpage')||window.scrollY>40);
window.addEventListener('scroll',onScroll,{passive:true});onScroll();
const strengths=document.querySelector('.hb-strengths');
if(strengths&&!reduce){let ticking=false;const update=()=>{ticking=false;const top=strengths.getBoundingClientRect().top;strengths.style.setProperty('--p',Math.min(1,Math.max(0,-top/(window.innerHeight*.55))).toFixed(3));};window.addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(update);}},{passive:true});window.addEventListener('resize',update);update();}
const mapFrame=document.querySelector('.hb-map iframe');
const mapButtons=document.querySelectorAll('[data-map]');
if(mapFrame)mapButtons.forEach(button=>button.addEventListener('click',()=>{mapFrame.src=button.dataset.map;mapFrame.title='地図：'+button.dataset.mapName;mapButtons.forEach(item=>item.setAttribute('aria-pressed',String(item===button)));if(window.matchMedia('(max-width: 1000px)').matches)mapFrame.scrollIntoView({behavior:motion(),block:'center'});}));
