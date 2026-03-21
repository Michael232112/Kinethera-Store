document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
      initStickyAddToCart();
    }, 500);
    
    function initStickyAddToCart() {
      const stickyElement = document.getElementById('stickyAddToCart');
      
      const addToCartSelectors = [
        'button[name="add"]',
        'button.add-to-cart',
        'button.add-to-cart-button',
        'button.product-form__cart-submit',
        'button.product-form__submit',
        'form[action*="/cart/add"] button[type="submit"]',
        '.ProductForm__AddToCart'
      ];
      
      let addToCartButton = null;
      
      for (const selector of addToCartSelectors) {
        const button = document.querySelector(selector);
        if (button) {
          addToCartButton = button;
          break;
        }
      }
      
      if (!addToCartButton) {
        const observer = new MutationObserver(function(mutations) {
          for (const selector of addToCartSelectors) {
            const button = document.querySelector(selector);
            if (button) {
              addToCartButton = button;
              observer.disconnect();
              setupScrollHandler();
              break;
            }
          }
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
        
        setTimeout(function() {
          observer.disconnect();
        }, 10000);
      } else {
        setupScrollHandler();
      }
      
      function setupScrollHandler() {
        const scrollThreshold = -100;
        
        let isVisible = false;
        let debounceTimer = null;
        
        function handleScroll() {
          if (!addToCartButton) return;
          
          // Maintain hiding based on settings
          const desktopShipping = document.querySelector('.sticky-add-to-cart__shipping');
          const mobileShipping = document.querySelector('.mobile-shipping-info');
          
          if (desktopShipping && window.stickySettings) {
            if (window.stickySettings.showDesktopShipping === false || window.stickySettings.showDeliveryDate === false) {
              desktopShipping.style.display = 'none';
              desktopShipping.setAttribute('aria-hidden', 'true');
            }
          }
          
          if (mobileShipping && window.stickySettings) {
            if (window.stickySettings.showMobileShipping === false || window.stickySettings.showDeliveryDate === false) {
              mobileShipping.style.display = 'none';
              mobileShipping.setAttribute('aria-hidden', 'true');
            }
          }
          
          // Hide when cart drawer is open
          const cartDrawerWrapper = document.querySelector('cart-drawer.drawer, .drawer.cart-drawer, .cart-drawer');
          const cartSidebar = document.querySelector('#sidebar-cart, #CartDrawer, .cart-sidebar');
          const isCartOpen = cartDrawerWrapper && 
                             ((cartDrawerWrapper.classList.contains('active') || 
                               cartDrawerWrapper.classList.contains('is-open') ||
                               cartDrawerWrapper.classList.contains('drawer--is-open') ||
                               cartDrawerWrapper.hasAttribute('open') ||
                               cartDrawerWrapper.getAttribute('aria-hidden') === 'false')) ||
                             (cartSidebar && 
                              (cartSidebar.classList.contains('is-open') || 
                               cartSidebar.classList.contains('drawer--is-open') ||
                               cartSidebar.getAttribute('aria-hidden') === 'false'));
          
          if (isCartOpen) {
            hideStickyButton();
            return;
          }
          
          const addToCartRect = addToCartButton.getBoundingClientRect();
          const buttonBottom = addToCartRect.bottom;
          
          const shouldBeVisible = buttonBottom < scrollThreshold;
          
          if (shouldBeVisible !== isVisible) {
            clearTimeout(debounceTimer);
            
            debounceTimer = setTimeout(() => {
              if (shouldBeVisible) {
                showStickyButton();
              } else {
                if (buttonBottom > (scrollThreshold + 150)) {
                  hideStickyButton();
                }
              }
            }, 50);
          }
        }
        
        function showStickyButton() {
          if (isVisible) return;
          
          stickyElement.style.display = 'block';
          
          void stickyElement.offsetWidth;
          
          stickyElement.classList.add('show');
          isVisible = true;
        }
        
        function hideStickyButton() {
          if (!isVisible) return;
          
          stickyElement.classList.remove('show');
          
          setTimeout(() => {
            if (!stickyElement.classList.contains('show')) {
              stickyElement.style.display = 'none';
            }
            isVisible = false;
          }, 400);
        }
        
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        window.addEventListener('resize', handleScroll, { passive: true });
        
        // Check for cart drawer events
        document.addEventListener('click', function(e) {
          if (e.target.closest('[data-action="open-drawer"], [data-open-cart], .js-drawer-open-cart, .cart-link')) {
            setTimeout(handleScroll, 100);
          }
        });
        
        // Listen for custom events that might be triggered when cart is opened
        document.addEventListener('cart:open', handleScroll);
        document.addEventListener('cart-drawer:open', handleScroll);
        document.addEventListener('cart.requestStarted', handleScroll);
        document.addEventListener('cartDrawerOpened', handleScroll);
        
        // Setup a mutation observer to detect when drawer gets aria-hidden="false"
        const drawerObserver = new MutationObserver(function(mutations) {
          for (let mutation of mutations) {
            if (mutation.type === 'attributes' && 
                (mutation.attributeName === 'aria-hidden' || 
                 mutation.attributeName === 'class' ||
                 mutation.attributeName === 'open')) {
              handleScroll();
            }
          }
        });
        
        const cartDrawers = document.querySelectorAll('cart-drawer, #sidebar-cart, #CartDrawer, .cart-drawer');
        cartDrawers.forEach(drawer => {
          drawerObserver.observe(drawer, { attributes: true });
        });
        
        setTimeout(handleScroll, 300);
        
        setInterval(handleScroll, 2000);
      }
    }
  });
  
  // Function to scroll to top when button is clicked
  function scrollToTop(event) {
    event.preventDefault();
    
    // Smooth scroll to top
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
  
  // Make scrollToTop globally available
  window.scrollToTop = scrollToTop;