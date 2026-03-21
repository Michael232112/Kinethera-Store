// Product Gallery Module
// Supports multiple galleries per page, variant image switching, and optimized DOM/event handling
(function () {
  // Read autoplay setting from global variable if present
  const enableAutoplay =
    typeof window.enableAutoplay !== "undefined"
      ? window.enableAutoplay
      : false;

  class ProductGallery {
    constructor(container) {
      this.container = container;
      this.mainImages = Array.from(
        container.querySelectorAll(".shop-main-image")
      );
      this.thumbnails = Array.from(
        container.querySelectorAll(".shop-thumbnail")
      );
      this.prevArrow = container.querySelector(".shop-prev-arrow");
      this.nextArrow = container.querySelector(".shop-next-arrow");
      this.indicatorsContainer = container.querySelector(
        ".shop-indicators, #thumbnail-indicators"
      );
      this.currentIndex = 0;
      this.maxIndex = this.mainImages.length - 1;
      this.init();
    }

    init() {
      // Set up initial state
      this.mainImages.forEach((img, i) => {
        img.style.display = i === 0 ? "block" : "none";
        img.classList.toggle("active", i === 0);
      });
      this.thumbnails.forEach((thumb, i) => {
        thumb.classList.toggle("active", i === 0);
      });
      this.updateArrowStates();
      this.createIndicators();
      this.attachEvents();
      // Autoplay video if needed on first image
      this.handleVideoAutoplay(0);

      // --- Swipe gesture support ---
      this.touchStartX = 0;
      this.touchEndX = 0;
      this.isSwiping = false;
      this.swipeThreshold = 30;
      const imageContainer = this.container.querySelector(
        ".shop-main-image-wrapper"
      );
      if (imageContainer) {
        imageContainer.addEventListener(
          "touchstart",
          (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
            this.isSwiping = true;
          },
          { passive: true }
        );
        imageContainer.addEventListener(
          "touchmove",
          (e) => {
            if (!this.isSwiping) return;
            const currentX = e.changedTouches[0].screenX;
            const deltaX = currentX - this.touchStartX;
            if (Math.abs(deltaX) > this.swipeThreshold / 2) {
              e.preventDefault();
            }
          },
          { passive: false }
        );
        imageContainer.addEventListener(
          "touchend",
          (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.handleSwipeGesture();
            this.isSwiping = false;
          },
          { passive: true }
        );
      }
    }

    attachEvents() {
      // Thumbnail click
      this.thumbnails.forEach((thumb, i) => {
        thumb.addEventListener("click", () => this.changeImage(i));
      });
      // Arrow click (looping)
      if (this.prevArrow) {
        this.prevArrow.addEventListener("click", () => {
          const newIndex =
            this.currentIndex === 0 ? this.maxIndex : this.currentIndex - 1;
          this.changeImage(newIndex);
        });
      }
      if (this.nextArrow) {
        this.nextArrow.addEventListener("click", () => {
          const newIndex =
            this.currentIndex === this.maxIndex ? 0 : this.currentIndex + 1;
          this.changeImage(newIndex);
        });
      }
      // Indicator click
      if (this.indicatorsContainer) {
        this.indicatorsContainer.addEventListener("click", (e) => {
          if (e.target.classList.contains("shop-indicator-dot")) {
            const idx = parseInt(e.target.getAttribute("data-index"));
            if (!isNaN(idx)) this.changeImage(idx);
          }
        });
      }
    }

    createIndicators() {
      if (!this.indicatorsContainer) return;
      this.indicatorsContainer.innerHTML = "";
      this.mainImages.forEach((_, i) => {
        const dot = document.createElement("div");
        dot.className = "shop-indicator-dot" + (i === 0 ? " active" : "");
        dot.setAttribute("data-index", i);
        this.indicatorsContainer.appendChild(dot);
      });
    }

    updateArrowStates() {
      if (this.prevArrow)
        this.prevArrow.classList.toggle("disabled", this.currentIndex === 0);
      if (this.nextArrow)
        this.nextArrow.classList.toggle(
          "disabled",
          this.currentIndex === this.maxIndex
        );
    }

    changeImage(index) {
      if (index < 0 || index > this.maxIndex) return;
      this.mainImages.forEach((img, i) => {
        img.style.display = i === index ? "block" : "none";
        img.classList.toggle("active", i === index);
      });
      this.thumbnails.forEach((thumb, i) => {
        thumb.classList.toggle("active", i === index);
      });
      if (this.indicatorsContainer) {
        Array.from(this.indicatorsContainer.children).forEach((dot, i) => {
          dot.classList.toggle("active", i === index);
        });
      }
      this.currentIndex = index;
      this.updateArrowStates();
      // Ensure thumbnail is visible if in a scrollable container
      this.scrollToThumbnail(index);
      // Handle video autoplay
      this.handleVideoAutoplay(index);
    }

    scrollToThumbnail(index) {
      // Smoothly center the thumbnail in its container
      if (!this.thumbnails[index]) return;
      const thumbnail = this.thumbnails[index];
      const container = thumbnail.parentElement;
      if (!container) return;
      const containerWidth = container.offsetWidth;
      const thumbnailWidth = thumbnail.offsetWidth;
      const thumbnailLeft = thumbnail.offsetLeft;
      const scrollPosition =
        thumbnailLeft - containerWidth / 2 + thumbnailWidth / 2;
      container.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }

    handleSwipeGesture() {
      const deltaX = this.touchEndX - this.touchStartX;
      if (Math.abs(deltaX) > this.swipeThreshold) {
        const numImages = this.mainImages.length;
        const currentImageIndex = this.currentIndex;
        const nextIndex = (currentImageIndex + 1) % numImages;
        const prevIndex = (currentImageIndex - 1 + numImages) % numImages;
        if (deltaX < 0) {
          this.changeImage(nextIndex);
        } else {
          this.changeImage(prevIndex);
        }
      }
      this.touchStartX = 0;
      this.touchEndX = 0;
    }

    handleVideoAutoplay(index) {
      this.mainImages.forEach((img, i) => {
        const video = img.querySelector("video");
        if (video) {
          video.pause();
          video.currentTime = 0;
        }
      });
      const activeMedia = this.mainImages[index];
      if (!activeMedia) return;
      const videoToPlay = activeMedia.querySelector("video");
      if (videoToPlay && enableAutoplay) {
        videoToPlay.play().catch(() => {});
      }
    }

    updateWithVariant(variant) {
      // Try to match by mediaId, variantId, or image src
      let matchIndex = -1;
      if (
        variant &&
        (variant.mediaId || variant.variantId || variant.imageUrl)
      ) {
        this.mainImages.forEach((img, i) => {
          if (
            (variant.mediaId && img.dataset.mediaId == variant.mediaId) ||
            (variant.variantId && img.dataset.variantId == variant.variantId) ||
            (variant.imageUrl &&
              (img.src.includes(variant.imageUrl) ||
                (img.dataset.src &&
                  img.dataset.src.includes(variant.imageUrl))))
          ) {
            matchIndex = i;
          }
        });
      }
      if (matchIndex >= 0) {
        this.changeImage(matchIndex);
      } else {
        this.changeImage(0);
      }
    }
  }

  // Registry for multiple galleries
  const galleryRegistry = [];

  function initAll() {
    document.querySelectorAll(".product-gallery").forEach((container) => {
      if (!container.__galleryInstance) {
        const gallery = new ProductGallery(container);
        container.__galleryInstance = gallery;
        galleryRegistry.push(gallery);
      }
    });
  }

  // Listen for variant/image change events globally
  document.addEventListener("variantImageSelected", function (e) {
    if (
      e.detail &&
      (e.detail.variantId || e.detail.mediaId || e.detail.imageUrl)
    ) {
      galleryRegistry.forEach((gallery) => gallery.updateWithVariant(e.detail));
    }
  });
  document.addEventListener("variant:imageChanged", function (e) {
    if (
      e.detail &&
      (e.detail.variantId || e.detail.mediaId || e.detail.imageUrl)
    ) {
      galleryRegistry.forEach((gallery) => gallery.updateWithVariant(e.detail));
    }
  });

  // Expose API
  window.ProductGallery = {
    initAll,
    getAll: () => galleryRegistry,
  };

  // Auto-init on DOMContentLoaded
  document.addEventListener("DOMContentLoaded", initAll);
})();
