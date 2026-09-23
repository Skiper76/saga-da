/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Saga site-wide cleanup.
 * Removes non-authorable site shell/chrome and overlays so the import contains
 * only page-level authorable content.
 *
 * All selectors verified against migration-work/cleaned.html:
 *  - div.sticky-newsletter        (line 2)    sticky newsletter popup
 *  - #adl_params                  (line 5)    analytics data-layer params
 *  - nav.meganav                  (line 11)   global header / mega navigation
 *  - footer.megafoot              (line 1452) global footer
 *  - div.dmpg-consent-overlay     (lines 1646, 1648) consent overlays
 *  - #onetrust-consent-sdk        (line 1650) OneTrust cookie consent
 *  - iframe#destination_publishing_iframe_sagagroup1_0 / .aamIframeLoaded (line 1644) Adobe ID sync iframe
 *  - iframe.ot-text-resize        (line 1928) OneTrust helper iframe
 *  - div.intercom-lightweight-app  known Saga site-shell chat widget; not present
 *    in this page's capture, included for site-wide reuse (no-op when absent).
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Overlays / cookie consent / widgets that block or interfere with block parsing.
    WebImporter.DOMUtils.remove(element, [
      '.sticky-newsletter',
      '#adl_params',
      '.dmpg-consent-overlay',
      '#onetrust-consent-sdk',
      '.intercom-lightweight-app',
      '#destination_publishing_iframe_sagagroup1_0',
      '.aamIframeLoaded',
      '.ot-text-resize',
      // Upscope automated-assistant / chat triage widget (site-shell, not content)
      '.chat-triage',
      // Breadcrumb trail — site chrome, not authorable content. Left in, its
      // JS-collapsed markup imports as a malformed <ol> (bare "…", empty <li>,
      // nested <ol>) that breaks the DA preview HTML→document conversion.
      'nav.breadcrumb',
      '.breadcrumb',
      '.breadcrumbs',
      'ol.breadcrumb__list',
      // Decorative marble divider. Its illustrative SVG is ~89KB, over DA's
      // 40KB per-image limit, which fails the preview (html2md) validation.
      // Purely ornamental, so drop it.
      '.marble-divider',
    ]);

    // The anniversary banner is a body-level sibling on every page. It is
    // authorable content ONLY on templates that map it to the columns-anniversary
    // block (the homepage). On other templates (e.g. the FAQ page) it is trailing
    // site chrome, so remove it there.
    const template = payload && payload.template;
    const usesAnniversary = template && Array.isArray(template.blocks)
      && template.blocks.some((b) => b.name === 'columns-anniversary');
    if (!usesAnniversary) {
      WebImporter.DOMUtils.remove(element, ['.anniversary-banner']);
    }
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable global chrome plus leftover embed/link elements.
    WebImporter.DOMUtils.remove(element, [
      'nav.meganav',
      'footer.megafoot',
      'iframe',
      'link',
      'noscript',
      'source',
    ]);
  }
}
