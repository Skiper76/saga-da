/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-nav. Base: cards.
 * Source: https://www.saga.co.uk/ (nav tiles section)
 * Structure: 2 columns. One row per tile: [icon image] [title + description + CTA].
 */
export default function parse(element, { document }) {
  // Tiles live in .nav-tiles__container; each is a .nav-tiles__tile
  const tiles = element.querySelectorAll('.nav-tiles__tile');

  const cells = [];
  tiles.forEach((tile) => {
    // Icon — small (often base64 svg) image, direct child of the tile
    const icon = tile.querySelector(':scope > img, img');

    const bodyCell = [];
    const titleEl = tile.querySelector('.nav-tiles__title');
    if (titleEl) {
      const heading = document.createElement('h3');
      heading.textContent = titleEl.textContent.trim();
      bodyCell.push(heading);
    }

    const bodyEl = tile.querySelector('.nav-tiles__body');
    if (bodyEl) {
      const p = document.createElement('p');
      p.innerHTML = bodyEl.innerHTML;
      bodyCell.push(p);
    }

    const cta = tile.querySelector('a.nav-tiles__cta, a[class*="cta"], a.button');
    if (cta) {
      cta.textContent = cta.textContent.trim();
      bodyCell.push(cta);
    }

    if (!icon && bodyCell.length === 0) return;
    cells.push([icon || '', bodyCell]);
  });

  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-nav', cells });
  element.replaceWith(block);
}
