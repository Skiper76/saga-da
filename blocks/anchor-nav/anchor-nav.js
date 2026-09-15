/**
 * anchor-nav — a horizontal in-page jump navigation.
 *
 * Authoring model: a list of links, each pointing to an in-page anchor
 * (e.g. "My car cover" -> #anchor_Mycarcover). Authors supply a single
 * list of links; the block renders them as a horizontal band of plain
 * text links with a trailing "Back to top" link, and adds smooth-scroll
 * behaviour. The bar is sticky to the top of the viewport.
 */
export default function decorate(block) {
  const nav = document.createElement('nav');
  nav.className = 'anchor-nav-list';
  nav.setAttribute('aria-label', 'In-page navigation');

  // collect all authored anchor links into a horizontal list
  const links = [...block.querySelectorAll('a')];
  links.forEach((a) => {
    a.classList.add('anchor-nav-link');
    nav.append(a);
  });

  // trailing "Back to top" link (generated, matches source design)
  const top = document.createElement('a');
  top.className = 'anchor-nav-top';
  top.href = '#';
  top.setAttribute('aria-label', 'Back to top');
  top.innerHTML = '<span>Back to top</span>';

  // smooth scroll for same-page anchors + back-to-top
  const scrollHandler = (e) => {
    const link = e.target.closest('a');
    if (!link) return;
    const href = link.getAttribute('href') || '';
    if (link === top || href === '#') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (href.startsWith('#') && href.length > 1) {
      const target = document.getElementById(decodeURIComponent(href.slice(1)));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  nav.addEventListener('click', scrollHandler);
  top.addEventListener('click', scrollHandler);

  block.replaceChildren(nav, top);
}
