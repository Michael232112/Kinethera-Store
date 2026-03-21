/**
 * Scrolling Ticker JavaScript
 *
 * Enhances the scrolling ticker functionality by:
 * - Calculating exact pixel distances for seamless infinite scrolling
 * - Pausing animation on hover/touch
 * - Resuming animation when hover/touch ends
 * - Eliminating reset glitches with precise positioning
 */

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    const tickerWrappers = document.querySelectorAll(".ticker-wrapper");

    tickerWrappers.forEach((wrapper) => {
      const track = wrapper.querySelector(".ticker__track");
      const firstContent = wrapper.querySelector(".ticker__content");
      
      if (!track || !firstContent) return;

      // Calculate the exact width of one content block
      const contentWidth = firstContent.offsetWidth;
      
      // Create unique keyframes for this ticker instance
      const animationId = Math.random().toString(36).substr(2, 9);
      const styleSheet = document.createElement('style');
      styleSheet.textContent = `
        @keyframes ticker-scroll-${animationId} {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-${contentWidth}px, 0, 0); }
        }
      `;
      document.head.appendChild(styleSheet);
      
      // Apply the animation with the exact pixel distance
      const duration = getComputedStyle(wrapper).getPropertyValue('--scroll-speed');
      track.style.animation = `ticker-scroll-${animationId} ${duration} linear infinite`;
      track.style.animationPlayState = "running";

      // Store animation reference for cleanup
      track.setAttribute('data-animation-id', animationId);
      track.setAttribute('data-stylesheet', styleSheet);

      // Pause on hover
      wrapper.addEventListener("mouseenter", () => {
        track.style.animationPlayState = "paused";
      });

      // Resume on mouse leave
      wrapper.addEventListener("mouseleave", () => {
        track.style.animationPlayState = "running";
      });

      // Pause on touch (mobile)
      wrapper.addEventListener("touchstart", () => {
        track.style.animationPlayState = "paused";
      }, { passive: true });

      // Resume on touch end (mobile)
      wrapper.addEventListener("touchend", () => {
        track.style.animationPlayState = "running";
      }, { passive: true });

      // Handle visibility change (pause when tab is not visible for performance)
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          track.style.animationPlayState = "paused";
        } else {
          // Only resume if not being hovered
          if (!wrapper.matches(':hover')) {
            track.style.animationPlayState = "running";
          }
        }
      });

      // Recalculate on window resize
      let resizeTimer;
      window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          const newContentWidth = firstContent.offsetWidth;
          const newAnimationId = Math.random().toString(36).substr(2, 9);
          const newStyleSheet = document.createElement('style');
          newStyleSheet.textContent = `
            @keyframes ticker-scroll-${newAnimationId} {
              0% { transform: translate3d(0, 0, 0); }
              100% { transform: translate3d(-${newContentWidth}px, 0, 0); }
            }
          `;
          document.head.appendChild(newStyleSheet);
          
          // Apply new animation
          const newDuration = getComputedStyle(wrapper).getPropertyValue('--scroll-speed');
          track.style.animation = `ticker-scroll-${newAnimationId} ${newDuration} linear infinite`;
          track.style.animationPlayState = wrapper.matches(':hover') ? "paused" : "running";
          
          // Clean up old stylesheet
          const oldStyleSheet = track.getAttribute('data-stylesheet');
          if (oldStyleSheet && oldStyleSheet.parentNode) {
            oldStyleSheet.parentNode.removeChild(oldStyleSheet);
          }
          
          track.setAttribute('data-animation-id', newAnimationId);
          track.setAttribute('data-stylesheet', newStyleSheet);
        }, 250);
      });
    });
  });
})();
