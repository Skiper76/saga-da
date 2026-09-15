/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-feature. Base: cards.
 * Source: https://www.saga.co.uk/ (feature promos section)
 * Structure: 2 columns. One row per feature pod: [image] [heading + description + CTA].
 */
export default function parse(element, { document }) {
  const cards = element.querySelectorAll('.campaign-pod, .card');

  const cells = [];
  cards.forEach((card) => {
    const img = card.querySelector('.card__image img, img');

    const bodyCell = [];

    const titleEl = card.querySelector('.card__title, h1, h2, h3, h4, h5, h6');
    if (titleEl) {
      let level = 'h3';
      const m = (titleEl.className || '').match(/\bh([1-6])\b/);
      if (m) level = `h${m[1]}`;
      else if (/^h[1-6]$/i.test(titleEl.tagName)) level = titleEl.tagName.toLowerCase();
      const heading = document.createElement(level);
      heading.textContent = titleEl.textContent.trim();
      bodyCell.push(heading);
    }

    const bodyEl = card.querySelector('.card__body');
    if (bodyEl) {
      const p = document.createElement('p');
      p.innerHTML = bodyEl.innerHTML;
      bodyCell.push(p);
    }

    const cta = card.querySelector('a.card__cta, .card__cta, a[class*="cta"]');
    if (cta) {
      cta.textContent = cta.textContent.trim();
      bodyCell.push(cta);
    }

    if (!img && bodyCell.length === 0) return;
    cells.push([img || '', bodyCell]);
  });

  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-feature', cells });
  element.replaceWith(block);
}
