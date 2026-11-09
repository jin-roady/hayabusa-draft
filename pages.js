'use strict';
// Gallery filters use native buttons and announce the resulting count.
const filterButtons = document.querySelectorAll('[data-filter]');
const galleryItems = document.querySelectorAll('.sp-gallery-item');
filterButtons.forEach(button => button.addEventListener('click', () => {
  filterButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  let count = 0;
  galleryItems.forEach(item => {
    item.hidden = button.dataset.filter !== 'all' && item.dataset.category !== button.dataset.filter;
    if (!item.hidden) count++;
  });
  document.getElementById('gallery-count').textContent = `${count}枚の写真を表示しています。`;
}));
const photoDialog = document.getElementById('photo-dialog');
galleryItems.forEach(item => item.addEventListener('click', () => {
  const large = document.getElementById('photo-large');
  large.src = item.dataset.photo;
  large.alt = item.dataset.caption;
  document.getElementById('photo-caption').textContent = item.dataset.caption;
  photoDialog.showModal();
}));
document.querySelector('[data-close-photo]')?.addEventListener('click', () => photoDialog.close());
photoDialog?.addEventListener('click', event => {
  if (event.target !== photoDialog) return;
  const rect = photoDialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) photoDialog.close();
});
// Contact is a preview: no network request, persistence, or success receipt.
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', event => event.preventDefault());
  const topic = new URLSearchParams(location.search).get('type');
  const select = document.getElementById('contact-type');
  if ([...select.options].some(option => option.value === topic)) select.value = topic;
  document.getElementById('review-contact').addEventListener('click', () => {
    if (!contactForm.reportValidity()) return;
    const fields = [['type', 'お問い合わせ種別'], ['company', '会社名'], ['name', 'お名前'], ['email', 'メールアドレス'], ['phone', '電話番号'], ['message', 'お問い合わせ内容']];
    const list = document.getElementById('review-values');
    list.replaceChildren();
    fields.forEach(([name, label]) => {
      const dt = document.createElement('dt');
      const dd = document.createElement('dd');
      dt.textContent = label;
      dd.textContent = name === 'type' ? select.selectedOptions[0].textContent : contactForm.elements.namedItem(name).value.trim() || '未入力';
      list.append(dt, dd);
    });
    contactForm.hidden = true;
    const review = document.getElementById('contact-review');
    review.hidden = false;
    document.getElementById('step-input').removeAttribute('aria-current');
    document.getElementById('step-review').setAttribute('aria-current', 'step');
    review.focus();
    review.scrollIntoView({behavior: 'auto', block: 'start'});
  });
  document.getElementById('edit-contact').addEventListener('click', () => {
    document.getElementById('contact-review').hidden = true;
    contactForm.hidden = false;
    document.getElementById('step-review').removeAttribute('aria-current');
    document.getElementById('step-input').setAttribute('aria-current', 'step');
    select.focus();
  });
}
