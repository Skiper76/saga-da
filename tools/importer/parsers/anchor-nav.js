/* eslint-disable */
/* global WebImporter */
/**
 * Parser for anchor-nav. Base: anchor-nav (custom — no library convention).
 * Source: https://www.saga.co.uk/car-insurance/faqs (sticky in-page jump nav)
 * Structure: 1 column. Row 1 = block name. Row 2 = single cell holding a list
 *   of in-page anchor links (label -> #anchor). The block's decorate() collects
 *   every <a> in the block and renders them as a horizontal nav bar.
 * Source layout: ul.anchor-nav__list > li.anchor-nav__item > a[href^="#"].
 *   A mobile-only .anchor-nav__selectedItem <button> duplicates the active label
 *   and a decorative "Back to top" link exist — the button is excluded.
 */
export default function parse(element, { document }) {
  // The authored anchor links live in the nav list. Fall back to any in-page
  // anchor links if the list class is absent on some pages.
  let links = Array.from(
    element.querySelectorAll('.anchor-nav__list a, .anchor-nav__item a'),
  );
  if (links.length === 0) {
    links = Array.from(element.querySelectorAll('a[href^="#"]')).filter(
      (a) => !a.classList.contains('anchor-nav__top-link'),
    );
  }

  if (links.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Build a clean list of links in a single cell.
  const list = document.createElement('ul');
  links.forEach((a) => {
    // Normalise: strip transient state classes and decorative icons.
    a.classList.remove('active', 'adl-anchorNav');
    a.querySelectorAll('img, svg').forEach((n) => n.remove());
    a.textContent = a.textContent.trim();
    const li = document.createElement('li');
    li.append(a);
    list.append(li);
  });

  const cells = [[list]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'anchor-nav', cells });
  element.replaceWith(block);
}
