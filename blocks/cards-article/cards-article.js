import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * cards-article — a feed of article cards.
 * Each card: image + a small tag label (e.g. "ARTICLE") + linked title.
 * The first non-picture cell that is short and uppercase-ish acts as the tag;
 * remaining body content (title/link) follows. Decorate defensively — authors
 * may omit the tag.
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-article-image';
      } else {
        div.className = 'cards-article-body';
      }
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => img
    .closest('picture')
    .replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '400' }])));
  block.replaceChildren(ul);
}
