import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * cards-nav — a grid of navigation tiles.
 * Each tile: optional icon cell + body cell (title + description + one CTA link).
 * Rendered as a responsive multi-column grid (2-up mobile, 4-up desktop) sitting
 * on a light teal band, matching the source Saga "nav tiles" design.
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  // Trailing default-content paragraph (e.g. "See more"): not a tile row.
  const trailing = [...block.children].filter((el) => el.tagName !== 'DIV');

  [...block.children].forEach((row) => {
    if (row.tagName !== 'DIV') return;
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    const cells = [...li.children];
    if (cells.length > 1) {
      // First cell is the icon, the rest form the body.
      cells[0].className = 'cards-nav-icon';
      cells.slice(1).forEach((c) => { c.className = 'cards-nav-body'; });
    } else if (cells.length === 1) {
      cells[0].className = 'cards-nav-body';
    }
    if (li.children.length) ul.append(li);
  });

  // Optimise any icon images that were authored.
  ul.querySelectorAll('picture > img').forEach((img) => img
    .closest('picture')
    .replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }])));

  block.replaceChildren(ul);

  // Re-attach any trailing content (e.g. a "See more" link) beneath the grid.
  trailing.forEach((el) => {
    el.classList.add('cards-nav-more');
    block.append(el);
  });
}
