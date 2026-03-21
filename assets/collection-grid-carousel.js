document.addEventListener('DOMContentLoaded', function() {
  // Find all carousel and scrollable grid sections on the page
  const carouselSections = document.querySelectorAll('.collection-grid-carousel, .collection-grid-scrollable');
  
  carouselSections.forEach(section => {
    const container = section.querySelector('.product-carousel, .product-grid');
    const prevButton = section.querySelector('.nav-button.prev');
    const nextButton = section.querySelector('.nav-button.next');

    function updateProductAlignment() {
      if (!container) return;

      const productCards = container.querySelectorAll('.product-card');
      if (productCards.length === 0) {
        container.style.justifyContent = 'center'; // Center if no cards
        return;
      }

      // Calculate total width of cards + gaps
      let totalWidth = 0;
      const gapStyle = window.getComputedStyle(container).getPropertyValue('gap');
      const gap = parseFloat(gapStyle) || 20; // Use computed gap or fallback

      productCards.forEach((card, index) => {
        totalWidth += card.offsetWidth;
        if (index < productCards.length - 1) {
          totalWidth += gap;
        }
      });

      // Use clientWidth which excludes padding/border/scrollbar width
      const containerWidth = container.clientWidth; 

      // Add a small tolerance to prevent slight overflows causing left alignment
      if (totalWidth < containerWidth - 1) { 
        container.style.justifyContent = 'center';
      } else {
        // Default or explicit flex-start for overflow/scrolling
        container.style.justifyContent = 'flex-start'; 
      }
    }

    // Calculate dynamic scroll amount based on card width and gap
    function getScrollAmount() {
      if (!container) return 360;
      
      const productCards = container.querySelectorAll('.product-card');
      if (productCards.length === 0) return 360;
      
      const firstCard = productCards[0];
      const cardWidth = firstCard.offsetWidth;
      const gapStyle = window.getComputedStyle(container).getPropertyValue('gap');
      const gap = parseFloat(gapStyle) || 20;
      
      // Scroll by one card width + gap for precise centering
      return cardWidth + gap;
    }
    
    // Find the index of the currently visible/centered card
    function getCurrentCardIndex() {
      if (!container) return 0;
      
      const productCards = container.querySelectorAll('.product-card');
      if (productCards.length === 0) return 0;
      
      const containerLeft = container.scrollLeft;
      const containerCenter = containerLeft + (container.clientWidth / 2);
      
      let closestIndex = 0;
      let closestDistance = Infinity;
      
      productCards.forEach((card, index) => {
        const cardCenter = card.offsetLeft + (card.offsetWidth / 2);
        const distance = Math.abs(containerCenter - cardCenter);
        
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });
      
      return closestIndex;
    }
    
    // Scroll to center a specific card
    function scrollToCard(cardIndex) {
      if (!container) return;
      
      const productCards = container.querySelectorAll('.product-card');
      if (cardIndex < 0 || cardIndex >= productCards.length) return;
      
      const targetCard = productCards[cardIndex];
      const cardCenter = targetCard.offsetLeft + (targetCard.offsetWidth / 2);
      const containerCenter = container.clientWidth / 2;
      const scrollPosition = cardCenter - containerCenter;
      
      // Ensure we don't scroll beyond bounds
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      const finalScrollPosition = Math.max(0, Math.min(scrollPosition, maxScrollLeft));
      
      container.scrollTo({ left: finalScrollPosition, behavior: 'smooth' });
    }

    // Navigation functionality
    function setupNavigation() {
      if (!container || !prevButton || !nextButton) return;
      
      prevButton.addEventListener('click', function() {
        const currentIndex = getCurrentCardIndex();
        const productCards = container.querySelectorAll('.product-card');
        
        if (currentIndex > 0) {
          // Go to previous card
          scrollToCard(currentIndex - 1);
        } else {
          // If at first card, go to last card (wrap around)
          scrollToCard(productCards.length - 1);
        }
      });

      nextButton.addEventListener('click', function() {
        const currentIndex = getCurrentCardIndex();
        const productCards = container.querySelectorAll('.product-card');
        
        if (currentIndex < productCards.length - 1) {
          // Go to next card
          scrollToCard(currentIndex + 1);
        } else {
          // If at last card, go to first card (wrap around)
          scrollToCard(0);
        }
      });
    }
    
    // Initial alignment check and setup resize listener
    updateProductAlignment();
    window.addEventListener('resize', updateProductAlignment);

    // Ensure images are loaded before calculating width for accuracy
    // Using Promise.all to wait for all images inside cards to load
    const images = container ? container.querySelectorAll('.product-card img') : [];
    const imageLoadPromises = [];
    images.forEach(img => {
      if (!img.complete) {
        imageLoadPromises.push(new Promise(resolve => {
          img.onload = resolve;
          img.onerror = resolve; // Resolve even if image fails to load
        }));
      }
    });

    if (imageLoadPromises.length > 0) {
      Promise.all(imageLoadPromises).then(() => {
        updateProductAlignment(); // Recalculate after images load
      });
    } else {
      // If no images or all are complete, run alignment check once more just in case
      updateProductAlignment();
    }

    // Setup navigation with dynamic card-based scrolling
    setupNavigation();
  });
}); 