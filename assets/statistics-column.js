/**
 * Statistics Column Section JavaScript
 * Handles interactions and animations for the statistics column section
 */

class StatisticsColumn {
  constructor(container) {
    this.container = container;
    this.statisticItems = container.querySelectorAll('.statistic-item');
    this.init();
  }

  init() {
    // Initialize any animations or interactions
    this.setupObserver();
  }

  setupObserver() {
    // Set up intersection observer for animations when section comes into view
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animateStatistics();
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });

      observer.observe(this.container);
    }
  }

  animateStatistics() {
    // Add animation classes or trigger animations
    this.statisticItems.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add('animate-in');
      }, index * 100); // Stagger animations
    });
  }
}

// Initialize statistics column sections when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const statisticsColumns = document.querySelectorAll('.statistics-column-section');
  
  statisticsColumns.forEach(section => {
    new StatisticsColumn(section);
  });
});

// Re-initialize on theme section load (for theme editor)
document.addEventListener('shopify:section:load', (event) => {
  if (event.target.classList.contains('statistics-column-section')) {
    new StatisticsColumn(event.target);
  }
}); 