# Kinethera Theme

Shopify theme for KineThera, a health/wellness supplement brand. Production e-commerce theme with extensive customization, motion design elements, and conversion optimization features (upsells, guarantees, trust signals).

---

## Part 1: Architecture

### Directory Structure

```
kinethera-theme/
├── assets/        (261 files) CSS, JS, SVGs, images
├── config/        (2 files)   settings_schema.json + settings_data.json
├── layout/        (2 files)   theme.liquid + password.liquid
├── locales/       (51 files)  31 languages, each with .json + .schema.json
├── sections/      (72 files)  Page sections with schema definitions
├── snippets/      (110 files) Reusable Liquid components
└── templates/     (32 files)  JSON page templates + customer account templates
```

### Layout Files

- **`layout/theme.liquid`** (854 lines) — Main HTML shell. Defines all CSS variables in `:root`, loads fonts (Shopify + Google), includes core scripts (cart, product forms, animations). Handles RTL language detection.
- **`layout/password.liquid`** — Minimal template for password-protected/preview pages.

### Config System

- **`config/settings_schema.json`** (~2,900 lines) — All theme customizer settings: colors (5 schemes), typography (header/body/accent fonts), button styling, layout, animations, card/component styling, cart drawer, social media, search, and currency.
- **`config/settings_data.json`** — Active setting values. Current brand colors: background `#f7f9fd`, text `#2e3b48`, accent `#345c99`, buttons `#13ae5c`. Fonts: Host Grotesk (headers), Inter (body).

### Global Color System

5 color schemes (`scheme-1` through `scheme-5`) with per-scheme background, text, accent, and button colors.

**How it flows:**
1. Merchant sets global colors in `settings_schema.json` → stored in `settings_data.json`
2. `theme.liquid` outputs them as CSS variables on `:root` (e.g. `--gradient-background`, `--color-base-text`)
3. Each section has a `use_theme_colors` checkbox toggle:
   - **ON**: Section reads `settings.global_section_background_color`, `settings.global_section_text_color`, etc.
   - **OFF**: Section uses its own color picker settings as fallback

```liquid
{% if use_theme_colors %}
  background-color: {{ settings.global_section_background_color }};
{% else %}
  background: {{ section.settings.section_background | default: '#FFFFFF' }};
{% endif %}
```

Gradient support via `settings.global_section_use_gradient_background` and `settings.global_section_gradient`.

### Typography System

Three font tiers:
- **Header font**: Shopify font picker (`settings.type_header_font`), default Host Grotesk 700
- **Body font**: Shopify font picker (`settings.type_body_font`), default Inter 400
- **Accent font**: Google Fonts selection (`settings.type_accent_font`): Georgia Pro, Bodoni Moda, Instrument Serif, DM Serif Text, Nothing You Could Do, or `inherit`

Accent typography has a snippet trio for reuse:
- `snippets/accent-typography-style.liquid` — Inline CSS for accent text
- `snippets/accent-typography-settings.liquid` — Schema settings block (paste into section schema)
- `snippets/accent-typography-classes.liquid` — CSS classes for accent text

Sections can override global accent typography via `override_global_accent` toggle, falling back to CSS variables `--font-accent-family`, `--font-accent-style`, `--font-accent-weight`.

### Button System

Global button styling defined in settings: padding, font size/weight, letter spacing, text transform, border radius (default 40px), colors, hover brightness. Sections opt-in via `use_global_button_styling` checkbox. Key CSS files: `assets/global-buttons.css`, `assets/button-styling.css`, `assets/global-button-styles.css.liquid`.

### CSS Methodology

- **Variables**: Centralized in `theme.liquid` `:root`, using Liquid to output dynamic values
- **Naming**: BEM-like (`.class-element--modifier`)
- **Scoping**: Sections use inline `<style>` tags with `{{ section.id }}` for isolation
- **Base styles**: `assets/base.css` (3,745 lines) — grid, forms, accessibility, utilities
- **Component CSS**: `component-*.css` files loaded per-section via `{{ 'component-x.css' | asset_url | stylesheet_tag }}`
- **Lazy loading**: CSS loaded with `media="print" onload="this.media='all'"` pattern

### JavaScript Architecture

- **No framework** — Vanilla JS + Web Components (custom elements like `<variant-selects>`)
- **Pub/Sub** (`assets/pubsub.js` + `assets/constants.js`):
  ```js
  // Events:
  PUB_SUB_EVENTS.cartUpdate          // 'cart-update'
  PUB_SUB_EVENTS.quantityUpdate      // 'quantity-update'
  PUB_SUB_EVENTS.variantChange       // 'variant-change'
  PUB_SUB_EVENTS.optionValueSelectionChange // 'option-value-selection-change'
  PUB_SUB_EVENTS.cartError           // 'cart-error'

  // Usage:
  const unsub = subscribe(PUB_SUB_EVENTS.cartUpdate, (data) => { ... });
  publish(PUB_SUB_EVENTS.cartUpdate, { source: 'cart-drawer' });
  ```
- **Fetch API** for AJAX cart operations
- **Event delegation** for dynamic content
- **Deferred loading**: Scripts loaded with `defer` attribute

### Cart System

Core files and flow:
1. **`assets/cart.js`** (24KB) — Main cart logic: progress bar animation, component replacement, bubble count, free product management, cart drawer updates
2. **`assets/cart-function.js`** (18KB) — Helper utilities for cart operations
3. **`assets/cart-drawer.js`** (9KB) — Drawer UI: open/close, scroll, interaction
4. **`snippets/cart-drawer.liquid`** — Drawer markup with CSS variables for full color customization
5. **`sections/cart-drawer.liquid`** — Section wrapper with schema settings
6. **`assets/custom.js`** — Free product threshold logic, shipping protection toggle

Features: slide-out drawer, free shipping progress bar (threshold: $79.90), upsell carousel, shipping protection, money-back guarantee display, social proof bar, discount banners.

### Section → Snippet Rendering Map (Key Relationships)

| Section | Renders Snippets |
|---|---|
| `header.liquid` | `header-drawer`, `header-search`, `header-dropdown-menu`, `header-mega-menu`, `cart-icon-bubble` |
| `footer.liquid` | `social-icons`, `country-localization`, `language-localization`, `payment-icons` |
| `featured-product-details.liquid` | `product-media-gallery`, `product-variant-picker`, `buy-buttons`, `product-info`, `price`, `product-faq`, `product-bullet-list`, `product-labels`, `product-upsell-block`, `stock-indicator` |
| `collection-grid.liquid` | `card-product`, `price` |
| `cart-drawer.liquid` | `cart-drawer` (snippet), `cart-items`, `cart-discount-banner`, `cart-social_proof_bar`, `free-shipping-notice`, `payment-icons` |
| `customer-reviews-carousel.liquid` | `customer-review-card`, `image-rating` |

### Template → Section Mapping

JSON templates in `templates/` reference sections by type. Example from `index.json`:
```
new-hero → scrolling-features-bar → collection-grid → 4-cards → photo-grid → satisfaction-guarantee
```

Key templates:
- `index.json` — Homepage (hero, features bar, collection grid, cards, photo grid)
- `product.json` — Product page (product details, benefits, reviews, related products, sticky ATC)
- `collection.json` — Collection page (banner, product grid with facets)
- `cart.json` — Cart page (cart items, cart footer)
- `customers/*.json` — Account pages (login, register, addresses, orders)

### Motion / Kinetic Elements

The "Kinethera" name reflects the theme's emphasis on motion:
- **Scrolling ticker** (`scrolling-ticker.liquid`) — CSS keyframe marquee, configurable speed (5-50s)
- **Scrolling features bar** (`scrolling-features-bar.liquid`) — Marquee with velocity control, pause on hover
- **Benefits carousel** (`benefits-carousel.liquid`) — Infinite scroll animation
- **Customer reviews carousel** (`customer-reviews-carousel.liquid`) — Carousel with scroll amount
- **Before-after comparison** (`before-after-comparison.liquid`) — Touch/mouse drag slider
- **Reveal on scroll** (`assets/animations.js`) — IntersectionObserver-based, cascade timing via `data-cascade`
- **Countdown banner** (`announcement-bar.liquid`) — 15-second gradient animation loop
- **Dividers** (`divider.liquid`) — SVG shapes (cloud, wavy, diagonal) with flip/gradient options

### Third-Party Integrations

- **Kudosi Ali Reviews** — Product reviews (`snippets/alireviews_aggregateRating.liquid`)
- **Triple Whale** — Analytics tracking
- **Klaviyo** — Email marketing
- **AbiConvert** — A/B testing
- **KaChing Bundles** — Product bundles
- **Replo** — Page builder (`snippets/replo-head.liquid`, `snippets/reploChunk.*.liquid`)
- **Slick** — Carousel library (`assets/slick.min.js`, `assets/slick.css`)

### Responsive Breakpoints

```
480px | 576px | 768px | 900px | 1100px | 1300px | 1600px
```

Most sections provide separate desktop/mobile settings for padding, font sizes, icon sizes, and layout.

### Localization

31 languages supported. Each language has:
- `locales/{lang}.json` — UI translations (cart, products, account, etc.)
- `locales/{lang}.schema.json` — Customizer setting labels

Base language: `en.default.json` (~20KB). Translation categories: general, newsletter, accessibility, blogs, products, collections, cart, customers, gift cards, localization.

---

## Part 2: Quick Reference

### Adding a New Section

1. Create `sections/my-section.liquid`
2. Add markup + inline `<style>` scoped with `{{ section.id }}`
3. Add `{% schema %}` block at the bottom:

```liquid
{% schema %}
{
  "name": "My Section",
  "settings": [
    {
      "type": "checkbox",
      "id": "use_theme_colors",
      "label": "Use theme colors",
      "default": true
    },
    {
      "type": "range",
      "id": "padding_top",
      "min": 0, "max": 100, "step": 5, "unit": "px",
      "label": "Top Padding",
      "default": 40
    },
    {
      "type": "text",
      "id": "heading",
      "label": "Heading",
      "default": "Section Title"
    }
  ],
  "blocks": [
    {
      "type": "item",
      "name": "Item",
      "settings": [
        { "type": "text", "id": "title", "label": "Title" }
      ]
    }
  ],
  "presets": [
    {
      "name": "My Section"
    }
  ]
}
{% endschema %}
```

Key conventions:
- Always include `use_theme_colors` checkbox
- Provide separate mobile/desktop padding settings
- Use `{{ block.shopify_attributes }}` on block containers for inline editing
- Load section-specific CSS: `{{ 'my-section.css' | asset_url | stylesheet_tag }}`

### Adding a New Snippet

Create `snippets/my-snippet.liquid`, then render from a section:

```liquid
{% render 'my-snippet', product: product, show_badge: true, color: '#ff0000' %}
```

Inside the snippet, parameters are local variables — no need to declare them. Snippets cannot access outer scope variables unless passed explicitly.

### Modifying Theme Colors

**Global colors** (affect all sections with `use_theme_colors` on):
- Edit in Shopify Customizer → Theme Settings → Colors
- Settings keys: `global_section_background_color`, `global_section_text_color`, `global_section_accent_1_color`, `global_section_accent_2_color`
- Gradient toggle: `global_section_use_gradient_background` → `global_section_gradient`

**Section-specific colors** (when `use_theme_colors` is off):
- Each section has its own color pickers that override globals

**CSS variable chain**: `settings_data.json` → `theme.liquid` `:root` variables → section inline styles → component CSS

### Editing Cart Drawer

Key files to modify:
| File | What it controls |
|---|---|
| `snippets/cart-drawer.liquid` | Drawer HTML structure, CSS variables, layout |
| `sections/cart-drawer.liquid` | Section schema (customizer settings) |
| `assets/cart.js` | Cart logic, progress bar, free product management |
| `assets/cart-function.js` | Cart helper utilities |
| `assets/cart-drawer.js` | Drawer open/close UI behavior |
| `assets/custom.js` | Free product threshold, shipping protection toggle |
| `snippets/cart-discount-banner.liquid` | Discount offer banner in drawer |
| `snippets/cart-social_proof_bar.liquid` | Social proof display in drawer |
| `snippets/free-shipping-notice.liquid` | Free shipping progress bar |

### Working with Product Pages

Two product detail section variants:
- **`sections/featured-product-details.liquid`** — Main product showcase (default on product template)
- **`sections/shop-product-details.liquid`** — Alternative layout

Supporting sections commonly used on product pages:
- `product-benefits.liquid` — Feature/benefit list
- `related-products.liquid` — Related items carousel
- `sticky-add-to-cart.liquid` — Fixed ATC button on scroll
- `customer-reviews-carousel.liquid` — Review section
- `store-faq.liquid` — FAQ accordion

### Adding/Editing Section Blocks

Blocks are defined in the section's `{% schema %}` under `"blocks"`. Each block type gets its own settings. To iterate:

```liquid
{% for block in section.blocks %}
  <div {{ block.shopify_attributes }}>
    {{ block.settings.title }}
  </div>
{% endfor %}
```

Use `block.shopify_attributes` to enable Shopify's inline editing in the customizer.

### Working with Accent Typography

To add accent text support to a section:

1. Include the accent typography settings in your schema (copy from `snippets/accent-typography-settings.liquid`)
2. Add Google Fonts loading at the top of your section (see `sections/4-benefits.liquid` lines 1-18 for pattern)
3. Apply styles using the class system:
   - `global-accent-text` — Uses global accent font settings
   - `custom-accent-text` — Uses section-specific override settings
4. Toggle via `override_global_accent` checkbox: section-specific vs global accent font

Gradient text support:
```css
background: {{ section.settings.accent_text_gradient }};
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

### Adding a Translation Key

1. Add the key to `locales/en.default.json` under the appropriate category:
   ```json
   {
     "products": {
       "product": {
         "my_new_key": "My translation text"
       }
     }
   }
   ```
2. Use in Liquid: `{{ 'products.product.my_new_key' | t }}`
3. For customizer setting labels, add to `locales/en.default.schema.json`
4. Add translations to other language files as needed

### Key Liquid Patterns

**Theme color toggle** (used in nearly every section):
```liquid
{%- liquid
  assign use_theme_colors = section.settings.use_theme_colors
-%}
color: {% if use_theme_colors %}{{ settings.global_section_text_color }}{% else %}{{ section.settings.text_color }}{% endif %};
```

**Responsive settings** (separate mobile/desktop values):
```liquid
/* Mobile first */
padding: {{ section.settings.padding_top_mobile }}px;

@media screen and (min-width: 768px) {
  padding: {{ section.settings.padding_top_desktop }}px;
}
```

**Gradient background with solid fallback**:
```liquid
{% if section.settings.enable_gradient %}
  background: {{ section.settings.gradient_background }};
{% else %}
  background-color: {{ section.settings.background_color }};
{% endif %}
```

**Section-scoped styles**:
```liquid
<style>
  .my-section-{{ section.id }} {
    --text-color: {{ section.settings.text_color }};
  }
</style>
```

### Important File Paths

**Core**:
- `layout/theme.liquid` — Main template, CSS variables, font loading
- `config/settings_schema.json` — All theme settings definitions
- `config/settings_data.json` — Active setting values

**Cart**:
- `assets/cart.js`, `assets/cart-function.js`, `assets/cart-drawer.js`
- `snippets/cart-drawer.liquid`, `sections/cart-drawer.liquid`
- `assets/custom.js` (free product + shipping protection logic)

**Styling**:
- `assets/base.css` — Core styles and utilities
- `assets/global-buttons.css`, `assets/button-styling.css` — Button system
- `assets/typography-system.css` — Fluid typography
- `assets/animations.js` — Scroll-triggered animations

**Events**:
- `assets/pubsub.js` — Pub/Sub system (`subscribe`, `publish`)
- `assets/constants.js` — Event name constants

**Product**:
- `sections/featured-product-details.liquid`, `sections/shop-product-details.liquid`
- `snippets/product-variant-picker.liquid`, `snippets/buy-buttons.liquid`
- `snippets/price.liquid`, `snippets/product-media-gallery.liquid`
- `assets/product-form.js`, `assets/product-info.js`

**Navigation**:
- `sections/header.liquid`
- `snippets/header-drawer.liquid`, `snippets/header-mega-menu.liquid`, `snippets/header-dropdown-menu.liquid`

### Common Pub/Sub Events

| Event | Constant | When Fired |
|---|---|---|
| `cart-update` | `PUB_SUB_EVENTS.cartUpdate` | Cart contents change (add/remove/quantity) |
| `quantity-update` | `PUB_SUB_EVENTS.quantityUpdate` | Item quantity changes |
| `variant-change` | `PUB_SUB_EVENTS.variantChange` | Product variant selection changes |
| `option-value-selection-change` | `PUB_SUB_EVENTS.optionValueSelectionChange` | Option value selected |
| `cart-error` | `PUB_SUB_EVENTS.cartError` | Cart operation fails |

Usage:
```js
// Subscribe
const unsubscribe = subscribe(PUB_SUB_EVENTS.cartUpdate, (data) => {
  // React to cart changes
});

// Publish
publish(PUB_SUB_EVENTS.cartUpdate, { source: 'cart-drawer', cart: cartData });

// Cleanup
unsubscribe();
```
