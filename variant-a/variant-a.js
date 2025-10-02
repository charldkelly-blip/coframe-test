(function CF_Template() {
  console.log('Changing headline to: A smarter way to manage money.');

  // Target the main hero headline - looking for the largest headline element
  const headline = document.querySelector('h1, .headline-xl');
  
  if (headline) {
    console.log('Found headline:', headline);
    headline.textContent = 'A smarter way to manage money.';

    // Emit the variantRendered event
    window.CFQ = window.CFQ || [];
    window.CFQ.push({ emit: 'variantRendered' });
  } else {
    console.error('Headline not found');
  }
})()