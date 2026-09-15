/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-article. Base: cards.
 * Source: https://www.saga.co.uk/ (latest articles feed)
 * Structure: 2 columns. One row per article: [image] [tag label + linked title].
 */
export default function parse(element, { document }) {
  const cards = element.querySelectorAll('.mag-article-feed__card, .card');

  const cells = [];
  cards.forEach((card) => {
    const img = card.querySelector('.card__image img, img');

    const bodyCell = [];

    // Tag label (e.g. "Article") rendered as a short paragraph
    const labelEl = card.querySelector('.card__label, .badge');
    if (labelEl && labelEl.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = labelEl.textContent.trim();
      bodyCell.push(p);
    }

    // Linked title
    const titleLink = card.querySelector('.card__title a, a.expanded-link');
    if (titleLink) {
      const heading = document.createElement('h3');
      const a = document.createElement('a');
      a.href = titleLink.getAttribute('href');
      a.textContent = titleLink.textContent.trim();
      heading.append(a);
      bodyCell.push(heading);
    } else {
      const titleEl = card.querySelector('.card__title');
      if (titleEl && titleEl.textContent.trim()) {
        const heading = document.createElement('h3');
        heading.textContent = titleEl.textContent.trim();
        bodyCell.push(heading);
      }
    }

    if (!img && bodyCell.length === 0) return;
    cells.push([img || '', bodyCell]);
  });

  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
  element.replaceWith(block);
}
