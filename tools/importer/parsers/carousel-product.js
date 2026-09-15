/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-product. Base: carousel.
 * Source: https://www.saga.co.uk/car-insurance/faqs ("More from Saga" carousel)
 * Structure: 2 columns, multiple rows. Row 1 = block name (createBlock).
 *   Each subsequent row = one product card: [image | content].
 *   Image cell: the card image only.
 *   Content cell: tag + heading + description + CTA link.
 * Source layout: .card-carousel__slider .card, each card has
 *   .card__image img, .card__label (badge tag), h3.card__title > a.expanded-link
 *   (heading + destination link), and .card__body (description).
 *   A leading .card-carousel__intro (h3 + p) is section-level default content
 *   and is excluded from the block rows.
 */
export default function parse(element, { document }) {
  const cards = element.querySelectorAll(
    '.card-carousel__slider .card, .card-carousel__carousel-container .card, .carousel .card',
  );

  const cells = [];
  cards.forEach((card) => {
    // Image cell — card image only.
    const img = card.querySelector('.card__image img, img');

    // Content cell — tag + heading + description + CTA link.
    const contentCell = [];

    // Destination link wrapping the title (whole-card link).
    const linkEl = card.querySelector('.card__title a, a.expanded-link, a[class*="expanded-link"]');
    const href = linkEl ? linkEl.getAttribute('href') : '';

    // Tag / badge label.
    const tagEl = card.querySelector('.card__label, .badge, [class*="label"]');
    if (tagEl && tagEl.textContent.trim()) {
      const tag = document.createElement('p');
      tag.textContent = tagEl.textContent.trim();
      contentCell.push(tag);
    }

    // Heading — the card title text (styled as a heading).
    const titleEl = card.querySelector('.card__title');
    const titleText = titleEl ? titleEl.textContent.trim() : '';
    if (titleText) {
      const heading = document.createElement('h3');
      heading.textContent = titleText;
      contentCell.push(heading);
    }

    // Description — the card body copy (preserve inner markup/links).
    const bodyEl = card.querySelector('.card__body');
    if (bodyEl && bodyEl.textContent.trim()) {
      const paras = bodyEl.querySelectorAll('p');
      if (paras.length) {
        paras.forEach((p) => contentCell.push(p));
      } else {
        const p = document.createElement('p');
        p.innerHTML = bodyEl.innerHTML;
        contentCell.push(p);
      }
    }

    // CTA link at the bottom — reuse the card destination.
    if (href) {
      const cta = document.createElement('a');
      cta.setAttribute('href', href);
      cta.textContent = titleText || linkEl.textContent.trim() || 'Find out more';
      contentCell.push(cta);
    }

    if (!img && contentCell.length === 0) return; // skip empty card
    cells.push([img || '', contentCell.length ? contentCell : '']);
  });

  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-product', cells });
  element.replaceWith(block);
}
