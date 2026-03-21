/**
 * Statistics Grid JavaScript
 *
 * Handles the animation of circular progress indicators in the statistics grid:
 * - Animates the circles when they come into view
 * - Uses IntersectionObserver for performance
 * - Calculates proper circle offsets based on percentage values
 */

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    // Function to animate circles based on percentage
    function animateStatCircles() {
      const circles = document.querySelectorAll(".statistic-circle");

      circles.forEach((circle) => {
        const percentage = parseInt(circle.getAttribute("data-percentage"));
        const circumference = 2 * Math.PI * 50; // r = 50
        const progressCircle = circle.querySelector(".circle-progress");

        // Calculate the offset based on percentage
        const offset = circumference - (percentage / 100) * circumference;

        // Set the dash offset to show the correct percentage
        setTimeout(() => {
          progressCircle.style.strokeDasharray = circumference;
          progressCircle.style.strokeDashoffset = offset;
        }, 100);
      });
    }

    // Initialize the animation
    animateStatCircles();

    // Re-animate when they come into view using IntersectionObserver for better performance
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateStatCircles();
            }
          });
        },
        { threshold: 0.1 }
      );

      document.querySelectorAll(".statistics-section").forEach((section) => {
        observer.observe(section);
      });
    }
  });
})();

/*
 * Statistics Grid JavaScript
 *
 * Handles the animation of circular progress indicators in the statistics grid:
 * - Animates the circles when they come into view
 * - Uses IntersectionObserver for performance
 * - Calculates proper circle offsets based on percentage values
 */

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    // Function to animate circles based on percentage
    function animateStatCircles() {
      const circles = document.querySelectorAll(".statistic-circle");

      circles.forEach((circle) => {
        const percentage = parseInt(circle.getAttribute("data-percentage"));
        const circumference = 2 * Math.PI * 50; // r = 50
        const progressCircle = circle.querySelector(".circle-progress");

        // Calculate the offset based on percentage
        const offset = circumference - (percentage / 100) * circumference;

        // Set the dash offset to show the correct percentage
        setTimeout(() => {
          progressCircle.style.strokeDasharray = circumference;
          progressCircle.style.strokeDashoffset = offset;
        }, 100);
      });
    }

    // Initialize the animation
    animateStatCircles();

    // Re-animate when they come into view using IntersectionObserver for better performance
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateStatCircles();
            }
          });
        },
        { threshold: 0.1 }
      );

      document.querySelectorAll(".statistics-section").forEach((section) => {
        observer.observe(section);
      });
    }
  });
})();
