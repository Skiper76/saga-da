/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Saga magazine article scoping + cleanup.
 *
 * Magazine article pages (/magazine/<section>/<slug>) wrap the authorable
 * content in two stable containers:
 *   - `.article-header`        the hero: title, standfirst, hero image (+ credit)
 *   - `.sidebar-layout__main`  the article body: `.rich-text__article` prose
 *                              blocks and `figure.image` figures.
 *
 * Everything else is site chrome or recirculation: the magazine search form,
 * ad slots, the author bio box, social share bars, the right-hand sidebar, and
 * the trailing "Related articles" carousel. Some of those modules (notably the
 * carousel) are hydrated by JS *after* load and land as body-level siblings, so
 * removing them by selector is timing-dependent and unreliable.
 *
 * Instead we POSITIVELY SCOPE: on beforeTransform, extract the header + body
 * into a fresh container and make it the sole content of <body>. Anything that
 * hydrates later (outside those two containers) is discarded because it is no
 * longer in the tree. A light in-container cleanup then drops captions, tracking
 * pixels and placeholder anchors.
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

function cleanWithin(root, document) {
  WebImporter.DOMUtils.remove(root, [
    '.article-author',             // author bio card ("Written by: …") + socials
    '.article-header__socials',    // share bar under the hero
    '.article-header__meta',       // "By X | Published - ..." byline strip
    '.article-header__caption',    // hero image credit ("Getty")
    '.image__credit',              // figure credit
    '.google-ad-slot',             // ad placeholders
    '.promo-card-panel',           // inline "Win a cruise" promo + tracking pixel
    '.promo-card-heading',
    '.promo-card',
    'img[src*="bat.bing.com"]',    // Bing UET tracking pixel
    'img[src*="/action/0?"]',      // generic tracking-pixel images
    'script',
    'style',
  ]);

  // Placeholder anchors: JS-injected icon-only links (save/share) render as
  // <a href="#"> whose empty content WebImporter emits as "___".
  root.querySelectorAll('a[href="#"], a[href=""]').forEach((a) => {
    const text = (a.textContent || '').replace(/[_\s]/g, '');
    if (text === '') a.remove();
  });
}

export default function transform(hookName, element, payload) {
  if (hookName !== TransformHook.beforeTransform) return;

  const header = element.querySelector('.article-header');
  const body = element.querySelector('.sidebar-layout__main');

  // If the expected article structure isn't present, leave the DOM untouched
  // rather than guess — the import will surface the raw content for review.
  if (!header && !body) return;

  const scoped = document.createElement('div');
  if (header) scoped.appendChild(header.cloneNode(true));
  if (body) scoped.appendChild(body.cloneNode(true));

  cleanWithin(scoped, document);

  // Replace the entire page body with just the scoped article content.
  element.innerHTML = '';
  element.appendChild(scoped);
}
