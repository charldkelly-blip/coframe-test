(function CF_Template() {
  console.log('Applying variant changes...');

// Add CTA to the "For startups, global enterprises" section
  const enterpriseHeadings = document.querySelectorAll('h2.headline-l');
  enterpriseHeadings.forEach(heading => {
    if (heading.textContent.includes('For startups, global enterprises')) {
      const sectionContainer = heading.closest('.space-y-8');
      if (sectionContainer) {
        // Check if CTA already exists to avoid duplicates
        if (!sectionContainer.querySelector('.mt-8 a[href="/see-a-demo"]')) {
          const ctaHTML = `
            <div class="mt-8">
              <a class="group/link text-hushed hover:text-primary items-center gap-2 flex justify-center" href="/pricing">
                <span class="leading-trim body-m">
                  Join 45,000+ finance teams
                </span>
                <div class="group-hover/link:animate-arrow-slide">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.33325 8.00017H12.6665M12.6665 8.00017L7.99994 3.3335M12.6665 8.00017L7.99994 12.6669" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
              </a>
            </div>
          `;
          sectionContainer.insertAdjacentHTML('beforeend', ctaHTML);
          console.log('Added CTA to enterprise section');
        }
      }
    }
  });
  
})();
