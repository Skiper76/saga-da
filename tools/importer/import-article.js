/* eslint-disable */
/* global WebImporter */

// TRANSFORMER IMPORTS
import sagaCleanupTransformer from './transformers/saga-cleanup.js';
import sagaArticleTransformer from './transformers/saga-article.js';

// PARSER REGISTRY — articles are pure default content (no blocks).
const parsers = {};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'article',
  description: 'Saga magazine article: hero (title, standfirst, hero image) followed by rich-text body prose and inline figures.',
  urls: [
    'https://www.saga.co.uk/magazine/health-and-wellbeing/food-combinations-you-should-avoid',
  ],
  blocks: [],
  sections: [],
};

// TRANSFORMER REGISTRY — site-wide cleanup, then article scoping.
const transformers = [
  sagaCleanupTransformer,
  sagaArticleTransformer,
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
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

    // 1. beforeTransform cleanup (site-wide chrome + article scoping)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page (none for articles)
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

    // 4. afterTransform cleanup
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    const metaBlock = WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 5b. Tag the page as the "article" template so the EDS boilerplate adds
    // `class="article"` to <body>, enabling article-specific reading typography.
    // createMetadata builds a <table>; append a matching <tr><td>…</td></tr> row
    // (a div row would be dropped by the DA serializer, which walks table rows).
    const metaTable = (metaBlock && /table/i.test(metaBlock.tagName || ''))
      ? metaBlock
      : main.querySelector('table');
    if (metaTable) {
      // lowercase key so the EDS boilerplate's getMetadata('template') matches
      // (custom metadata keys are emitted verbatim as the meta[name]).
      const tr = document.createElement('tr');
      const th = document.createElement('td');
      th.textContent = 'template';
      const td = document.createElement('td');
      td.textContent = 'article';
      tr.append(th, td);
      metaTable.append(tr);
    }

    // 6. Generate sanitized path from the article URL (keeps /magazine/... tree)
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
