/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion-faq. Base: accordion.
 * Source: https://www.saga.co.uk/car-insurance/faqs (grouped FAQ accordions)
 * Structure: 2 columns, multiple rows. Row 1 = block name (createBlock).
 *   Each subsequent row = one accordion item: [question label | answer body].
 * Source layout: .accordion__item > .accordion__heading > .accordion__title
 *   (question) + .accordion__toggle (button, dropped); .accordion__description
 *   holds the answer body (paragraphs, links, lists). A leading
 *   .accordion__header > h3 group label is section-level default content and is
 *   excluded from the block rows.
 */
export default function parse(element, { document }) {
  const items = element.querySelectorAll('.accordion__item');

  const cells = [];
  items.forEach((item) => {
    // Question cell — the accordion title text (toggle button excluded).
    const titleEl = item.querySelector('.accordion__title, .accordion__heading .accordion__title');
    const questionText = titleEl ? titleEl.textContent.trim() : '';

    // Answer cell — the description body (paragraphs, links, lists preserved).
    const descEl = item.querySelector('.accordion__description');

    if (!questionText && !descEl) return; // skip empty item

    // Build a clean question cell as a paragraph to preserve it as text.
    const questionCell = [];
    if (questionText) {
      const q = document.createElement('p');
      q.textContent = questionText;
      questionCell.push(q);
    }

    // Answer cell — reference the description's child nodes (keeps semantics:
    // paragraphs, anchors, lists). Strip any stray toggle icons.
    const answerCell = [];
    if (descEl) {
      descEl.querySelectorAll('button, img[src^="data:"], svg').forEach((n) => n.remove());
      answerCell.push(...descEl.childNodes);
    }

    cells.push([
      questionCell.length ? questionCell : '',
      answerCell.length ? answerCell : '',
    ]);
  });

  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Group heading (e.g. "My car insurance cover") lives in .accordion__header
  // as an <h3>. It's the visible divider between FAQ groups — keep it as a
  // heading rendered ABOVE the accordion block (section default content).
  const headingEl = element.querySelector('.accordion__header h3, .accordion__header h2');
  let heading = null;
  if (headingEl && headingEl.textContent.trim()) {
    heading = document.createElement('h3');
    heading.textContent = headingEl.textContent.trim();
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
  if (heading) block.before(heading);
}
