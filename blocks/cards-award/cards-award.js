import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * cards-award — a row of award / trust logo badges.
 * Each badge: logo image + optional small caption.
 * Rendered as a centered, wrapping row of compact badges.
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-award-image';
      } else {
        div.className = 'cards-award-body';
      }
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => img
    .closest('picture')
    .replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }])));
  block.replaceChildren(ul);
}
