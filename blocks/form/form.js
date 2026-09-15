/**
 * form — a lightweight newsletter/signup form.
 *
 * Authoring model (one row per element):
 *   | text   | Sign up to our newsletter (heading/rich text)  |       |
 *   | field  | First name | text  |
 *   | field  | Last name  | text  |
 *   | field  | Email      | email |
 *   | submit | Sign up    |       |
 *   | text   | Privacy note ...   |       |
 * Cell 1 = element type (field | submit | text), cell 2 = label/text,
 * cell 3 (optional) = input type for fields (defaults to "text").
 *
 * Rows that don't match field/submit are treated as rich text and rendered
 * as intro (before the fields) or note (after the fields). Decorate
 * defensively — authors omit and add cells.
 */
function slug(label) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function decorate(block) {
  const intro = document.createElement('div');
  intro.className = 'form-intro';
  const note = document.createElement('div');
  note.className = 'form-note';

  const fields = [];
  let submit = null;
  let seenControl = false;

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const type = (cells[0]?.textContent || '').trim().toLowerCase();
    const label = (cells[1]?.textContent || '').trim();
    const inputType = (cells[2]?.textContent || '').trim().toLowerCase() || 'text';

    if (type === 'field' && label) {
      seenControl = true;
      fields.push({ label, inputType });
    } else if (type === 'submit') {
      seenControl = true;
      submit = { label: label || 'Submit' };
    } else {
      // rich text — intro if before controls, note if after
      const target = seenControl ? note : intro;
      while (row.firstElementChild) target.append(row.firstElementChild);
    }
  });

  const form = document.createElement('form');
  form.setAttribute('novalidate', '');

  function buildField({ label, inputType }) {
    const wrapper = document.createElement('div');
    wrapper.className = 'form-field';
    const id = `form-${slug(label)}`;
    const input = document.createElement('input');
    input.type = inputType;
    input.id = id;
    input.name = slug(label);
    input.placeholder = label;
    input.setAttribute('aria-label', label);
    wrapper.append(input);
    return wrapper;
  }

  // Last field pairs with the submit button (attached bar, e.g. email + Sign up).
  const pairedField = submit && fields.length ? fields.pop() : null;

  if (fields.length) {
    const names = document.createElement('div');
    names.className = 'form-row-names';
    fields.forEach((f) => names.append(buildField(f)));
    form.append(names);
  }

  if (pairedField || submit) {
    const submitRow = document.createElement('div');
    submitRow.className = 'form-row-submit';
    if (pairedField) submitRow.append(buildField(pairedField));
    if (submit) {
      const btn = document.createElement('button');
      btn.type = 'submit';
      btn.className = 'button';
      btn.textContent = submit.label;
      const btnWrap = document.createElement('div');
      btnWrap.className = 'form-submit';
      btnWrap.append(btn);
      submitRow.append(btnWrap);
    }
    form.append(submitRow);
  }

  form.addEventListener('submit', (e) => e.preventDefault());

  // Assemble into a white card inside the (teal) block panel.
  const card = document.createElement('div');
  card.className = 'form-card';
  if (intro.childElementCount) card.append(intro);
  card.append(form);
  if (note.childElementCount) card.append(note);

  block.replaceChildren(card);
}
