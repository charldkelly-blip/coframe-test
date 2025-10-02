(function CF_Template() {
  // Test Configuration
  let testInfo = {
    name: `CF 01 - Salespage: Split-screen hero`,
  };

  // Initialize test and exit if already running
  let testInitiated = initTest(testInfo);
  if (!testInitiated) return false;

  // Add styling up-front
  addStyling();

  // Wait for required elements and then run
  monitorChangesByConditionAndRun(checkForElements, onElementsFound);

  // === MAIN FUNCTIONS ===

  function onElementsFound() {
    try {
      console.log(`Running Code for: `, testInfo.name, testInfo);

      // Mark test active on body for CSS scoping
      document.querySelector(`body`)?.setAttribute(`cf-test-active`, testInfo.name);

      // Create a reliable 100vh on mobile (account for browser UI)
      setViewportVHVar();
      window.addEventListener('resize', setViewportVHVar);

      // Prevent duplicate render
      if (document.querySelector('.cf-hero-container')) {
        console.warn('CF hero already exists, skipping render.');
        return;
      }

      // Build the split-screen hero
      const hero = document.createElement('section');
      hero.className = 'cf-hero-container';
      hero.setAttribute('role', 'region');
      hero.setAttribute('aria-label', 'Memory Air hero');

      // Left: Background image (sleeping woman)
      const left = document.createElement('div');
      left.className = 'cf-hero-left';
      // Right: Content
      const right = document.createElement('div');
      right.className = 'cf-hero-right';

      const content = document.createElement('div');
      content.className = 'cf-hero-content';

      // Logo
      const logo = document.createElement('img');
      logo.className = 'cf-logo';
      logo.alt = 'Memory Air';
      logo.src = 'https://cdn.coframe.com/assets/memoryair/image-96b4fdc4-9053-47f5-9852-7eb5f1c5f147.webp';

      // Headline
      const h1 = document.createElement('h1');
      h1.className = 'cf-headline';
      h1.textContent = 'Prevent & Reverse Memory Loss... While You Sleep!';

      // Benefits list with icons
      const benefits = document.createElement('ul');
      benefits.className = 'cf-benefits';

      const benefitData = [
        {
          text: 'Improve memory by 226%',
          icon: '//d9hhrg4mnvzow.cloudfront.net/learn.memoryair.com/salespage/ftj9pv-neuroscience-icon_102l02l000000000000028.png',
          alt: 'Neuroscience icon',
        },
        {
          text: 'Works while you sleep',
          icon: '//d9hhrg4mnvzow.cloudfront.net/learn.memoryair.com/salespage/1idhu6l-neuroscience-icon-2_102c02c000000000000028.png',
          alt: 'Night and sleep icon',
        },
        {
          text: 'Feel sharper and younger',
          icon: '//d9hhrg4mnvzow.cloudfront.net/learn.memoryair.com/salespage/1ajris1-neuroscience-icon-3_102c02c000000000000028.png',
          alt: 'Progress tracking icon',
        },
      ];

      benefitData.forEach(({ text, icon, alt }) => {
        const li = document.createElement('li');
        li.className = 'cf-benefit';

        const img = document.createElement('img');
        img.src = icon;
        img.alt = alt;

        const span = document.createElement('span');
        span.textContent = text;

        li.appendChild(img);
        li.appendChild(span);
        benefits.appendChild(li);
      });

      // CTA
      const cta = document.createElement('a');
      cta.className = 'cf-cta';
      cta.href = 'clkn/https/memoryair.com/products/memory-air-device';
      cta.innerHTML = 'UPGRADE MY MEMORY &rarr;';
      cta.setAttribute('role', 'button');
      cta.setAttribute('aria-label', 'Upgrade my memory');

      // Assemble right content
      content.appendChild(logo);
      content.appendChild(h1);
      content.appendChild(benefits);
      content.appendChild(cta);
      right.appendChild(content);

      // Assemble hero
      hero.appendChild(left);
      hero.appendChild(right);

      // Insert hero as the very first element in the page's root container
      document.querySelector('#lp-pom-root').insertAdjacentElement('afterbegin', hero);

      // Inform Coframe SDK variant has successfully finished rendering
      window.CFQ = window.CFQ || [];
      window.CFQ.push({ emit: 'variantRendered' });
    } catch (e) {
      console.error('Error rendering variant:', e);
      // Do NOT emit variantRendered on error
    }
  }

  function checkForElements() {
    // Check for required elements before running code
    try {
      const cfDefined = typeof window.CF !== "undefined";
      console.log("Check: typeof window.CF !== 'undefined' =>", cfDefined);

      const root = document.querySelector('#lp-pom-root');
      const rootReady = !!root;
      console.log("Check: #lp-pom-root exists =>", rootReady);

      const testActiveAbsent = !document.querySelector('body[cf-test-active]');
      console.log("Check: body[cf-test-active] absent =>", testActiveAbsent);

      const heroAbsent = !document.querySelector('.cf-hero-container');
      console.log("Check: .cf-hero-container absent =>", heroAbsent);

      return cfDefined && rootReady && testActiveAbsent && heroAbsent;
    } catch (e) {
      console.error("Check error:", e);
      return false;
    }
  }

  // === HELPER FUNCTIONS ===

  // Add CSS for the split-screen hero and hide original header/hero
  function addStyling() {
    let cssArray = [
      {
        desc: `CF Split-screen hero styles`,
        css: `
          :root {
            /* Fallback is standard 1vh; JS sets --cf-vh for mobile correctness */
            --cf-vh: 1vh;
          }

          /* Hide original header and hero sections (scoped to this test only) */
          body[cf-test-active="${testInfo.name}"] #lp-pom-box-14,
          body[cf-test-active="${testInfo.name}"] #lp-pom-text-15,
          body[cf-test-active="${testInfo.name}"] #lp-pom-text-16,
          body[cf-test-active="${testInfo.name}"] #lp-pom-button-17,
          body[cf-test-active="${testInfo.name}"] #lp-pom-box-96,   /* header/nav block */
          body[cf-test-active="${testInfo.name}"] #lp-pom-box-110,  /* alt header/nav block */
          body[cf-test-active="${testInfo.name}"] #lp-pom-box-116,  /* primary hero block */
          body[cf-test-active="${testInfo.name}"] #lp-pom-text-117, /* hero text */
          body[cf-test-active="${testInfo.name}"] #lp-pom-text-118, /* hero text */
          body[cf-test-active="${testInfo.name}"] #lp-pom-image-137,/* hero image */
          body[cf-test-active="${testInfo.name}"] #lp-pom-image-139,/* hero image */
          body[cf-test-active="${testInfo.name}"] #lp-pom-image-144,/* hero logo */
          body[cf-test-active="${testInfo.name}"] #lp-pom-button-115,/* hero CTA */
          body[cf-test-active="${testInfo.name}"] #lp-pom-button-140,/* hero CTA */
          body[cf-test-active="${testInfo.name}"] #lp-pom-button-143,/* hero CTA */
          body[cf-test-active="${testInfo.name}"] #lp-pom-button-146, /* hero CTA */
          body[cf-test-active="${testInfo.name}"] #lp-pom-box-415,
          body[cf-test-active="${testInfo.name}"] #lp-pom-image-120
          {
            display: none !important;
          }

          /* Add a pulse animation to the CTA */
          @keyframes pulse {
            0% {
              transform: scale(1);
              box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.4);
            }
            70% {
              transform: scale(1.03);
              box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
            }
            100% {
              transform: scale(1);
              box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
            }
          }

          /* Split-screen hero container */
          .cf-hero-container {
            position: relative;
            width: 100%;
            height: calc(var(--cf-vh) * 100);
            display: flex;
            overflow: hidden;
            background: #fff;
            font-family: Arial, sans-serif;
            color: #000;
          }

          .cf-hero-left {
            flex: 1 1 50%;
            background-image: url('https://cdn.coframe.com/assets/memoryair/Product-Image-hero-9a0ccef7-64e0-4ffd-94da-19ff60e11d6e.webp');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
          }

          .cf-hero-right {
            flex: 1 1 50%;
            display: flex;
            align-items: center;
            justify-content: flex-start;
          }

          .cf-hero-content {
            display: flex;
            flex-direction: column;
            gap: 16px;
            max-width: 560px;
            margin-left: 6vw;
            margin-right: 8vw;
          }

          .cf-logo {
            width: 180px;
            max-width: 60%;
            height: auto;
            margin-bottom: 16px;
          }

          .cf-headline {
            font-size: 38px;
            line-height: 1.2;
            font-weight: 700;
            margin: 0;
            color: #000;
          }

          .cf-benefits {
            list-style: none;
            padding: 0;
            margin: 8px 0 20px;
          }

          .cf-benefit {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            margin: 10px 0;
          }

          .cf-benefit img {
            width: 28px;
            height: 28px;
            flex: 0 0 28px;
          }

          .cf-benefit span {
            font-size: 18px;
            line-height: 1.4;
            color: #000;
          }

          .cf-cta {
            display: inline-block;
            background: #000;
            color: #fff;
            text-decoration: none;
            padding: 14px 22px;
            border-radius: 5px;
            font-weight: 700;
            text-align: center;
            letter-spacing: 0.2px;
            transition: transform 0.15s ease, opacity 0.15s ease;
            width: fit-content;
            animation: pulse 2s infinite;
          }

          .cf-cta:hover,
          .cf-cta:focus {
            transform: translateY(-1px);
            opacity: 0.95;
          }

          /* Responsive adjustments */
          @media (max-width: 1024px) {
            .cf-headline {
              font-size: 34px;
            }
          }

          @media (max-width: 900px) {
            .cf-hero-container {
              flex-direction: column;
              min-height: calc(var(--cf-vh) * 100);
              height: auto;
            }
            .cf-hero-left {
              display: none;
            }
            .cf-hero-right {
              padding: 24px 16px;
            }
            .cf-hero-content {
              margin: 0 auto;
              max-width: 600px;
              padding: 0 8px;
            }
            .cf-headline {
              font-size: 28px;
              line-height: 1.25;
            }
            .cf-benefit span {
              font-size: 16px;
            }
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

  // Utility: Set --cf-vh to create a stable 100vh on mobile browsers
  function setViewportVHVar() {
    try {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--cf-vh', `${vh}px`);
    } catch (e) {
      console.warn('Failed to set --cf-vh variable', e);
    }
  }
})();