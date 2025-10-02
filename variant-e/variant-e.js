(function CF_Template() {
  // Test Configuration
  let testInfo = {
    name: `CF 01 - Salespage: Replace subheadline with benefits list`,
  };

  // Initialize test and exit if already running
  let testInitiated = initTest(testInfo);
  if (!testInitiated) return false;

  // Add styles up-front (safe to add multiple times; styles are deduped by dataset desc)
  addStyling();

  // Wait for required elements to exist before applying changes
  monitorChangesByConditionAndRun(checkForElements, onElementsFound);

  // === MAIN FUNCTIONS ===

  function onElementsFound() {
    try {
      console.log(`Running Code for: `, testInfo.name, testInfo);
      const body = document.querySelector(`body`);
      if (!body) {
        console.error(`[${testInfo.name}] <body> not found. Aborting.`);
        return;
      }

      // Targets for desktop and mobile subheadline paragraphs
      const desktopTarget = document.querySelector('#lp-pom-text-422');
      const mobileTarget = document.querySelector('#lp-pom-text-118');

      // Build the benefits list markup (idempotent marker class: .cf-benefit-list)
      const benefitsHTML = buildBenefitsListHTML();

      let appliedCount = 0;
      let repositionedCount = 0;

      // Helper to safely replace content if not already applied
      const applyToTarget = (el, buttonSelector) => {
        if (!el) return false;
        // If already applied, skip re-injecting but still try to reposition button
        let justApplied = false;
        if (!el.querySelector('.cf-benefit-list')) {
          el.innerHTML = benefitsHTML;
          el.setAttribute('data-cf-benefits-applied', 'true');
          appliedCount++;
          justApplied = true;
        }

        // After ensuring the list exists, dynamically reposition the related button below the list
        const listEl = el.querySelector('.cf-benefit-list');
        const buttonEl = document.querySelector(buttonSelector);
        const repositioned = initDynamicButtonReposition(listEl, buttonEl);
        if (repositioned) repositionedCount++;

        return justApplied || repositioned;
      };

      // Apply to desktop and mobile variants when present, then reposition their respective buttons
      const desktopDidSomething = applyToTarget(desktopTarget, '#lp-pom-button-423');
      const mobileDidSomething = applyToTarget(mobileTarget, '#lp-pom-button-115');

      if (!desktopDidSomething && !mobileDidSomething) {
        console.warn(`[${testInfo.name}] No targets updated. Required elements might be missing or already updated.`);
        return; // Do not emit variantRendered if nothing changed
      }

      // Mark test active for idempotency
      body.setAttribute(`cf-test-active`, testInfo.name);

      // Ensure at least one set of elements has been correctly updated AND repositioned
      if (appliedCount === 0 && repositionedCount === 0) {
        console.warn(`[${testInfo.name}] Benefits not applied and buttons not repositioned. Not emitting variantRendered.`);
        return;
      }

      // Inform Coframe SDK variant has successfully finished rendering
      window.CFQ = window.CFQ || [];
      window.CFQ.push({ emit: 'variantRendered' });
    } catch (e) {
      console.error(`[${testInfo.name}] Unexpected error during onElementsFound:`, e);
      // Do NOT emit variantRendered on error
    }
  }

  function checkForElements() {
    // Check for required elements before running code
    try {
      const cfDefined = typeof window.CF !== "undefined";
      console.log("Check: typeof window.CF !== 'undefined' =>", cfDefined);

      const testActiveSelector = `body[cf-test-active="${testInfo.name}"]`;
      const testActiveElem = document.querySelector(testActiveSelector);
      const testActiveAbsent = !testActiveElem;
      console.log(`Check: !document.querySelector('${testActiveSelector}') =>`, testActiveAbsent);

      // Specific targets for desktop and mobile subheadline replacements
      const desktopTarget = document.querySelector('#lp-pom-text-422');
      const mobileTarget = document.querySelector('#lp-pom-text-118');

      const desktopNeedsUpdate = !!(desktopTarget && !desktopTarget.querySelector('.cf-benefit-list'));
      const mobileNeedsUpdate = !!(mobileTarget && !mobileTarget.querySelector('.cf-benefit-list'));

      console.log('Check: desktopNeedsUpdate =>', desktopNeedsUpdate);
      console.log('Check: mobileNeedsUpdate =>', mobileNeedsUpdate);

      // Proceed when at least one target exists and needs updating
      return cfDefined && testActiveAbsent && (desktopNeedsUpdate || mobileNeedsUpdate);
    } catch (e) {
      console.error("Check error:", e);
      return false;
    }
  }

  // === HELPER FUNCTIONS ===

  // Build the benefits list HTML with icons to the left of each item
  function buildBenefitsListHTML() {
    // Inline SVG icon (modern check-circle) used for each benefit item
    const iconSvg = `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path fill="currentColor" d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2zm4.707 8.293-5.657 5.657a1 1 0 0 1-1.414 0L7.293 13.607a1 1 0 1 1 1.414-1.414l1.586 1.586 4.95-4.95a1 1 0 1 1 1.414 1.414z"/>
      </svg>
    `;

    const benefits = [
      'Enhance cognitive function',
      'Sleep deeper, wake sharper',
      'Backed by neuroscience',
      'Effortless nightly therapy',
    ];

    const items = benefits
      .map(
        (text) => `
        <li class="cf-benefit-item">
          <span class="cf-benefit-icon">${iconSvg}</span>
          <span class="cf-benefit-text">${text}</span>
        </li>`
      )
      .join('');

    // The UL is intentionally inline-block so it can be centered within varying container widths
    return `
      <ul class="cf-benefit-list" role="list" aria-label="Key benefits">
        ${items}
      </ul>
    `;
  }

  // Initialize dynamic repositioning for a button relative to the benefits list
  // - Measures the bottom of the .cf-benefit-list
  // - Places the button directly below with a 30px margin
  // - Adds responsive listeners to keep it correct on resize/orientation change
  function initDynamicButtonReposition(listEl, buttonEl, margin = 30) {
    try {
      if (!listEl || !buttonEl) {
        console.warn(`[${testInfo.name}] Reposition skipped (listEl or buttonEl missing).`, { listEl, buttonEl });
        return false;
      }

      // Prevent attaching multiple listeners on reruns (idempotent)
      if (buttonEl.dataset.cfRepositionAttached === 'true') {
        // Still run at least once to ensure placement remains correct
        repositionButtonBelowList(listEl, buttonEl, margin);
        return true;
      }

      const handler = debounce(() => {
        repositionButtonBelowList(listEl, buttonEl, margin);
      }, 50);

      // Initial run(s) to catch any async layout shifts
      handler();
      requestAnimationFrame(handler);
      setTimeout(handler, 200);

      // Attach listeners for responsiveness
      window.addEventListener('resize', handler);
      window.addEventListener('orientationchange', handler);
      window.addEventListener('load', handler);

      // Mark as attached so we don't duplicate listeners
      buttonEl.dataset.cfRepositionAttached = 'true';

      return true;
    } catch (e) {
      console.error(`[${testInfo.name}] initDynamicButtonReposition error:`, e);
      return false;
    }
  }

  // Core math for setting absolute 'top' of the button relative to its offsetParent
  function repositionButtonBelowList(listEl, buttonEl, margin = 30) {
    if (!listEl || !buttonEl) return;

    const listRect = listEl.getBoundingClientRect();
    const btnParent = buttonEl.offsetParent || document.body;
    const parentRect = btnParent.getBoundingClientRect();

    // Calculate target top relative to the button's offset parent
    const targetTop =
      Math.round((listRect.bottom + window.scrollY) - (parentRect.top + window.scrollY) + margin);

    // Unbounce uses absolute positioning for elements; set inline style to ensure precedence
    buttonEl.style.top = `${targetTop}px`;
    // Ensure 'bottom' isn't constraining placement (just in case)
    buttonEl.style.bottom = '';
  }

  function debounce(fn, wait) {
    let t;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  // OPTIONAL: If you need to add CSS, add it like this.
  function addStyling() {
    let cssArray = [
      {
        desc: `Main styles for benefits list replacement`,
        css: `
          /* Variant: Replace subheadline paragraph with a vertical benefits list (desktop + mobile)
             Targets: #lp-pom-text-422 (desktop), #lp-pom-text-118 (mobile)
             All custom classes prefixed with cf- to avoid collisions
             
             Update: Removed the previous incorrect CSS rule that forced buttons to top: 30px.
             Button positioning is now handled dynamically via JS based on the benefits list height.
          */

          /* Reduce heading font size to create more vertical space */
          #lp-pom-text-421 span {
            font-size: 40px !important;
            line-height: 1.2 !important; /* Adjust line-height for new font size */
          }

          .cf-benefit-list {
            list-style: none;
            padding: 0;
            margin: 20px auto 0; /* Adjusted for even spacing */
            display: inline-block; /* enables centering the list while keeping items left-aligned */
            text-align: left;
            max-width: 720px; /* keeps line length readable on desktop */
            width: 100%;
          }

          .cf-benefit-item {
            display: flex;
            align-items: center;
            gap: 12px;
            margin: 10px 0;
            line-height: 1.3;
          }

          .cf-benefit-icon {
            display: inline-flex;
            width: 22px;
            height: 22px;
            flex: 0 0 22px;
            color: #000; /* brand text color from palette */
          }

          .cf-benefit-icon svg {
            width: 100%;
            height: 100%;
            display: block;
          }

          .cf-benefit-text {
            font-size: 18px;
            font-family: Arial, sans-serif;
            color: #000;
            font-weight: 600; /* improve legibility and emphasis */
          }

          /* Fine-tune spacing within the common Unbounce text container if needed */
          #lp-pom-text-422, #lp-pom-text-118 {
            text-align: center; /* center the list block within these containers */
            margin-bottom: 20px; /* Adjusted for even spacing */
          }

          /* NOTE: Removed the previous rule:
             #lp-pom-button-423, #lp-pom-button-115 { top: 30px !important; }
             This is intentionally handled by JS now.
          */

          @media (max-width: 767px) {
            /* Reduce mobile heading font size */
            #lp-pom-text-117 span {
              font-size: 27px !important;
              line-height: 1.2 !important; /* Adjust line-height */
            }
            
            .cf-benefit-text {
              font-size: 16px; /* maintain readability on smaller screens */
            }
            .cf-benefit-icon {
              width: 20px;
              height: 20px;
              flex-basis: 20px;
            }
            .cf-benefit-item {
              margin: 8px 0;
            }
            .cf-benefit-list {
              margin-top: 15px; /* Adjusted for mobile */
            }
          }
        `,
      },
    ];

    cssArray.forEach(({ desc, css }) => {
      // Avoid duplicating the same style tag if this function reruns
      const existing = Array.from(document.querySelectorAll('style[data-desc]')).find(
        (s) => s.dataset.desc === desc
      );
      if (existing) return;

      let newStyleElem = document.createElement(`style`);
      newStyleElem.dataset.desc = desc;
      newStyleElem.innerHTML = css;
      document.head.insertAdjacentElement(`beforeend`, newStyleElem);
    });
  }

  function monitorChangesByConditionAndRun(check, code, keepChecking = false) {
    let checkAndRun = () => check() && (!keepChecking && observer.disconnect(), code());
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