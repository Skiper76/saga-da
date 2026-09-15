import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * cards-feature — large 2-up feature promo pods.
 * Each pod: image + heading + description + one CTA button.
 * Larger layout than cards-promo; 1-up on mobile, 2-up on desktop.
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-feature-image';
      } else {
        div.className = 'cards-feature-body';
      }
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => img
    .closest('picture')
    .replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '900' }])));
  // Style each pod's standalone CTA link as a button (project auto-buttonization
  // only fires on bold/italic links; these are plain links from the source).
  ul.querySelectorAll('.cards-feature-body p > a:only-child').forEach((a) => {
    if (a.parentElement.textContent.trim() === a.textContent.trim()) {
      a.classList.add('button');
      a.parentElement.classList.add('button-container');
    }
  });
  block.replaceChildren(ul);
}
