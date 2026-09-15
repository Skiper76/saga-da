import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // metadata-independent dual-fetch: /content first (localhost / aem up),
  // then site root (DA/EDS production). We only use the response to pick the
  // path; loadFragment does the actual decoration of the .plain.html fragment.
  let resp = await fetch('/content/footer.plain.html');
  if (!resp.ok) resp = await fetch('/footer.plain.html');
  const footerPath = resp.url.includes('/content/footer') ? '/content/footer' : '/footer';

  const fragment = await loadFragment(footerPath);
  if (!fragment) return;

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // tag the three source bands so CSS can style them: brand, links, legal
  const bands = ['footer-brand', 'footer-links', 'footer-legal'];
  bands.forEach((c, i) => {
    const section = footer.children[i];
    if (section) section.classList.add(c);
  });

  // group each column heading (<p>) + its following <ul> into a column wrapper.
  // decorateSections wraps section content in a .default-content-wrapper, so read
  // the heading/list/social nodes from there (fall back to the section itself).
  const links = footer.querySelector('.footer-links');
  if (links) {
    const source = links.querySelector('.default-content-wrapper') || links;
    const columns = document.createElement('div');
    columns.className = 'footer-columns';
    let current = null;
    [...source.children].forEach((el) => {
      if (el.tagName === 'P' && !el.querySelector('img')) {
        // a column heading — start a new column
        current = document.createElement('div');
        current.className = 'footer-column';
        current.append(el);
        columns.append(current);
      } else if (el.tagName === 'UL' && current) {
        current.append(el);
      } else if (current) {
        // social icons paragraph (or anything else) — append to the last column
        current.append(el);
      } else {
        columns.append(el);
      }
    });
    links.replaceChildren(columns);
  }

  block.append(footer);
}
