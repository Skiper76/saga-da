/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-overlay. Base: hero.
 * Source: https://www.saga.co.uk/car-insurance/faqs (page-top hero)
 * Structure: 1 column, up to 3 rows. Row 1 = block name (createBlock).
 *   Row 2 = background image (optional).
 *   Row 3 = heading + optional paragraph + CTA links.
 * Source layout: .hero__image img (background), h1.hero__title (heading),
 *   .hero__description (optional paragraph), .hero__ctas a.button (CTAs).
 */
export default function parse(element, { document }) {
  const cells = [];

  // Row 2: background image (optional) — the hero image container.
  const bgImage = element.querySelector('.hero__image img, .hero__image-container img, img');
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 3: content cell — heading + optional description + CTA links.
  const contentCell = [];

  // Heading — hero__title (or first heading in the content area).
  const heading = element.querySelector('.hero__title, .hero__content h1, .hero__content h2, h1, h2');
  if (heading) {
    contentCell.push(heading);
  }

  // Optional description paragraph(s). The .hero__description wrapper may be
  // empty; only include it if it has meaningful text.
  const descWrap = element.querySelector('.hero__description');
  if (descWrap && descWrap.textContent.trim()) {
    const paras = descWrap.querySelectorAll('p');
    if (paras.length) {
      paras.forEach((p) => contentCell.push(p));
    } else {
      const p = document.createElement('p');
      p.innerHTML = descWrap.innerHTML;
      contentCell.push(p);
    }
  }

  // CTA links — buttons in the hero__ctas area (fallback to any hero button).
  const ctaLinks = Array.from(
    element.querySelectorAll('.hero__ctas a, a.button'),
  );
  ctaLinks.forEach((a) => {
    a.textContent = a.textContent.trim();
    contentCell.push(a);
  });

  if (contentCell.length) {
    cells.push([contentCell]);
  }

  // Empty-block guard: nothing meaningful extracted.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-overlay', cells });
  element.replaceWith(block);
}
