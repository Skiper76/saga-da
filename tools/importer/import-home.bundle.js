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

  // tools/importer/import-home.js
  var import_home_exports = {};
  __export(import_home_exports, {
    default: () => import_home_default
  });

  // tools/importer/parsers/cards-promo.js
  function parse(element, { document: document2 }) {
    const cards = element.querySelectorAll(".campaign-pod, .card");
    const cells = [];
    cards.forEach((card) => {
      const img = card.querySelector(".card__image img, img");
      const bodyCell = [];
      const titleEl = card.querySelector(".card__title, h1, h2, h3, h4, h5, h6");
      if (titleEl) {
        let level = "h3";
        const m = (titleEl.className || "").match(/\bh([1-6])\b/);
        if (m) level = `h${m[1]}`;
        else if (/^h[1-6]$/i.test(titleEl.tagName)) level = titleEl.tagName.toLowerCase();
        const heading = document2.createElement(level);
        heading.textContent = titleEl.textContent.trim();
        bodyCell.push(heading);
      }
      const bodyEl = card.querySelector(".card__body");
      if (bodyEl) {
        const p = document2.createElement("p");
        p.innerHTML = bodyEl.innerHTML;
        bodyCell.push(p);
      }
      const cta = card.querySelector('a.card__cta, .card__cta, a[class*="cta"]');
      if (cta) {
        cta.textContent = cta.textContent.trim();
        bodyCell.push(cta);
      }
      if (!img && bodyCell.length === 0) return;
      cells.push([img || "", bodyCell]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-promo", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-nav.js
  function parse2(element, { document: document2 }) {
    const tiles = element.querySelectorAll(".nav-tiles__tile");
    const cells = [];
    tiles.forEach((tile) => {
      const icon = tile.querySelector(":scope > img, img");
      const bodyCell = [];
      const titleEl = tile.querySelector(".nav-tiles__title");
      if (titleEl) {
        const heading = document2.createElement("h3");
        heading.textContent = titleEl.textContent.trim();
        bodyCell.push(heading);
      }
      const bodyEl = tile.querySelector(".nav-tiles__body");
      if (bodyEl) {
        const p = document2.createElement("p");
        p.innerHTML = bodyEl.innerHTML;
        bodyCell.push(p);
      }
      const cta = tile.querySelector('a.nav-tiles__cta, a[class*="cta"], a.button');
      if (cta) {
        cta.textContent = cta.textContent.trim();
        bodyCell.push(cta);
      }
      if (!icon && bodyCell.length === 0) return;
      cells.push([icon || "", bodyCell]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-nav", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-feature.js
  function parse3(element, { document: document2 }) {
    const cards = element.querySelectorAll(".campaign-pod, .card");
    const cells = [];
    cards.forEach((card) => {
      const img = card.querySelector(".card__image img, img");
      const bodyCell = [];
      const titleEl = card.querySelector(".card__title, h1, h2, h3, h4, h5, h6");
      if (titleEl) {
        let level = "h3";
        const m = (titleEl.className || "").match(/\bh([1-6])\b/);
        if (m) level = `h${m[1]}`;
        else if (/^h[1-6]$/i.test(titleEl.tagName)) level = titleEl.tagName.toLowerCase();
        const heading = document2.createElement(level);
        heading.textContent = titleEl.textContent.trim();
        bodyCell.push(heading);
      }
      const bodyEl = card.querySelector(".card__body");
      if (bodyEl) {
        const p = document2.createElement("p");
        p.innerHTML = bodyEl.innerHTML;
        bodyCell.push(p);
      }
      const cta = card.querySelector('a.card__cta, .card__cta, a[class*="cta"]');
      if (cta) {
        cta.textContent = cta.textContent.trim();
        bodyCell.push(cta);
      }
      if (!img && bodyCell.length === 0) return;
      cells.push([img || "", bodyCell]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  function parse4(element, { document: document2 }) {
    const cards = element.querySelectorAll(".mag-article-feed__card, .card");
    const cells = [];
    cards.forEach((card) => {
      const img = card.querySelector(".card__image img, img");
      const bodyCell = [];
      const labelEl = card.querySelector(".card__label, .badge");
      if (labelEl && labelEl.textContent.trim()) {
        const p = document2.createElement("p");
        p.textContent = labelEl.textContent.trim();
        bodyCell.push(p);
      }
      const titleLink = card.querySelector(".card__title a, a.expanded-link");
      if (titleLink) {
        const heading = document2.createElement("h3");
        const a = document2.createElement("a");
        a.href = titleLink.getAttribute("href");
        a.textContent = titleLink.textContent.trim();
        heading.append(a);
        bodyCell.push(heading);
      } else {
        const titleEl = card.querySelector(".card__title");
        if (titleEl && titleEl.textContent.trim()) {
          const heading = document2.createElement("h3");
          heading.textContent = titleEl.textContent.trim();
          bodyCell.push(heading);
        }
      }
      if (!img && bodyCell.length === 0) return;
      cells.push([img || "", bodyCell]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-award.js
  function parse5(element, { document: document2 }) {
    const badges = element.querySelectorAll(".trust-panel__logo-item, .trust-panel__logos a");
    const cells = [];
    badges.forEach((badge) => {
      const img = badge.querySelector("img");
      if (!img) return;
      const href = badge.getAttribute("href");
      let imageCellContent = img;
      if (href) {
        const a = document2.createElement("a");
        a.href = href;
        a.append(img);
        imageCellContent = a;
      }
      const bodyCell = [];
      const caption = (img.getAttribute("alt") || "").trim();
      if (caption) {
        const p = document2.createElement("p");
        p.textContent = caption;
        bodyCell.push(p);
      }
      cells.push([imageCellContent, bodyCell]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-award", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/form.js
  function parse6(element, { document: document2 }) {
    const cells = [];
    const introCell = [];
    const title = element.querySelector(".form-subscribe__title, h1, h2, h3");
    if (title) {
      const h = document2.createElement("h3");
      h.textContent = title.textContent.trim();
      introCell.push(h);
    }
    const lead = element.querySelector(".form-subscribe__content > p, .form-subscribe__content p");
    if (lead && lead.textContent.trim()) {
      const p = document2.createElement("p");
      p.textContent = lead.textContent.trim();
      introCell.push(p);
    }
    if (introCell.length) cells.push([introCell]);
    const fieldGroups = element.querySelectorAll(".control-group");
    fieldGroups.forEach((group) => {
      const input = group.querySelector("input");
      const labelEl = group.querySelector(".control-group__label, label");
      if (!input) return;
      let label = ((labelEl == null ? void 0 : labelEl.textContent) || "").replace(/\*/g, "").trim();
      if (!label) return;
      let inputType = (input.getAttribute("type") || "").trim().toLowerCase();
      if (!inputType) {
        if (/email/i.test(input.id) || /email/i.test(label)) inputType = "email";
        else inputType = "text";
      }
      cells.push(["field", label, inputType]);
    });
    const submitBtn = element.querySelector('button[type="submit"], #PageFormSubmitBtn, button');
    if (submitBtn) {
      const btnLabel = submitBtn.textContent.replace(/\s+/g, " ").trim() || "Sign up";
      cells.push(["submit", btnLabel, ""]);
    }
    const smallText = element.querySelector(".small-text");
    if (smallText) {
      const noteCell = [];
      smallText.querySelectorAll("p").forEach((p) => {
        const np = document2.createElement("p");
        np.innerHTML = p.innerHTML;
        noteCell.push(np);
      });
      if (noteCell.length) cells.push([noteCell]);
    }
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "form", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-anniversary.js
  function parse7(element, { document: document2 }) {
    const row = [];
    const link = element.querySelector(".anniversary-banner__link, a");
    if (link) {
      link.querySelectorAll("div").forEach((d) => {
        d.textContent = d.textContent.trim();
      });
      row.push(link);
    }
    let signifierImg = element.querySelector(".anniversary-banner__signifier img");
    if (!signifierImg) {
      signifierImg = Array.from(element.querySelectorAll("img")).find((img) => !link || !link.contains(img));
    }
    if (signifierImg) {
      row.push(signifierImg);
    }
    if (row.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [row];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-anniversary", cells });
    element.replaceWith(block);
  }

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
        ".ot-text-resize"
      ]);
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

  // tools/importer/transformers/saga-sections.js
  var SECTION_MARKER_ATTR = "data-excat-section-id";
  function querySection(root, selectors) {
    for (const sel of selectors) {
      const el = root.querySelector(sel);
      if (el) return el;
    }
    return null;
  }
  function transform2(hookName, element, payload) {
    const sections = payload.template.sections || [];
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (i === 0 && !section.style) continue;
        const sectionEl = querySection(element, section.selector);
        if (!sectionEl) continue;
        const hr = document.createElement("hr");
        if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
        sectionEl.before(hr);
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section.style) continue;
        const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
        const anchor = marker || querySection(element, section.selector);
        if (!anchor) continue;
        const metadataBlock = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        anchor.after(metadataBlock);
        if (marker) {
          marker.removeAttribute(SECTION_MARKER_ATTR);
          if (i === 0) marker.remove();
        }
      }
    }
  }

  // tools/importer/import-home.js
  var parsers = {
    "cards-promo": parse,
    "cards-nav": parse2,
    "cards-feature": parse3,
    "cards-article": parse4,
    "cards-award": parse5,
    form: parse6,
    "columns-anniversary": parse7
  };
  var PAGE_TEMPLATE = {
    name: "home",
    description: "Saga homepage: promotional pods, navigation tiles, feature promos, latest articles, awards/trust panel, newsletter form, and anniversary banner.",
    urls: [
      "https://www.saga.co.uk/"
    ],
    blocks: [
      {
        name: "cards-promo",
        instances: ["body > main > div.container:nth-of-type(1)"]
      },
      {
        name: "cards-nav",
        instances: [".nav-tiles__container", ".nav-tiles"]
      },
      {
        name: "cards-feature",
        instances: ["body > main > div.container:nth-of-type(3)"]
      },
      {
        name: "cards-article",
        instances: ["body > main > div.container:nth-of-type(4)"]
      },
      {
        name: "cards-award",
        instances: [".trust-panel"]
      },
      {
        name: "form",
        instances: ["body > main > div:nth-of-type(6)"]
      },
      {
        name: "columns-anniversary",
        instances: [".anniversary-banner"]
      }
    ],
    sections: [
      {
        id: "rc2",
        name: "promo-pods",
        selector: ["body > main > div.container:nth-of-type(1)"],
        style: null,
        blocks: ["cards-promo"],
        defaultContent: []
      },
      {
        id: "rc3",
        name: "nav-tiles",
        selector: [".nav-tiles"],
        style: null,
        blocks: ["cards-nav"],
        defaultContent: []
      },
      {
        id: "rc4",
        name: "feature-promos",
        selector: ["body > main > div.container:nth-of-type(3)"],
        style: null,
        blocks: ["cards-feature"],
        defaultContent: []
      },
      {
        id: "rc5",
        name: "latest-articles",
        selector: ["body > main > div.container:nth-of-type(4)"],
        style: null,
        blocks: ["cards-article"],
        defaultContent: ["h2", "p"]
      },
      {
        id: "rc6",
        name: "trust-panel",
        selector: [".trust-panel"],
        style: null,
        blocks: ["cards-award"],
        defaultContent: ["h2", "p"]
      },
      {
        id: "rc7",
        name: "newsletter",
        selector: ["body > main > div:nth-of-type(6)"],
        style: null,
        blocks: ["form"],
        defaultContent: []
      },
      {
        id: "rc8",
        name: "anniversary-banner",
        selector: [".anniversary-banner"],
        style: null,
        blocks: ["columns-anniversary"],
        defaultContent: []
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
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
  var import_home_default = {
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
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
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
  return __toCommonJS(import_home_exports);
})();
