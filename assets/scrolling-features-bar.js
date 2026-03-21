/**
 * Scrolling Features Bar JavaScript
 * Controls the scrolling animation and responsiveness
 */

class ScrollingFeaturesBar {
  constructor(options = {}) {
    this.options = options;
    this.init();
  }
  
  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
    
    // Handle resize events
    window.addEventListener('resize', () => this.adjustFeaturesTrack());

    // Add this block to re-run setup after fonts are loaded
    if (document.fonts) {
      document.fonts.ready.then(() => {
        this.setup(); // Re-initializes measurements after fonts ensure accurate widths
      });
    }
  }
  
  setup() {
    // Find all scrolling features bars (in case there are multiple on page)
    const allSections = document.querySelectorAll('[class*="section-"]');
    
    allSections.forEach(section => {
      if (section.querySelector('.features-track')) {
        this.initSection(section);
      }
    });
  }
  
  initSection(section) {
    const trackContainer = section.querySelector('.features-track-container');
    const track = section.querySelector('.features-track');
    const featureItems = track.querySelector('.feature-items');
    
    if (!trackContainer || !track || !featureItems) return;
    
    // Set animation configuration
    this.configureScrollingAnimation(section, track, featureItems);
    
    // Adjust the features track size
    this.adjustFeaturesTrack(section, trackContainer, track, featureItems);
  }
  
  configureScrollingAnimation(section, track, featureItems) {
    // Get the section ID from the class name
    const sectionIdMatch = section.className.match(/section-([a-z0-9-]+)/i);
    if (!sectionIdMatch) return;
    
    const sectionId = sectionIdMatch[1];
    
    // Calculate the animation duration based on content width
    const contentWidth = featureItems.scrollWidth;
    const viewportWidth = window.innerWidth;
    
    // Adjust the animation speed if needed
    const pauseOnHover = section.classList.contains('pause-on-hover');
    if (pauseOnHover) {
      track.addEventListener('mouseenter', () => {
        track.style.animationPlayState = 'paused';
      });
      
      track.addEventListener('mouseleave', () => {
        track.style.animationPlayState = 'running';
      });
    }
  }
  
  adjustFeaturesTrack(section, trackContainer, track, featureItems) {
    // If no arguments provided, we're being called from a resize event
    if (!section) {
      const allSections = document.querySelectorAll('[class*="section-"]');
      allSections.forEach(section => {
        if (section.querySelector('.features-track')) {
          const trackContainer = section.querySelector('.features-track-container');
          const track = section.querySelector('.features-track');
          const featureItems = track.querySelector('.feature-items');
          
          if (trackContainer && track && featureItems) {
            this.adjustFeaturesTrack(section, trackContainer, track, featureItems);
          }
        }
      });
      return;
    }
    
    // Make sure all elements exist
    if (!trackContainer || !track || !featureItems) return;
    
    // Calculate the width of one set of feature items
    const featureItemsWidth = featureItems.offsetWidth;
    
    // We need to have at least 4 sets for the smooth infinite scroll
    const totalWidth = featureItemsWidth * 4;
    
    // Set the track width to fit all feature sets
    if (totalWidth > 0) {
      track.style.width = `${totalWidth}px`;
    }
    
    // Set the track container height to match the feature items height
    trackContainer.style.height = `${featureItems.offsetHeight}px`;
  }
}

// Initialize on DOM content loaded
document.addEventListener('DOMContentLoaded', function() {
  new ScrollingFeaturesBar();
}); 
 
 