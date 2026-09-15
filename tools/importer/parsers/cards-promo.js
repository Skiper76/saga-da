/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-promo. Base: cards.
 * Source: https://www.saga.co.uk/ (promo pods section)
 * Structure: 2 columns. One row per pod: [image] [heading + description + CTA].
 */
export default function parse(element, { document }) {
  // Each pod is a .campaign-pod / .card within .campaign-pods
  const cards = element.querySelectorAll('.campaign-pod, .card');

  const cells = [];
  cards.forEach((card) => {
    // Image cell — the pod image (picture only)
    const img = card.querySelector('.card__image img, img');

    // Body cell — heading + description + CTA
    const bodyCell = [];

    const titleEl = card.querySelector('.card__title, h1, h2, h3, h4, h5, h6');
    if (titleEl) {
      // Map the visual class (h2/h3/…) to a real heading element for semantics
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

    if (!img && bodyCell.length === 0) return; // skip empty
    cells.push([img || '', bodyCell]);
  });

  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-promo', cells });
  element.replaceWith(block);
}
