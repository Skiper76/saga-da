/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-award. Base: cards.
 * Source: https://www.saga.co.uk/ (trust panel)
 * Structure: 2 columns. One row per award badge: [logo image] [caption].
 * Each badge is a link wrapping a logo image; the image alt text is the caption.
 */
export default function parse(element, { document }) {
  const badges = element.querySelectorAll('.trust-panel__logo-item, .trust-panel__logos a');

  const cells = [];
  badges.forEach((badge) => {
    const img = badge.querySelector('img');
    if (!img) return;

    // Wrap the logo image in its link so the badge stays clickable
    const href = badge.getAttribute('href');
    let imageCellContent = img;
    if (href) {
      const a = document.createElement('a');
      a.href = href;
      a.append(img);
      imageCellContent = a;
    }

    // Caption from the logo alt text
    const bodyCell = [];
    const caption = (img.getAttribute('alt') || '').trim();
    if (caption) {
      const p = document.createElement('p');
      p.textContent = caption;
      bodyCell.push(p);
    }

    cells.push([imageCellContent, bodyCell]);
  });

  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-award', cells });
  element.replaceWith(block);
}
