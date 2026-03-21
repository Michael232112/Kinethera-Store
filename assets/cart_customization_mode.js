document.addEventListener('DOMContentLoaded', function () {
    const cartDrawer = document.querySelector('cart-drawer');

    if (cartDrawer && cartDrawer.classList.contains('customization-mode')) {
        // Force open the cart drawer
        if (typeof cartDrawer.open === 'function') {
            cartDrawer.open();
        }

        // Override the close method to prevent closing in customization mode
        if (typeof cartDrawer.close === 'function') {
            const originalClose = cartDrawer.close;
            cartDrawer.close = function () {
                // Prevent closing when customization mode is active
                return false;
            };
        }

        // Disable overlay clicks
        const overlay = cartDrawer.querySelector('.cart-drawer__overlay');
        if (overlay) {
            overlay.style.pointerEvents = 'none';
        }

        // Add click handlers to close buttons to show a message instead
        const closeButtons = cartDrawer.querySelectorAll('.drawer__close');
        closeButtons.forEach((button) => {
            button.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                alert('Cart Customization Mode is active. Disable it in Theme Settings > Cart Drawer to allow closing.');
            });
        });

        // Keep the drawer visible even if cart becomes empty
        const observer = new MutationObserver(function (mutations) {
            if (cartDrawer.classList.contains('is-empty')) {
                setTimeout(() => {
                    if (typeof cartDrawer.open === 'function') {
                        cartDrawer.open();
                    }
                }, 100);
            }
        });

        observer.observe(cartDrawer, {
            attributes: true,
            attributeFilter: ['class'],
        });
    }
});