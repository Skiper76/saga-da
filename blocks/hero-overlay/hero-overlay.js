/**
 * hero-overlay — a shallow full-width hero with a background photo, a dark
 * overlay, an orange accent bar, a heading, and one or more CTA buttons.
 *
 * Content model: 2 rows.
 *   Row 1: a single cell with the background image (picture).
 *   Row 2: a single cell with a heading, followed by one link per paragraph.
 *
 * Decoration:
 *   - If no image is authored, add .no-image (text renders dark on light).
 *   - Tag the image row and content row for styling.
 *   - Promote the CTA links to buttons (first = primary orange, rest =
 *     secondary light) and group them in a .hero-overlay-ctas row.
 */
export default function decorate(block) {
  const rows = [...block.children];
  const imageRow = rows.find((row) => row.querySelector('picture'));
  const contentRow = rows.find((row) => row !== imageRow) || rows[rows.length - 1];

  if (imageRow) {
    imageRow.classList.add('hero-overlay-image');
  } else {
    block.classList.add('no-image');
  }

  if (!contentRow) return;
  contentRow.classList.add('hero-overlay-content');

  const contentCell = contentRow.firstElementChild || contentRow;

  // Collect the CTA links (each authored as its own paragraph).
  const links = [...contentCell.querySelectorAll('a')];
  if (links.length) {
    const ctas = document.createElement('div');
    ctas.className = 'hero-overlay-ctas';
    links.forEach((link, i) => {
      link.classList.add('button');
      link.classList.add(i === 0 ? 'primary' : 'secondary');
      const p = link.closest('p');
      if (p && p.parentElement === contentCell) {
        // move the link out of its wrapping paragraph into the CTA row
        ctas.append(link);
        p.remove();
      } else {
        ctas.append(link);
      }
    });
    contentCell.append(ctas);
  }
}
