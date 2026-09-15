/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import cardsPromoParser from './parsers/cards-promo.js';
import cardsNavParser from './parsers/cards-nav.js';
import cardsFeatureParser from './parsers/cards-feature.js';
import cardsArticleParser from './parsers/cards-article.js';
import cardsAwardParser from './parsers/cards-award.js';
import formParser from './parsers/form.js';
import columnsAnniversaryParser from './parsers/columns-anniversary.js';

// TRANSFORMER IMPORTS
import sagaCleanupTransformer from './transformers/saga-cleanup.js';
import sagaSectionsTransformer from './transformers/saga-sections.js';

// PARSER REGISTRY
const parsers = {
  'cards-promo': cardsPromoParser,
  'cards-nav': cardsNavParser,
  'cards-feature': cardsFeatureParser,
  'cards-article': cardsArticleParser,
  'cards-award': cardsAwardParser,
  form: formParser,
  'columns-anniversary': columnsAnniversaryParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'home',
  description: 'Saga homepage: promotional pods, navigation tiles, feature promos, latest articles, awards/trust panel, newsletter form, and anniversary banner.',
  urls: [
    'https://www.saga.co.uk/',
  ],
  blocks: [
    {
      name: 'cards-promo',
      instances: ['body > main > div.container:nth-of-type(1)'],
    },
    {
      name: 'cards-nav',
      instances: ['.nav-tiles__container', '.nav-tiles'],
    },
    {
      name: 'cards-feature',
      instances: ['body > main > div.container:nth-of-type(3)'],
    },
    {
      name: 'cards-article',
      instances: ['body > main > div.container:nth-of-type(4)'],
    },
    {
      name: 'cards-award',
      instances: ['.trust-panel'],
    },
    {
      name: 'form',
      instances: ['body > main > div:nth-of-type(6)'],
    },
    {
      name: 'columns-anniversary',
      instances: ['.anniversary-banner'],
    },
  ],
  sections: [
    {
      id: 'rc2', name: 'promo-pods', selector: ['body > main > div.container:nth-of-type(1)'], style: null, blocks: ['cards-promo'], defaultContent: [],
    },
    {
      id: 'rc3', name: 'nav-tiles', selector: ['.nav-tiles'], style: null, blocks: ['cards-nav'], defaultContent: [],
    },
    {
      id: 'rc4', name: 'feature-promos', selector: ['body > main > div.container:nth-of-type(3)'], style: null, blocks: ['cards-feature'], defaultContent: [],
    },
    {
      id: 'rc5', name: 'latest-articles', selector: ['body > main > div.container:nth-of-type(4)'], style: null, blocks: ['cards-article'], defaultContent: ['h2', 'p'],
    },
    {
      id: 'rc6', name: 'trust-panel', selector: ['.trust-panel'], style: null, blocks: ['cards-award'], defaultContent: ['h2', 'p'],
    },
    {
      id: 'rc7', name: 'newsletter', selector: ['body > main > div:nth-of-type(6)'], style: null, blocks: ['form'], defaultContent: [],
    },
    {
      id: 'rc8', name: 'anniversary-banner', selector: ['.anniversary-banner'], style: null, blocks: ['columns-anniversary'], defaultContent: [],
    },
  ],
};

// TRANSFORMER REGISTRY - cleanup first, then section breaks (afterTransform)
const transformers = [
  sagaCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sagaSectionsTransformer] : []),
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
        if (seen.has(element)) return; // avoid double-processing across union selectors
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
      if (!block.element.parentNode) return; // already replaced by an earlier parser
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
