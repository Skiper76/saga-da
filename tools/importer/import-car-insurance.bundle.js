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

  // tools/importer/import-car-insurance.js
  var import_car_insurance_exports = {};
  __export(import_car_insurance_exports, {
    default: () => import_car_insurance_default
  });

  // tools/importer/parsers/hero-overlay.js
  function parse(element, { document: document2 }) {
    const cells = [];
    const bgImage = element.querySelector(".hero__image img, .hero__image-container img, img");
    if (bgImage) {
      cells.push([bgImage]);
    }
    const contentCell = [];
    const heading = element.querySelector(".hero__title, .hero__content h1, .hero__content h2, h1, h2");
    if (heading) {
      contentCell.push(heading);
    }
    const descWrap = element.querySelector(".hero__description");
    if (descWrap && descWrap.textContent.trim()) {
      const paras = descWrap.querySelectorAll("p");
      if (paras.length) {
        paras.forEach((p) => contentCell.push(p));
      } else {
        const p = document2.createElement("p");
        p.innerHTML = descWrap.innerHTML;
        contentCell.push(p);
      }
    }
    const ctaLinks = Array.from(
      element.querySelectorAll(".hero__ctas a, a.button")
    );
    ctaLinks.forEach((a) => {
      a.textContent = a.textContent.trim();
      contentCell.push(a);
    });
    if (contentCell.length) {
      cells.push([contentCell]);
    }
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-overlay", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/anchor-nav.js
  function parse2(element, { document: document2 }) {
    let links = Array.from(
      element.querySelectorAll(".anchor-nav__list a, .anchor-nav__item a")
    );
    if (links.length === 0) {
      links = Array.from(element.querySelectorAll('a[href^="#"]')).filter(
        (a) => !a.classList.contains("anchor-nav__top-link")
      );
    }
    if (links.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const list = document2.createElement("ul");
    links.forEach((a) => {
      a.classList.remove("active", "adl-anchorNav");
      a.querySelectorAll("img, svg").forEach((n) => n.remove());
      a.textContent = a.textContent.trim();
      const li = document2.createElement("li");
      li.append(a);
      list.append(li);
    });
    const cells = [[list]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "anchor-nav", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-faq.js
  function parse3(element, { document: document2 }) {
    const items = element.querySelectorAll(".accordion__item");
    const cells = [];
    items.forEach((item) => {
      const titleEl = item.querySelector(".accordion__title, .accordion__heading .accordion__title");
      const questionText = titleEl ? titleEl.textContent.trim() : "";
      const descEl = item.querySelector(".accordion__description");
      if (!questionText && !descEl) return;
      const questionCell = [];
      if (questionText) {
        const q = document2.createElement("p");
        q.textContent = questionText;
        questionCell.push(q);
      }
      const answerCell = [];
      if (descEl) {
        descEl.querySelectorAll('button, img[src^="data:"], svg').forEach((n) => n.remove());
        answerCell.push(...descEl.childNodes);
      }
      cells.push([
        questionCell.length ? questionCell : "",
        answerCell.length ? answerCell : ""
      ]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const headingEl = element.querySelector(".accordion__header h3, .accordion__header h2");
    let heading = null;
    if (headingEl && headingEl.textContent.trim()) {
      heading = document2.createElement("h3");
      heading.textContent = headingEl.textContent.trim();
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "accordion-faq", cells });
    element.replaceWith(block);
    if (heading) block.before(heading);
  }

  // tools/importer/parsers/form.js
  function parse4(element, { document: document2 }) {
    const cells = [];
    element.querySelectorAll(
      '.control-group__error-message, .alert, .recaptcha-error, [class*="error-message"]'
    ).forEach((n) => n.remove());
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

  // tools/importer/parsers/carousel-product.js
  function parse5(element, { document: document2 }) {
    const cards = element.querySelectorAll(
      ".card-carousel__slider .card, .card-carousel__carousel-container .card, .carousel .card"
    );
    const cells = [];
    cards.forEach((card) => {
      const img = card.querySelector(".card__image img, img");
      const contentCell = [];
      const linkEl = card.querySelector('.card__title a, a.expanded-link, a[class*="expanded-link"]');
      const href = linkEl ? linkEl.getAttribute("href") : "";
      const tagEl = card.querySelector('.card__label, .badge, [class*="label"]');
      if (tagEl && tagEl.textContent.trim()) {
        const tag = document2.createElement("p");
        tag.textContent = tagEl.textContent.trim();
        contentCell.push(tag);
      }
      const titleEl = card.querySelector(".card__title");
      const titleText = titleEl ? titleEl.textContent.trim() : "";
      if (titleText) {
        const heading = document2.createElement("h3");
        heading.textContent = titleText;
        contentCell.push(heading);
      }
      const bodyEl = card.querySelector(".card__body");
      if (bodyEl && bodyEl.textContent.trim()) {
        const paras = bodyEl.querySelectorAll("p");
        if (paras.length) {
          paras.forEach((p) => contentCell.push(p));
        } else {
          const p = document2.createElement("p");
          p.innerHTML = bodyEl.innerHTML;
          contentCell.push(p);
        }
      }
      if (href) {
        const cta = document2.createElement("a");
        cta.setAttribute("href", href);
        cta.textContent = titleText || linkEl.textContent.trim() || "Find out more";
        contentCell.push(cta);
      }
      if (!img && contentCell.length === 0) return;
      cells.push([img || "", contentCell.length ? contentCell : ""]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "carousel-product", cells });
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
        ".ot-text-resize",
        // Upscope automated-assistant / chat triage widget (site-shell, not content)
        ".chat-triage",
        // Breadcrumb trail — site chrome, not authorable content. Left in, its
        // JS-collapsed markup imports as a malformed <ol> (bare "…", empty <li>,
        // nested <ol>) that breaks the DA preview HTML→document conversion.
        "nav.breadcrumb",
        ".breadcrumb",
        ".breadcrumbs",
        "ol.breadcrumb__list",
        // Decorative marble divider. Its illustrative SVG is ~89KB, over DA's
        // 40KB per-image limit, which fails the preview (html2md) validation.
        // Purely ornamental, so drop it.
        ".marble-divider"
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

  // tools/importer/import-car-insurance.js
  var parsers = {
    "hero-overlay": parse,
    "anchor-nav": parse2,
    "accordion-faq": parse3,
    form: parse4,
    "carousel-product": parse5
  };
  var PAGE_TEMPLATE = {
    name: "car-insurance",
    description: "Saga car-insurance FAQ page: hero, in-page anchor nav, six grouped FAQ accordions, quote CTA, newsletter form, and a product carousel.",
    urls: [
      "https://www.saga.co.uk/car-insurance/faqs"
    ],
    blocks: [
      {
        name: "hero-overlay",
        instances: ["body > main > div.hero.hero--shallow.hero--overlay-50", ".hero"]
      },
      {
        name: "anchor-nav",
        instances: ["body > main > nav.anchor-nav", "nav.anchor-nav"]
      },
      {
        name: "accordion-faq",
        instances: [".accordion.accordion--stacked", ".accordion"]
      },
      {
        name: "form",
        instances: ["body > main > div:nth-of-type(12)"]
      },
      {
        name: "carousel-product",
        instances: [".card-carousel"]
      }
    ],
    sections: [
      { id: "rc2", name: "hero", selector: ["body > main > div.hero.hero--shallow.hero--overlay-50", ".hero"], style: null, blocks: ["hero-overlay"], defaultContent: [] },
      { id: "rc3", name: "anchor-nav", selector: ["body > main > nav.anchor-nav", "nav.anchor-nav"], style: null, blocks: ["anchor-nav"], defaultContent: [] },
      { id: "rc4", name: "important-info", selector: ["body > main > div.container.container--sm:nth-of-type(2)"], style: "notice", blocks: [], defaultContent: ["h2", "p"] },
      { id: "rc5", name: "faq-intro", selector: ["body > main > div.container.container--sm:nth-of-type(3)"], style: null, blocks: [], defaultContent: ["h2", "p"] },
      { id: "rc6", name: "faq-my-car-cover", selector: ["#anchor_Mycarcover"], style: null, blocks: ["accordion-faq"], defaultContent: ["h2"] },
      { id: "rc7", name: "faq-no-claims-discount", selector: ["#anchor_Noclaimsdiscount"], style: null, blocks: ["accordion-faq"], defaultContent: ["h2"] },
      { id: "rc8", name: "faq-getting-a-quote", selector: ["#anchor_Gettingaquote"], style: null, blocks: ["accordion-faq"], defaultContent: ["h2"] },
      { id: "rc9", name: "faq-claims", selector: ["#anchor_Claims"], style: null, blocks: ["accordion-faq"], defaultContent: ["h2"] },
      { id: "rc10", name: "faq-my-documents", selector: ["#anchor_Mydocuments"], style: null, blocks: ["accordion-faq"], defaultContent: ["h2"] },
      { id: "rc11", name: "faq-make-changes", selector: ["#anchor_Makechanges"], style: null, blocks: ["accordion-faq"], defaultContent: ["h2"] },
      { id: "rc12", name: "quote-cta", selector: ["body > main > div.container:nth-of-type(10)"], style: "champagne", blocks: [], defaultContent: ["h2", "p"] },
      { id: "rc14", name: "newsletter-signup", selector: ["body > main > div:nth-of-type(12)"], style: null, blocks: ["form"], defaultContent: ["h2", "p"] },
      { id: "rc15", name: "more-from-saga", selector: [".card-carousel"], style: null, blocks: ["carousel-product"], defaultContent: ["h2", "p"] }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
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
  var import_car_insurance_default = {
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
  return __toCommonJS(import_car_insurance_exports);
})();
