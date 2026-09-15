/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-anniversary. Base: columns.
 * Source: https://www.saga.co.uk/ (anniversary banner)
 * Structure: one row, multiple columns. Text/link column(s) + decorative image column(s).
 *
 * Source layout: a link wrapping "Celebrating" + a numeral image + "years of Saga",
 * followed by a separate decorative signifier image. We render the link (with its
 * text and numeral) as one column and the signifier image as a second column.
 */
export default function parse(element, { document }) {
  const row = [];

  // Column 1: the anniversary link (text + numeral image), kept intact & clickable
  const link = element.querySelector('.anniversary-banner__link, a');
  if (link) {
    // Normalise whitespace in the text nodes for clean output
    link.querySelectorAll('div').forEach((d) => {
      d.textContent = d.textContent.trim();
    });
    row.push(link);
  }

  // Column 2: the decorative signifier image (image-only column).
  // Grab any banner image that is NOT inside the link column above.
  let signifierImg = element.querySelector('.anniversary-banner__signifier img');
  if (!signifierImg) {
    signifierImg = Array.from(element.querySelectorAll('img'))
      .find((img) => !link || !link.contains(img));
  }
  if (signifierImg) {
    row.push(signifierImg);
  }

  if (row.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [row];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-anniversary', cells });
  element.replaceWith(block);
}
