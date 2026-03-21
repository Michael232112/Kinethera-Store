class TestimonialsCarousel {
  constructor(sectionId) {
    this.sectionId = sectionId;
    this.carousel = document.getElementById(`testimonials-${sectionId}`);
    if (!this.carousel) return;
    
    this.track = this.carousel.querySelector('.testimonials-track');
    this.originalCards = this.carousel.querySelectorAll('.testimonial-card');
    this.prevButton = this.carousel.querySelector('.nav-button.prev');
    this.nextButton = this.carousel.querySelector('.nav-button.next');
    this.dots = this.carousel.querySelectorAll('.dot');
    
    this.isMobile = window.innerWidth < 750;
    this.isAnimating = false;
    
    // Touch/Swipe variables
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchEndX = 0;
    this.touchEndY = 0;
    this.isSwiping = false;
    
    this.init();
  }
  
  init() {
    this.setupCards();
    this.bindEvents();
    
    // Initialize - center the first card
    setTimeout(() => this.updateCarousel(false), 100);
  }
  
  setupCards() {
    if (this.isMobile) {
      // Mobile: Light cloning for partial card visibility
      if (this.originalCards.length > 1) {
        // Clone just the last card at the beginning and first card at the end
        const lastCardClone = this.originalCards[this.originalCards.length - 1].cloneNode(true);
        const firstCardClone = this.originalCards[0].cloneNode(true);
        
        lastCardClone.classList.add('testimonial-clone', 'mobile-clone-before');
        firstCardClone.classList.add('testimonial-clone', 'mobile-clone-after');
        
        this.track.insertBefore(lastCardClone, this.track.firstChild);
        this.track.appendChild(firstCardClone);
        
        this.cards = this.track.querySelectorAll('.testimonial-card');
        this.currentSlide = 1; // Start at first real card
        this.totalSlides = this.originalCards.length;
      } else {
        this.cards = this.originalCards;
        this.currentSlide = 0;
        this.totalSlides = this.originalCards.length;
      }
    } else {
      // Desktop: True infinite scroll with cloned cards
      if (this.originalCards.length > 1) {
        // Clone all cards and add them before and after for seamless infinite scroll
        const clonesBefore = Array.from(this.originalCards).map(card => {
          const clone = card.cloneNode(true);
          clone.classList.add('testimonial-clone', 'clone-before');
          return clone;
        });
        
        const clonesAfter = Array.from(this.originalCards).map(card => {
          const clone = card.cloneNode(true);
          clone.classList.add('testimonial-clone', 'clone-after');
          return clone;
        });
        
        // Add clones to track
        clonesBefore.forEach(clone => this.track.insertBefore(clone, this.track.firstChild));
        clonesAfter.forEach(clone => this.track.appendChild(clone));
        
        // Update cards array to include clones
        this.cards = this.track.querySelectorAll('.testimonial-card');
        this.currentSlide = this.originalCards.length; // Start at first real card
        this.totalSlides = this.originalCards.length;
      } else {
        this.cards = this.originalCards;
        this.currentSlide = 0;
        this.totalSlides = this.originalCards.length;
      }
    }
  }
  
  updateCarousel(animate = true) {
    if (!this.cards[this.currentSlide]) return;

    if (this.isMobile) {
      // Mobile: Use measurement-based centering for accuracy
      const targetCard = this.cards[this.currentSlide];
      if (!targetCard) return;
      
      // Get actual positions accounting for all CSS
      const containerRect = this.carousel.getBoundingClientRect();
      const cardRect = targetCard.getBoundingClientRect();
      
      // Calculate where the card center currently is vs where container center is
      const containerCenter = containerRect.left + containerRect.width / 2;
      const cardCenter = cardRect.left + cardRect.width / 2;
      
      // Get current transform value
      const currentTransform = getComputedStyle(this.track).transform;
      let currentOffset = 0;
      if (currentTransform && currentTransform !== 'none') {
        const matrix = new DOMMatrix(currentTransform);
        currentOffset = matrix.m41;
      }
      
      // Calculate adjustment needed to center the card
      const centeringError = cardCenter - containerCenter;
      const newOffset = currentOffset - centeringError;
      
      if (animate) {
        this.track.style.transition = 'transform 0.3s ease';
      } else {
        this.track.style.transition = 'none';
      }
      
      this.track.style.transform = `translateX(${newOffset}px)`;
      
      // Handle infinite scroll reset for mobile (light cloning)
      if (this.originalCards.length > 1) {
        if (this.currentSlide === 0) {
          // At cloned last card, jump to real last card
          setTimeout(() => {
            this.currentSlide = this.totalSlides;
            this.updateCarousel(false);
          }, animate ? 300 : 0);
        } else if (this.currentSlide === this.totalSlides + 1) {
          // At cloned first card, jump to real first card
          setTimeout(() => {
            this.currentSlide = 1;
            this.updateCarousel(false);
          }, animate ? 300 : 0);
        }
      }
    } else {
      // Desktop: Position to show 5 cards (3 full, 2 partial) with center card focused
      const cardWidth = this.cards[0].offsetWidth;
      const gap = parseInt(getComputedStyle(this.track).gap) || 0;
      const containerWidth = this.carousel.offsetWidth;
      
      // Position so the current card is in the center of the 5 visible cards
      // This means showing 2 cards before current, current in center, 2 cards after
      const cardPosition = (cardWidth + gap) * this.currentSlide;
      const centerOffset = containerWidth / 2 - cardWidth / 2; // Center of middle card
      const twoCardsOffset = (cardWidth + gap) * 2; // Offset to show 2 cards before
      const newOffset = -(cardPosition - centerOffset + twoCardsOffset);
      
      if (animate) {
        this.track.style.transition = 'transform 0.3s ease';
      } else {
        this.track.style.transition = 'none';
      }
      
      this.track.style.transform = `translateX(${newOffset}px)`;
      
      // Handle infinite scroll reset for desktop (when using clones)
      if (this.originalCards.length > 1) {
        setTimeout(() => {
          if (this.currentSlide < this.totalSlides) {
            // We're in the "before" clones, jump to equivalent real card
            this.currentSlide = this.totalSlides + this.currentSlide;
            this.updateCarousel(false);
          } else if (this.currentSlide >= this.totalSlides * 2) {
            // We're in the "after" clones, jump to equivalent real card  
            this.currentSlide = this.totalSlides + (this.currentSlide - this.totalSlides * 2);
            this.updateCarousel(false);
          }
        }, animate ? 350 : 10);
      }
    }
    
    // Update navigation buttons (never disable with infinite loop)
    if (this.prevButton) this.prevButton.disabled = false;
    if (this.nextButton) this.nextButton.disabled = false;
    
    // Update dots (show active state for the real card, not clones)
    let realCardIndex;
    if (this.isMobile) {
      if (this.originalCards.length > 1) {
        // Mobile with clones: adjust for cloned card at beginning
        realCardIndex = this.currentSlide === 0 ? this.totalSlides - 1 : 
                       this.currentSlide === this.totalSlides + 1 ? 0 : this.currentSlide - 1;
      } else {
        realCardIndex = this.currentSlide;
      }
    } else {
      // Desktop: calculate real card index from cloned layout
      if (this.currentSlide < this.totalSlides) {
        // In before clones
        realCardIndex = this.currentSlide;
      } else if (this.currentSlide >= this.totalSlides * 2) {
        // In after clones  
        realCardIndex = this.currentSlide - this.totalSlides * 2;
      } else {
        // In real cards
        realCardIndex = this.currentSlide - this.totalSlides;
      }
    }
    
    this.dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === realCardIndex);
    });
  }
  
  bindEvents() {
    // Navigation buttons
    if (this.prevButton) {
      this.prevButton.addEventListener('click', () => {
        if (this.isAnimating) return;
        this.isAnimating = true;
        
        if (this.isMobile) {
          // Mobile: Navigate with light cloning
          if (this.originalCards.length > 1) {
            this.currentSlide--;
          } else {
            this.currentSlide = this.currentSlide === 0 ? this.totalSlides - 1 : this.currentSlide - 1;
          }
        } else {
          // Desktop: True infinite scroll
          this.currentSlide--;
        }
        
        this.updateCarousel();
        setTimeout(() => {
          this.isAnimating = false;
        }, 350);
      });
    }
    
    if (this.nextButton) {
      this.nextButton.addEventListener('click', () => {
        if (this.isAnimating) return;
        this.isAnimating = true;
        
        if (this.isMobile) {
          // Mobile: Navigate with light cloning
          if (this.originalCards.length > 1) {
            this.currentSlide++;
          } else {
            this.currentSlide = this.currentSlide === this.totalSlides - 1 ? 0 : this.currentSlide + 1;
          }
        } else {
          // Desktop: True infinite scroll
          this.currentSlide++;
        }
        
        this.updateCarousel();
        setTimeout(() => {
          this.isAnimating = false;
        }, 350);
      });
    }
    
    // Dots navigation
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        if (this.isAnimating) return;
        this.isAnimating = true;
        
        if (this.isMobile) {
          if (this.originalCards.length > 1) {
            this.currentSlide = index + 1; // Account for cloned last card at beginning
          } else {
            this.currentSlide = index;
          }
        } else {
          // Desktop: Jump to the real card (accounting for clones)
          this.currentSlide = this.totalSlides + index;
        }
        
        this.updateCarousel();
        setTimeout(() => {
          this.isAnimating = false;
        }, 350);
      });
    });
    
    // Touch/Swipe functionality
    this.bindTouchEvents();
    
    // Handle resize
    window.addEventListener('resize', () => {
      setTimeout(() => this.updateCarousel(false), 50);
    });
  }
  
  bindTouchEvents() {
    const handleTouchStart = (e) => {
      // Don't start new swipe if already animating
      if (this.isAnimating) return;
      
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
      this.isSwiping = true;
    };
    
    const handleTouchMove = (e) => {
      if (!this.isSwiping) return;
      
      this.touchEndX = e.touches[0].clientX;
      this.touchEndY = e.touches[0].clientY;
      
      const deltaX = this.touchEndX - this.touchStartX;
      const deltaY = this.touchEndY - this.touchStartY;
      
      // Only prevent default if it's clearly a horizontal swipe
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 20) {
        e.preventDefault();
      }
    };
    
    const handleTouchEnd = (e) => {
      if (!this.isSwiping || this.isAnimating) return;
      
      const deltaX = this.touchEndX - this.touchStartX;
      const deltaY = this.touchEndY - this.touchStartY;
      const minSwipeDistance = 50;
      
      // Only trigger swipe if horizontal movement is greater than vertical
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
        this.isAnimating = true;
        
        if (deltaX > 0) {
          // Swipe right - go to previous card
          if (this.isMobile) {
            if (this.originalCards.length > 1) {
              this.currentSlide--;
            } else {
              this.currentSlide = this.currentSlide === 0 ? this.totalSlides - 1 : this.currentSlide - 1;
            }
          } else {
            this.currentSlide--;
          }
        } else {
          // Swipe left - go to next card
          if (this.isMobile) {
            if (this.originalCards.length > 1) {
              this.currentSlide++;
            } else {
              this.currentSlide = this.currentSlide === this.totalSlides - 1 ? 0 : this.currentSlide + 1;
            }
          } else {
            this.currentSlide++;
          }
        }
        
        this.updateCarousel(true);
        
        // Reset animation flag after transition completes
        setTimeout(() => {
          this.isAnimating = false;
        }, 350);
      }
      
      this.isSwiping = false;
    };
    
    // Add touch event listeners
    this.track.addEventListener('touchstart', handleTouchStart, { passive: false });
    this.track.addEventListener('touchmove', handleTouchMove, { passive: false });
    this.track.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    // Prevent context menu on long press
    this.track.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
  }
}

// Initialize testimonials carousels when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Find all testimonials sections and initialize them
  const testimonialsContainers = document.querySelectorAll('[id^="testimonials-"]');
  
  testimonialsContainers.forEach(container => {
    const sectionId = container.id.replace('testimonials-', '');
    new TestimonialsCarousel(sectionId);
  });
}); 