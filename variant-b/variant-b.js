(function CF_Template() {
  console.log('Applying variant changes...');

  // Create the new "How it works" section
  const howItWorksHTML = `
    <section class="bg-white" style="padding-top: 120px; padding-bottom: 64px;">
      <div class="mx-auto w-full max-w-screen-2xl px-4 md:px-8 lg:px-12 xl:px-16">
        <!-- Eyebrow heading -->
        <div class="text-center">
          <div class="leading-trim body-s text-hushed uppercase mb-4">
            How it works
          </div>
          
          <!-- Main heading -->
          <h2 class="leading-trim headline-l text-primary mb-16">
            From signup to smarter finance, in 3 simple steps.
          </h2>
        </div>

        <!-- Three cards grid -->
        <div class="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6 lg:gap-8">
          
          <!-- Step 1 -->
          <div class="flex flex-col items-center text-center">
            <div class="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-solar text-primary">
              <span class="body-m font-medium">1</span>
            </div>
            <h3 class="body-l text-primary mb-4">
              Get Started in Minutes
            </h3>
            <p class="body-m text-hushed">
              Sign up with your work email and connect your ERP — no long setup or IT headaches.
            </p>
          </div>

          <!-- Step 2 -->
          <div class="flex flex-col items-center text-center">
            <div class="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-solar text-primary">
              <span class="body-m font-medium">2</span>
            </div>
            <h3 class="body-l text-primary mb-4">
              Set Controls That Run Themselves
            </h3>
            <p class="body-m text-hushed">
              Issue cards, approvals, and policies instantly. Stop overspending before it happens.
            </p>
          </div>

          <!-- Step 3 -->
          <div class="flex flex-col items-center text-center">
            <div class="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-solar text-primary">
              <span class="body-m font-medium">3</span>
            </div>
            <h3 class="body-l text-primary mb-4">
              Save Time & Money Every Day
            </h3>
            <p class="body-m text-hushed">
              Automate expenses, bills, and accounting — while your team stays focused on growth.
            </p>
          </div>

        </div>
        
        <!-- CTA Button -->
        <div class="mt-12 flex justify-center">
          <a class="group/link items-center gap-2 flex justify-center" href="/see-a-demo">
            <span class="leading-trim body-m text-hushed">
              See a demo
            </span>
            <div class="group-hover/link:animate-arrow-slide">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.33325 8.00017H12.6665M12.6665 8.00017L7.99994 3.3335M12.6665 8.00017L7.99994 12.6669" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </a>
        </div>
        
      </div>
    </section>
  `;

  // Find the insertion point - after the main/hero section
  const mainElement = document.querySelector('main');
  if (mainElement) {
    // Find the first section or div that's likely after the hero
    const firstSection = mainElement.querySelector('.bg-white section, .spacer-p-t-l');
    
    if (firstSection) {
      // Insert our new section before the existing first section
      firstSection.insertAdjacentHTML('beforebegin', howItWorksHTML);
      console.log('How it works section added');
    } else {
      // If no section found, add it at the beginning of main
      mainElement.insertAdjacentHTML('afterbegin', howItWorksHTML);
      console.log('How it works section added at beginning of main');
    }
  }

  // Emit the variantRendered event
  window.CFQ = window.CFQ || [];
  window.CFQ.push({ emit: 'variantRendered' });
  
})();
