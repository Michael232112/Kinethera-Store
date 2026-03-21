// Customer Reviews Carousel Navigation
console.log('Loading customer reviews carousel script...');

function initCarousel() {
  console.log('Initializing carousel...');
  
  // Find the specific customer reviews section
  const section = document.querySelector('.reviews-transformation-section');
  if (!section) {
    console.error('Customer reviews section not found');
    return;
  }
  
  // Find elements within this specific section
  const container = section.querySelector('.reviews-container');
  const prevButton = section.querySelector('.nav-button.prev');
  const nextButton = section.querySelector('.nav-button.next');
  
  console.log('Section found:', !!section);
  console.log('Container found:', !!container);
  console.log('Prev button found:', !!prevButton);
  console.log('Next button found:', !!nextButton);
  
  if (!container || !prevButton || !nextButton) {
    console.error('Carousel elements not found');
    return;
  }
  
  // Function to calculate scroll amount based on card width
  function getScrollAmount() {
    const firstCard = container.querySelector('.review-card');
    if (!firstCard) return 350; // Fallback
    
    const cardWidth = firstCard.offsetWidth;
    const containerStyle = getComputedStyle(container);
    const gap = parseInt(containerStyle.gap) || 20;
    
    console.log('Card width:', cardWidth, 'Gap:', gap, 'Total scroll:', cardWidth + gap);
    return cardWidth + gap;
  }
  
  // Function to check if we're at the end of the carousel
  function isAtEnd() {
    const scrollLeft = container.scrollLeft;
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;
    
    // Allow for small rounding errors (within 5px)
    return scrollLeft + clientWidth >= scrollWidth - 5;
  }
  
  // Function to check if we're at the beginning of the carousel
  function isAtBeginning() {
    return container.scrollLeft <= 5; // Allow for small rounding errors
  }
  
  // Previous button
  prevButton.addEventListener('click', function(e) {
    e.preventDefault();
    console.log('Prev button clicked');
    
    if (isAtBeginning()) {
      // If at beginning, go to the end
      console.log('At beginning, scrolling to end');
      container.scrollTo({ 
        left: container.scrollWidth - container.clientWidth, 
        behavior: 'smooth' 
      });
    } else {
      // Normal previous scroll
      const scrollAmount = getScrollAmount();
      container.scrollBy({ 
        left: -scrollAmount, 
        behavior: 'smooth' 
      });
    }
  });
  
  // Next button
  nextButton.addEventListener('click', function(e) {
    e.preventDefault();
    console.log('Next button clicked');
    
    if (isAtEnd()) {
      // If at end, go back to beginning
      console.log('At end, scrolling to beginning');
      container.scrollTo({ 
        left: 0, 
        behavior: 'smooth' 
      });
    } else {
      // Normal next scroll
      const scrollAmount = getScrollAmount();
      container.scrollBy({ 
        left: scrollAmount, 
        behavior: 'smooth' 
      });
    }
  });
  
  console.log('Navigation setup complete');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCarousel);
} else {
  initCarousel();
}

// Fallback: try again after a short delay
setTimeout(initCarousel, 1000); 