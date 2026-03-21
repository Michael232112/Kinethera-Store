/**
 * Satisfaction Guarantee JavaScript
 * Handles scrolling functionality
 */

class SatisfactionGuarantee {
  constructor() {
    this.init();
  }

  init() {
    // Add event listeners when DOM is loaded
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () =>
        this.attachEventListeners()
      );
    } else {
      this.attachEventListeners();
    }
  }

  attachEventListeners() {
    // Find all CTA buttons in the guarantee section
    const ctaButtons = document.querySelectorAll(".guarantee-section__cta");

    // Add click event listener to each button
    ctaButtons.forEach((button) => {
      button.addEventListener("click", this.scrollToProduct);
    });
  }

  scrollToProduct(event) {
    event.preventDefault();

    // Find the first product section on the page using various selectors
    const productSection = document.querySelector(
      ".shopify-section .product, " +
        '.shopify-section [data-section-type="product"], ' +
        "main#MainContent .product-template, " +
        "main#MainContent .product, " +
        "#ProductSection, " +
        "#shopify-section-product-template, " +
        ".product-section"
    );

    if (productSection) {
      // Scroll to the product section
      productSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      // Fallback: just scroll to top if product section not found
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }

    return false;
  }
}

// Initialize the class
document.addEventListener("DOMContentLoaded", function () {
  new SatisfactionGuarantee();
});
