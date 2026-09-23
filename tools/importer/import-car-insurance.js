/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroOverlayParser from './parsers/hero-overlay.js';
import anchorNavParser from './parsers/anchor-nav.js';
import accordionFaqParser from './parsers/accordion-faq.js';
import formParser from './parsers/form.js';
import carouselProductParser from './parsers/carousel-product.js';

// TRANSFORMER IMPORTS
import sagaCleanupTransformer from './transformers/saga-cleanup.js';
import sagaSectionsTransformer from './transformers/saga-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-overlay': heroOverlayParser,
  'anchor-nav': anchorNavParser,
  'accordion-faq': accordionFaqParser,
  form: formParser,
  'carousel-product': carouselProductParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'car-insurance',
  description: 'Saga car-insurance FAQ page: hero, in-page anchor nav, six grouped FAQ accordions, quote CTA, newsletter form, and a product carousel.',
  urls: [
    'https://www.saga.co.uk/car-insurance/faqs',
  ],
  blocks: [
    {
      name: 'hero-overlay',
      instances: ['body > main > div.hero.hero--shallow.hero--overlay-50', '.hero'],
    },
    {
      name: 'anchor-nav',
      instances: ['body > main > nav.anchor-nav', 'nav.anchor-nav'],
    },
    {
      name: 'accordion-faq',
      instances: ['.accordion.accordion--stacked', '.accordion'],
    },
    {
      name: 'form',
      instances: ['body > main > div:nth-of-type(12)'],
    },
    {
      name: 'carousel-product',
      instances: ['.card-carousel'],
    },
  ],
  sections: [
    { id: 'rc2', name: 'hero', selector: ['body > main > div.hero.hero--shallow.hero--overlay-50', '.hero'], style: null, blocks: ['hero-overlay'], defaultContent: [] },
    { id: 'rc3', name: 'anchor-nav', selector: ['body > main > nav.anchor-nav', 'nav.anchor-nav'], style: null, blocks: ['anchor-nav'], defaultContent: [] },
    { id: 'rc4', name: 'important-info', selector: ['body > main > div.container.container--sm:nth-of-type(2)'], style: 'notice', blocks: [], defaultContent: ['h2', 'p'] },
    { id: 'rc5', name: 'faq-intro', selector: ['body > main > div.container.container--sm:nth-of-type(3)'], style: null, blocks: [], defaultContent: ['h2', 'p'] },
    { id: 'rc6', name: 'faq-my-car-cover', selector: ['#anchor_Mycarcover'], style: null, blocks: ['accordion-faq'], defaultContent: ['h2'] },
    { id: 'rc7', name: 'faq-no-claims-discount', selector: ['#anchor_Noclaimsdiscount'], style: null, blocks: ['accordion-faq'], defaultContent: ['h2'] },
    { id: 'rc8', name: 'faq-getting-a-quote', selector: ['#anchor_Gettingaquote'], style: null, blocks: ['accordion-faq'], defaultContent: ['h2'] },
    { id: 'rc9', name: 'faq-claims', selector: ['#anchor_Claims'], style: null, blocks: ['accordion-faq'], defaultContent: ['h2'] },
    { id: 'rc10', name: 'faq-my-documents', selector: ['#anchor_Mydocuments'], style: null, blocks: ['accordion-faq'], defaultContent: ['h2'] },
    { id: 'rc11', name: 'faq-make-changes', selector: ['#anchor_Makechanges'], style: null, blocks: ['accordion-faq'], defaultContent: ['h2'] },
    { id: 'rc12', name: 'quote-cta', selector: ['body > main > div.container:nth-of-type(10)'], style: 'champagne', blocks: [], defaultContent: ['h2', 'p'] },
    { id: 'rc14', name: 'newsletter-signup', selector: ['body > main > div:nth-of-type(12)'], style: null, blocks: ['form'], defaultContent: ['h2', 'p'] },
    { id: 'rc15', name: 'more-from-saga', selector: ['.card-carousel'], style: null, blocks: ['carousel-product'], defaultContent: ['h2', 'p'] },
  ],
};

// TRANSFORMER REGISTRY - cleanup first, then section breaks (afterTransform)
const transformers = [
  sagaCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sagaSectionsTransformer] : []),
];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  const seen = new Set();
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        if (seen.has(element)) return;
        seen.add(element);
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const {
      document, url, html, params,
    } = payload;

    const main = document.body;

    // 1. beforeTransform cleanup
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. afterTransform cleanup + section breaks
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path (map root URL to /index)
    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
