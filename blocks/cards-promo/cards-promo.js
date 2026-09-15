import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * cards-promo — a row of promotional pods.
 * Each pod: image (optional) + heading + description + one CTA button.
 * Authors may omit the image cell; decorate defensively.
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-promo-image';
      } else {
        div.className = 'cards-promo-body';
        // ensure the CTA renders as a button even if EDS button
        // auto-decoration did not run on the authored markup
        const cta = div.querySelector('p:last-child > a');
        if (cta && cta.parentElement.childElementCount === 1) {
          cta.classList.add('button');
          cta.parentElement.classList.add('button-container');
        }
      }
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => img
    .closest('picture')
    .replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.replaceChildren(ul);
}
