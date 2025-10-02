(function CF_Template() {
  // Test Configuration
  let testInfo = {
    name: `CF 01 - Salespage: Replace Hero Image (Desktop + Mobile)`,
  };

  // Initialize test and exit if already running
  let testInitiated = initTest(testInfo);
  if (!testInitiated) return false;

  // Constants for this variant
  const NEW_HERO_URL = 'https://cdn.coframe.com/assets/memoryair/Product-Image-hero-9a0ccef7-64e0-4ffd-94da-19ff60e11d6e.webp';
  // Tokens that identify the current desktop and mobile hero images
  const OLD_DESKTOP_TOKEN = '5izbin-memoryair2-night-02';
  const OLD_MOBILE_TOKEN = 'vita-health-product-mobile-hero';

  // Main Code
  addStyling(); // OPTIONAL CSS to ensure background images display nicely
  monitorChangesByConditionAndRun(checkForElements, onElementsFound, false);

  // === MAIN FUNCTIONS ===

  function onElementsFound() {
    try {
      console.log(`Running Code for: `, testInfo.name, testInfo);
      document.querySelector(`body`)?.setAttribute(`cf-test-active`, testInfo.name);

      // Perform replacements for all <img>, <source>, and elements with background images
      const replacedCount = replaceHeroImagesEverywhere();

      if (replacedCount > 0) {
        console.log(`[${testInfo.name}] Replaced ${replacedCount} hero asset(s).`);

        // Inform Coframe SDK variant has successfully finished rendering
        window.CFQ = window.CFQ || [];
        window.CFQ.push({ emit: 'variantRendered' });
      } else {
        console.warn(`[${testInfo.name}] No matching hero assets found to replace yet.`);
      }
    } catch (e) {
      console.error(`[${testInfo.name}] Error while applying changes:`, e);
    }
  }

  function checkForElements() {
    // Wait until the target (old hero) images are present in the DOM (either <img>/<source> or bg-image)
    try {
      const cfDefined = typeof window.CF !== "undefined";

      const testActiveSelector = `body[cf-test-active="${testInfo.name}"]`;
      const testActiveElem = document.querySelector(testActiveSelector);
      const testActiveAbsent = !testActiveElem;

      // Look for <img> or <source> elements that include the old hero tokens
      const tokenSelector = [
        `img[src*="${OLD_DESKTOP_TOKEN}"]`,
        `img[src*="${OLD_MOBILE_TOKEN}"]`,
        `source[srcset*="${OLD_DESKTOP_TOKEN}"]`,
        `source[srcset*="${OLD_MOBILE_TOKEN}"]`,
        // Inline style background-image matches (common in builders)
        `[style*="${OLD_DESKTOP_TOKEN}"]`,
        `[style*="${OLD_MOBILE_TOKEN}"]`,
      ].join(',');

      const directMatch = document.querySelector(tokenSelector);

      // If not found via attributes, sample common container elements and check computed style for background-image
      let computedMatch = false;
      if (!directMatch) {
        const bgCandidates = Array.from(
          document.querySelectorAll(
            'div, section, header, main, a, span, figure, picture, .lp-element, .lp-pom-image, .lp-pom-image-container'
          )
        ).slice(0, 300); // performance guard
        computedMatch = bgCandidates.some((el) => {
          const bg = (getComputedStyle(el).backgroundImage || '').toLowerCase();
          return bg.includes(OLD_DESKTOP_TOKEN.toLowerCase()) || bg.includes(OLD_MOBILE_TOKEN.toLowerCase());
        });
      }

      const ready = cfDefined && testActiveAbsent && (directMatch || computedMatch);
      // Debug logs
      console.log("Check: typeof window.CF !== 'undefined' =>", cfDefined);
      console.log(`Check: !document.querySelector('${testActiveSelector}') =>`, testActiveAbsent);
      console.log("Check: directMatch found =>", !!directMatch, " | computedMatch =>", computedMatch);

      return ready;
    } catch (e) {
      console.error("Check error:", e);
      return false;
    }
  }

  // === HELPER / APPLY FUNCTIONS ===

  function replaceHeroImagesEverywhere() {
    let replaced = 0;

    // Utility: determine if a URL string contains any of the old tokens
    const hasOldToken = (url) => {
      if (!url) return false;
      const u = String(url).toLowerCase();
      return u.includes(OLD_DESKTOP_TOKEN.toLowerCase()) || u.includes(OLD_MOBILE_TOKEN.toLowerCase());
    };

    // 1) Replace <img> src and srcset
    const imgs = Array.from(document.querySelectorAll('img'));
    imgs.forEach((img) => {
      try {
        const matchesSrc = hasOldToken(img.currentSrc || img.src);
        const matchesSrcset = hasOldToken(img.srcset);
        const already = img.dataset.cfHeroReplaced === 'true' || (img.src && img.src === NEW_HERO_URL);

        if ((matchesSrc || matchesSrcset) && !already) {
          img.src = NEW_HERO_URL;
          // Overwrite srcset to a single candidate to avoid browser swapping back
          img.srcset = `${NEW_HERO_URL} 1000w`;
          // Optional: ensure display nicely if dimensions differ
          img.style.objectFit = img.style.objectFit || 'cover';
          img.dataset.cfHeroReplaced = 'true';
          img.classList.add('cf-hero-replaced-img');
          replaced++;
        }
      } catch (e) {
        console.warn(`[${testInfo.name}] Could not replace an <img>:`, e, img);
      }
    });

    // 2) Replace <source> elements within <picture>
    const sources = Array.from(document.querySelectorAll('source'));
    sources.forEach((source) => {
      try {
        const srcset = source.getAttribute('srcset') || '';
        const already = source.dataset.cfHeroReplaced === 'true' || srcset === NEW_HERO_URL;
        if (hasOldToken(srcset) && !already) {
          source.setAttribute('srcset', NEW_HERO_URL);
          source.dataset.cfHeroReplaced = 'true';
          source.classList.add('cf-hero-replaced-source');
          replaced++;
        }
      } catch (e) {
        console.warn(`[${testInfo.name}] Could not replace a <source>:`, e, source);
      }
    });

    // 3) Replace background-image on elements (inline or computed from stylesheets)
    const allCandidates = Array.from(
      document.querySelectorAll(
        'div, section, header, main, a, span, figure, picture, .lp-element, .lp-pom-image, .lp-pom-image-container, [style*="background"]'
      )
    );
    allCandidates.forEach((el) => {
      try {
        const styleBg = (el.style && el.style.backgroundImage) ? el.style.backgroundImage : '';
        const compBg = (getComputedStyle(el).backgroundImage || '');
        const already = el.classList.contains('cf-hero-replaced-bg') || compBg.includes(NEW_HERO_URL) || styleBg.includes(NEW_HERO_URL);

        const matches = hasOldToken(styleBg) || hasOldToken(compBg);
        if (matches && !already) {
          // Force background replacement with !important to override inline/CSS rules
          el.style.setProperty('background-image', `url("${NEW_HERO_URL}")`, 'important');
          // Add supportive properties only if not already set
          if (!getComputedStyle(el).backgroundSize || getComputedStyle(el).backgroundSize === 'auto auto') {
            el.style.setProperty('background-size', 'cover', 'important');
          }
          if (!getComputedStyle(el).backgroundPosition || getComputedStyle(el).backgroundPosition === '0% 0%') {
            el.style.setProperty('background-position', 'center center', 'important');
          }
          if (!getComputedStyle(el).backgroundRepeat || getComputedStyle(el).backgroundRepeat === 'repeat') {
            el.style.setProperty('background-repeat', 'no-repeat', 'important');
          }

          el.classList.add('cf-hero-replaced-bg');
          replaced++;
        }
      } catch (e) {
        console.warn(`[${testInfo.name}] Could not replace a background-image:`, e, el);
      }
    });

    return replaced;
  }

  // OPTIONAL: If you need to add CSS, add it like this.
  function addStyling() {
    let cssArray = [
      {
        desc: `Ensure replaced hero backgrounds look correct`,
        css: `
          .cf-hero-replaced-bg {
            /* Helpful defaults for swapped hero backgrounds */
            background-size: cover !important;
            background-position: center center !important;
            background-repeat: no-repeat !important;
          }
          .cf-hero-replaced-img {
            /* Maintain coverage for imgs that previously relied on bg positioning */
            width: 100%;
            height: auto;
          }
        `,
      },
    ];

    cssArray.forEach(({ desc, css }) => {
      let newStyleElem = document.createElement(`style`);
      newStyleElem.dataset.desc = desc;
      newStyleElem.innerHTML = css;
      document.head.insertAdjacentElement(`beforeend`, newStyleElem);
    });
  }

  function monitorChangesByConditionAndRun(check, code, keepChecking = false) {
    let checkAndRun = () =>
      check() && (!keepChecking && observer.disconnect(), code());
    var observer = new MutationObserver(checkAndRun);
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
    checkAndRun(); // Run once immediately

    // 10s observer killswitch
    if (!keepChecking) setTimeout(() => observer.disconnect(), 10000);
  }

  function initTest() {
    // Obtain or Create Object For Tests
    let cfObj = window.CF || { qaTesting: false, testsRunning: [] };

    // Check Whether Test Is Already Running
    if (cfObj.testsRunning.find((test) => test.name == testInfo.name)) {
      console.warn(`The following test is already running: `, testInfo);
      return false;
    }

    // Add Test to List of Running Tests
    cfObj.testsRunning = [...cfObj.testsRunning, testInfo];

    // Update Global Object
    window.CF = { ...window.CF, ...cfObj };

    return { ...window.CF };
  }
})();