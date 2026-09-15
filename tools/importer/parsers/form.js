/* eslint-disable */
/* global WebImporter */
/**
 * Parser for form. Base: form (custom block).
 * Source: https://www.saga.co.uk/ (newsletter signup).
 *
 * Authoring model (blocks/form/form.js):
 *   | field  | <label>     | <input-type> |
 *   | submit | <button>    |              |
 *   Any other single-cell row = intro / rich text rendered above the form.
 *
 * We derive fields from the source inputs (first name, last name, email),
 * the submit button label, and place the intro heading/description +
 * privacy note as rich-text rows.
 */
export default function parse(element, { document }) {
  const cells = [];

  // Intro: heading + lead paragraph (rich-text row, single cell)
  const introCell = [];
  const title = element.querySelector('.form-subscribe__title, h1, h2, h3');
  if (title) {
    const h = document.createElement('h3');
    h.textContent = title.textContent.trim();
    introCell.push(h);
  }
  const lead = element.querySelector('.form-subscribe__content > p, .form-subscribe__content p');
  if (lead && lead.textContent.trim()) {
    const p = document.createElement('p');
    p.textContent = lead.textContent.trim();
    introCell.push(p);
  }
  if (introCell.length) cells.push([introCell]);

  // Fields — derive label + input type from each control group.
  const fieldGroups = element.querySelectorAll('.control-group');
  fieldGroups.forEach((group) => {
    const input = group.querySelector('input');
    const labelEl = group.querySelector('.control-group__label, label');
    if (!input) return;
    let label = (labelEl?.textContent || '').replace(/\*/g, '').trim();
    if (!label) return;
    let inputType = (input.getAttribute('type') || '').trim().toLowerCase();
    if (!inputType) {
      // Infer from id/label when the source omits the type attribute
      if (/email/i.test(input.id) || /email/i.test(label)) inputType = 'email';
      else inputType = 'text';
    }
    cells.push(['field', label, inputType]);
  });

  // Submit button
  const submitBtn = element.querySelector('button[type="submit"], #PageFormSubmitBtn, button');
  if (submitBtn) {
    const btnLabel = submitBtn.textContent.replace(/\s+/g, ' ').trim() || 'Sign up';
    cells.push(['submit', btnLabel, '']);
  }

  // Privacy note / small print — rich-text row after the form fields
  const smallText = element.querySelector('.small-text');
  if (smallText) {
    const noteCell = [];
    smallText.querySelectorAll('p').forEach((p) => {
      const np = document.createElement('p');
      np.innerHTML = p.innerHTML;
      noteCell.push(np);
    });
    if (noteCell.length) cells.push([noteCell]);
  }

  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'form', cells });
  element.replaceWith(block);
}
