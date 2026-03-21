document.addEventListener('DOMContentLoaded', function() {
  // Initialize the Swiper slider
  initReviewsSlider();
  
  // Set up button padding and click event
  setupClaimButton();
});

/**
 * Initializes the reviews slider with Swiper
 */
function initReviewsSlider() {
  var swiper = new Swiper(".reviewSwiper", {
    slidesPerView: "auto",
    spaceBetween: 15,
    centeredSlides: false,
    loop: true,
    speed: parseInt(document.querySelector('.reviewSwiper').dataset.speed || 5000),
    autoplay: {
      delay: 1,
      disableOnInteraction: false
    },
    allowTouchMove: true,
    grabCursor: true,
    freeMode: {
      enabled: false
    }
  });
}

/**
 * Sets up the claim button padding and event handling
 */
function setupClaimButton() {
  var claimButton = document.querySelector('.claim-button');
  if (claimButton) {
    // Button padding is now handled via inline styles
  }
}

/**
 * Scrolls to the top of the page
 * @param {Event} event - The click event
 */
function scrollToTop(event) {
  // Always prevent default since we're always using '#' as href
  event.preventDefault();

  // Smooth scroll to top
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
} 