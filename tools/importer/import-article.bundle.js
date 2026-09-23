/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-article.js
  var import_article_exports = {};
  __export(import_article_exports, {
    default: () => import_article_default
  });

  // tools/importer/transformers/saga-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".sticky-newsletter",
        "#adl_params",
        ".dmpg-consent-overlay",
        "#onetrust-consent-sdk",
        ".intercom-lightweight-app",
        "#destination_publishing_iframe_sagagroup1_0",
        ".aamIframeLoaded",
        ".ot-text-resize",
        // Upscope automated-assistant / chat triage widget (site-shell, not content)
        ".chat-triage"
      ]);
      const template = payload && payload.template;
      const usesAnniversary = template && Array.isArray(template.blocks) && template.blocks.some((b) => b.name === "columns-anniversary");
      if (!usesAnniversary) {
        WebImporter.DOMUtils.remove(element, [".anniversary-banner"]);
      }
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "nav.meganav",
        "footer.megafoot",
        "iframe",
        "link",
        "noscript",
        "source"
      ]);
    }
  }

  // tools/importer/transformers/saga-article.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function cleanWithin(root, document2) {
    WebImporter.DOMUtils.remove(root, [
      ".article-author",
      // author bio card ("Written by: …") + socials
      ".article-header__socials",
      // share bar under the hero
      ".article-header__meta",
      // "By X | Published - ..." byline strip
      ".article-header__caption",
      // hero image credit ("Getty")
      ".image__credit",
      // figure credit
      ".google-ad-slot",
      // ad placeholders
      ".promo-card-panel",
      // inline "Win a cruise" promo + tracking pixel
      ".promo-card-heading",
      ".promo-card",
      'img[src*="bat.bing.com"]',
      // Bing UET tracking pixel
      'img[src*="/action/0?"]',
      // generic tracking-pixel images
      "script",
      "style"
    ]);
    root.querySelectorAll('a[href="#"], a[href=""]').forEach((a) => {
      const text = (a.textContent || "").replace(/[_\s]/g, "");
      if (text === "") a.remove();
    });
  }
  function transform2(hookName, element, payload) {
    if (hookName !== TransformHook2.beforeTransform) return;
    const header = element.querySelector(".article-header");
    const body = element.querySelector(".sidebar-layout__main");
    if (!header && !body) return;
    const scoped = document.createElement("div");
    if (header) scoped.appendChild(header.cloneNode(true));
    if (body) scoped.appendChild(body.cloneNode(true));
    cleanWithin(scoped, document);
    element.innerHTML = "";
    element.appendChild(scoped);
  }

  // tools/importer/import-article.js
  var parsers = {};
  var PAGE_TEMPLATE = {
    name: "article",
    description: "Saga magazine article: hero (title, standfirst, hero image) followed by rich-text body prose and inline figures.",
    urls: [
      "https://www.saga.co.uk/magazine/health-and-wellbeing/food-combinations-you-should-avoid"
    ],
    blocks: [],
    sections: []
  };
  var transformers = [
    transform,
    transform2
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    const seen = /* @__PURE__ */ new Set();
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_article_default = {
    transform: (payload) => {
      const {
        document: document2,
        url,
        html,
        params
      } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      const metaBlock = WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const metaTable = metaBlock && /table/i.test(metaBlock.tagName || "") ? metaBlock : main.querySelector("table");
      if (metaTable) {
        const tr = document2.createElement("tr");
        const th = document2.createElement("td");
        th.textContent = "template";
        const td = document2.createElement("td");
        td.textContent = "article";
        tr.append(th, td);
        metaTable.append(tr);
      }
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_article_exports);
})();
