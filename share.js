'use strict';
// Accent comparison: "あり" is the draft as designed, "なし" swaps every accent use back to navy / pale blue
const root = document.documentElement;
const accentButtons = document.querySelectorAll('[data-accent]');
function setAccent(on){root.classList.toggle('no-accent',!on);accentButtons.forEach(b=>b.setAttribute('aria-pressed',String((b.dataset.accent==='on')===on)));}
accentButtons.forEach(b=>b.addEventListener('click',()=>setAccent(b.dataset.accent==='on')));
setAccent(location.hash!=='#plain');

