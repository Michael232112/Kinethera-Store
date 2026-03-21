document.addEventListener("DOMContentLoaded", function () {
    // Find all forms that might have quantity selectors
    const productForms = document.querySelectorAll(
        'form[data-type="add-to-cart-form"]'
    );

    productForms.forEach((form) => {
        // Find quantity inputs associated with this form
        const formId = form.id;
        const quantityInputs = document.querySelectorAll(
            `input[name="quantity"][form="${formId}"], .modern-quantity-selector .quantity-input[form="${formId}"]`
        );

        if (quantityInputs.length === 0) return;

        // Override form submission
        form.addEventListener("submit", function (e) {
            // Get the first visible quantity input
            const activeQuantityInput = quantityInputs[0];
            const quantity = parseInt(activeQuantityInput.value) || 1;

            // Remove any existing hidden quantity inputs
            form
                .querySelectorAll('input[type="hidden"][name="quantity"]')
                .forEach((input) => {
                    input.remove();
                });

            // Create a new hidden input with the current quantity
            const qtyInput = document.createElement("input");
            qtyInput.type = "hidden";
            qtyInput.name = "quantity";
            qtyInput.value = quantity;

            // Add the hidden input to the form
            form.appendChild(qtyInput);
        });
    });

    // Handle responsive product titles
    function handleResponsiveProductTitles() {
        const productTitles = document.querySelectorAll(
            ".shop-product-title[data-font-size][data-mobile-font-size]"
        );

        productTitles.forEach((title) => {
            function adjustTitleFontSize() {
                const desktopSize = title.getAttribute("data-font-size");
                const mobileSize = title.getAttribute("data-mobile-font-size");

                if (window.innerWidth <= 767) {
                    title.style.setProperty("font-size", `${mobileSize}px`, "important");
                } else {
                    title.style.setProperty("font-size", `${desktopSize}px`, "important");
                }
            }

            // Run immediately
            adjustTitleFontSize();

            // Add resize event listener if not already added
            if (!title.hasAttribute("data-resize-listener-added")) {
                window.addEventListener("resize", adjustTitleFontSize);
                title.setAttribute("data-resize-listener-added", "true");
            }
        });
    }

    // Initialize responsive product titles
    handleResponsiveProductTitles();

    function initFaqAccordions() {
        const faqContainers = document.querySelectorAll(".product-faq");

        faqContainers.forEach((faqContainer) => {
            const faqId = faqContainer.id;
            if (!faqId) return;

            const faqItems = faqContainer.querySelectorAll(".faq-item");
            const innerFaqContainer = faqContainer.querySelector(".faq-container");
            const isAccordion =
                innerFaqContainer &&
                innerFaqContainer.getAttribute("data-accordion") === "true";

            faqItems.forEach((item) => {
                const question = item.querySelector(".faq-question");
                if (!question) return;

                // Only add click listener if it doesn't already have one
                if (!question.hasAttribute("data-click-listener-added")) {
                    question.setAttribute("data-click-listener-added", "true");

                    question.addEventListener("click", () => {
                        const isActive = item.classList.contains("active");

                        // Close all other items first if accordion mode is enabled
                        if (isAccordion && !isActive) {
                            faqItems.forEach((otherItem) => {
                                otherItem.classList.remove("active");
                            });
                        }

                        // Toggle the clicked item
                        item.classList.toggle("active");
                    });
                }
            });
        });
    }
    initFaqAccordions();

    // Read More/Less functionality for description
    const readMoreLinks = document.querySelectorAll(".shop-read-more");
    const readLessLinks = document.querySelectorAll(".shop-read-less");

    readMoreLinks.forEach((link) => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            const parent = this.closest(".shop-product-description");
            parent.querySelector(".shop-truncated-description").style.display =
                "none";
            parent.querySelector(".shop-full-description").style.display = "block";
        });
    });

    readLessLinks.forEach((link) => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            const parent = this.closest(".shop-product-description");
            parent.querySelector(".shop-truncated-description").style.display =
                "block";
            parent.querySelector(".shop-full-description").style.display = "none";
        });
    });
});

