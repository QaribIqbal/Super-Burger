# Restaurant Template Ordering Experience Design

## Purpose

Turn Super Burger Co. into a reusable restaurant-site template with a polished menu, a realistic client-side ordering flow, and a credible production-quality baseline. The finished experience must feel like the same brand as the homepage while giving future implementers clear seams for replacing menu content, business details, checkout providers, and styling.

This design covers the menu, persistent cart, simulated checkout, shared site chrome, and the site-wide shortcomings discovered during the audit. It does not connect a real payment processor or store orders on a server.

## Current-State Audit

The repository is a Next.js 16 App Router project using React 19, TypeScript, CSS Modules, `next/font`, and static menu data. At the time of the audit, `npm run test`, `npm run lint`, and `npm run build` passed.

### Menu and ordering problems

- `/menu` renders without the shared header, footer, or a `main` landmark.
- The menu uses a single-column layout at desktop widths, allowing one image to consume almost the entire viewport.
- The category row clips the final option on a 390 px viewport.
- The “All Items” active styling is inverted after another category is selected.
- Attribute filters do nothing while “All Items” is selected because the filter is only applied inside the selected-category branch.
- Attribute filters cannot be toggled off, and their visual state is inconsistent.
- Updating the inline `border` and `borderColor` styles produces a Next.js runtime console warning.
- Product cards have no add-to-cart action, customization, availability state, allergen information, quantity control, or useful detail interaction.
- Homepage product links target item fragments that do not exist on `/menu`.
- The project has no cart, checkout, pricing policy, persistence strategy, or order confirmation.
- The menu is a 306-line client component with presentation, filter state, and business logic combined.

### Site-wide problems

- Calls to action use `https://order.example.com`, while phone, address, map, and social links are generic placeholders scattered across components.
- The gallery “View All Photos” link points to `#`.
- Privacy, terms, and accessibility links point to routes that do not exist.
- The newsletter form posts to `#` and provides no honest success or failure state.
- Header navigation uses page-relative fragments; these will break when shared navigation is rendered from `/menu` or `/checkout` unless changed to root fragments such as `/#story`.
- The mobile-menu toggle controls the desktop navigation ID rather than the rendered mobile navigation, and the drawer lacks deliberate focus restoration and Escape handling.
- Several components use large inline-style objects while older CSS modules remain in the tree. Duplicate files named `*.module 2.css` are tracked but unused.
- Business facts and ordering URLs are duplicated instead of coming from one typed configuration source.
- The home hero contains 299 PNG frames. The frame directory is approximately 413 MB, and the total image directory is approximately 530 MB. Current uncommitted work introduces sparse/on-demand frame loading and a local map image; that work must be preserved, reviewed, and integrated rather than overwritten.
- The hero eventually renders well on desktop, but its first load is visually blocked by the loader. On a 390 px viewport, the opening copy overlaps the central image and has weak contrast/readability.
- The location layout hard-codes a two-column grid and embeds an external map without an explicit lightweight/static-first loading strategy.

## Product Scope

### In scope

- Responsive, branded menu catalogue.
- Working category and attribute filters with reset and empty states.
- Typed menu items, modifier groups, dietary/allergen metadata, and availability.
- Product customization dialog for items with options.
- Persistent client-side cart with add, merge, update, remove, and clear behavior.
- Cart badge and modal drawer/sheet, including empty state and calculated totals.
- Checkout page with pickup/delivery choice, customer/contact fields, order notes, order summary, validation, and simulated submission.
- Demo confirmation page/state with generated order number and explicit “no payment collected” messaging.
- A replaceable order-submission adapter so a real API or provider can be added later.
- Shared header/footer and centralized business configuration.
- Repair of dead, misleading, or placeholder interactions.
- Accessibility, responsive, performance, and template-maintainability improvements related to these flows.
- Automated unit/component coverage plus browser verification of the primary journey.

### Out of scope

- Real payments, Stripe, PCI handling, saved payment methods, refunds, or receipts.
- Accounts, sign-in, loyalty programs, server-side order history, or admin tools.
- Inventory synchronization or a content-management system.
- Live delivery quotes, dispatch, maps/geocoding, or location search.
- Coupons, gift cards, complex promotions, tips, scheduled ordering, or multi-location stock.
- Replacing the homepage’s core visual concept or adding unrelated marketing sections.

## Experience Design

### Shared shell

The root layout owns the cart provider and consistent site shell. Header and footer must render on `/`, `/menu`, and `/checkout`; individual route files do not duplicate them. Root-fragment links use `/#story`, `/#how-its-made`, and `/#locations` so they work from every route.

The header adds a cart control with an item-count badge and accessible name. On small screens, the cart control remains visible beside the navigation toggle. The mobile navigation has its own controlled ID, closes on Escape and navigation, restores focus to the toggle, and prevents background interaction while modal.

### Menu page

The first viewport must immediately expose the page title, short useful ordering context, category controls, and multiple products. It must not use a marketing hero before the catalogue.

Desktop uses a constrained content width, a sticky category/filter toolbar below the header, and a two- or three-column card grid according to available width. Product images use a consistent, deliberately cropped aspect ratio. Tablet uses two columns. Mobile uses one compact column, horizontally scrollable category tabs with visible overflow affordance, and a persistent bottom cart button once the cart is non-empty.

Each product card contains:

- stable `id` for deep links;
- image and fallback presentation;
- product name and concise description;
- price or “from” price;
- dietary/popularity labels when meaningful;
- concise allergen disclosure or an accessible details affordance;
- availability state; and
- an Add or Customize action.

Category selection and attribute selection are independent. The result set is the intersection of the selected category and all active attribute filters. Selecting an active filter toggles it off. “All Items” means no category constraint. “Clear filters” resets all controls. The filtered result count is announcedly announced without making the entire catalogue a noisy live region. An empty result explains that nothing matches and offers a reset action.

When a deep link such as `/menu#double-smash` loads, the corresponding card exists, receives a temporary visual highlight, and is scrolled below the fixed toolbar without obscuring its heading.

### Product customization

Items without required choices may be added directly. Items with modifier groups open an accessible modal dialog. The dialog includes the product summary, required and optional groups, selection limits, live price, quantity, special instructions, and Add to cart action.

Required single-choice groups use radios. Optional multi-choice groups use checkboxes and enforce their maximum selection count. The add action stays disabled until required groups are valid, with a plain-language explanation. Closing returns focus to the initiating product action.

### Cart

The cart opens as a right-side modal sheet on desktop and a full-height modal sheet on mobile. It contains editable line items, selected modifiers, per-line totals, quantity controls, remove actions, order summary, clear-cart action, and checkout action.

Lines merge only when product ID, selected modifiers, and normalized special instructions are identical. Differently customized items remain distinct. Quantity is constrained to 1–20 per line. Destructive clear-cart behavior requires confirmation only when more than one line is present; removing a single line remains directly reversible by adding it again.

The summary calculates subtotal, tax, fulfillment fee, and total from integer cents. The cart shows pickup pricing by default and recalculates when delivery is selected at checkout. Empty state provides a direct return to the menu.

Cart persistence is device-local and explicitly versioned. Storage contains IDs, selected modifier IDs, normalized notes, and quantities—not duplicated product prices or names. Hydration rebuilds display/pricing data from the current menu catalogue so template updates do not retain stale prices.

### Checkout and confirmation

Checkout is a real form experience but a simulated transaction. It supports pickup and delivery. Pickup requires name, phone, email, and optional notes. Delivery additionally requires address, city, region, postal code, and delivery instructions. The order summary remains visible on desktop and collapses into a labelled disclosure on mobile.

Validation occurs on blur and submission. Errors appear beside their fields and in a focusable summary. The form preserves valid values after a failed submission. The submit button prevents duplicate submission and exposes a clear processing state.

The demo adapter resolves locally after a short deterministic delay and returns a generated order ID and timestamp. Confirmation states that the order is a demonstration, no payment was collected, and no restaurant received the request. Successful submission clears the active cart only after confirmation data has been created. Refreshing the confirmation route must not invent a second order; confirmation data is passed through an explicit local session record or route state with a safe missing-state fallback.

## Architecture

### Boundaries

- **Business configuration:** one typed module owns brand name, currency/locale, tax rate, delivery fee, contact details, hours, social URLs, feature flags, and demo-mode text.
- **Catalogue domain:** menu types and data own product, tag, allergen, modifier-group, availability, and base-price definitions.
- **Cart domain:** pure reducer and selectors own state transitions, canonical line keys, quantities, and derived counts.
- **Pricing domain:** pure functions calculate modifier deltas, line totals, subtotal, tax, fee, and grand total in integer cents.
- **Persistence adapter:** validates versioned unknown storage data and hydrates only current catalogue records.
- **Order adapter:** accepts a validated checkout payload and returns a typed confirmation. The initial adapter is local/demo-only.
- **UI components:** route surfaces consume domain interfaces but do not recalculate prices or directly read/write localStorage.

### Proposed source organization

The implementation plan may adjust exact filenames to existing conventions, but responsibilities must remain separated:

```text
app/
  layout.tsx
  page.tsx
  menu/page.tsx
  checkout/page.tsx
components/
  site/Header.tsx
  site/Footer.tsx
  menu/MenuCatalog.tsx
  menu/MenuToolbar.tsx
  menu/MenuItemCard.tsx
  menu/ProductCustomizer.tsx
  cart/CartProvider.tsx
  cart/CartButton.tsx
  cart/CartDrawer.tsx
  cart/CartLineItem.tsx
  checkout/CheckoutForm.tsx
  checkout/OrderSummary.tsx
lib/
  business-config.ts
  menu-data.ts
  cart.ts
  pricing.ts
  cart-storage.ts
  checkout.ts
  demo-order-adapter.ts
```

Styles live beside the components they style. Repeated design decisions are tokens in `styles/tokens.css`; component-specific layout stays in CSS modules. Event-driven inline style mutation is removed. Existing components may be moved gradually, but the plan must avoid a broad rewrite that is unrelated to ordering.

### Core data rules

- Money is represented as integer cents.
- Product and modifier IDs are stable kebab-case strings.
- Modifier groups define `minSelections` and `maxSelections`; UI and validation use the same values.
- Cart line IDs are derived from canonical product/modifier/note input and are stable across reloads.
- Prices are always recalculated from current catalogue data.
- Unavailable or deleted catalogue entries are rejected during add and dropped during hydration.
- Cart schema changes increment a storage version and define a deliberate reset or migration path.
- React components consume selectors and commands exposed by `CartProvider`; they do not import reducer internals.

## Error and Recovery Design

- Invalid or corrupted localStorage resets to an empty cart without breaking rendering.
- Storage quota or privacy-mode failures keep the current in-memory cart usable and show at most one non-blocking persistence notice.
- Invalid modifier combinations are rejected by the same domain validator used by the UI.
- Missing or failed images preserve card geometry and show a branded fallback without misleading alternative text.
- Empty catalogue and empty filter results have different messages and recovery actions.
- Direct access to checkout with an empty cart redirects or presents a clear return-to-menu state.
- Direct access to confirmation without confirmation data presents a safe “No demo order found” state.
- Demo submission failures are injectable for testing and leave cart/form state intact.
- Placeholder external URLs are never shipped as working CTAs. A configured URL renders a working link; an unconfigured capability renders honest non-interactive copy or is hidden.

## Accessibility Requirements

- One `main` landmark and one page-level heading per route.
- Skip link targets an existing focusable main element on every route.
- Category controls use tabs or pressed buttons consistently; attribute filters use pressed toggle buttons or checkboxes with clear visible state.
- All touch targets are at least 44 by 44 CSS pixels where they are primary controls.
- Modal surfaces use native `<dialog>` where practical, with labelled title/description, automatic background inertness, Escape close, and focus restoration.
- Quantity controls expose product-specific accessible names and announce the updated quantity without excessive live-region output.
- Cart updates provide a concise polite announcement.
- Validation summary receives focus on failed submission and links to invalid fields.
- Focus indicators remain visible on all interactive surfaces.
- Body text remains at least 16 px, regular control labels at least 14 px, and content remains usable at 200% text zoom.
- Color contrast meets WCAG 2.2 AA, including muted descriptions, placeholder text, tags, and controls over images.
- Reduced-motion users receive no scroll-dependent requirement and no essential content hidden behind animation.

## Responsive Requirements

- Verify at 390×844, 768×1024, and 1440×900.
- No clipped category, filter, header, cart, dialog, summary, or checkout controls.
- No unintended horizontal page scrolling.
- Sticky menu controls and the mobile cart bar do not cover deep-linked products or the final card.
- The desktop card grid shows multiple products above the fold.
- Mobile product imagery cannot exceed roughly half of the initial viewport height.
- Dialog and cart contents have their own safe scrolling regions while the document background remains fixed.

## Site-Wide Template Hardening

The ordering work includes a focused cleanup of related site quality issues:

1. Centralize business/contact/order/social data and remove component-local duplicates.
2. Make all navigation targets valid across routes.
3. Replace dead gallery/legal/newsletter actions with implemented routes/behavior or honest disabled/hidden states. Do not leave `#` actions.
4. Make the newsletter a local demo interaction with validation and explicit “not submitted” disclosure, or hide it behind configuration.
5. Replace placeholder map embedding with the in-progress local map image plus configurable directions link, unless a real map URL is configured.
6. Remove tracked duplicate `*.module 2.css` files only after confirming they are unused.
7. Move touched inline styles into focused CSS modules and reuse shared tokens. Do not refactor untouched visual sections solely for uniformity.
8. Preserve the current home design, but correct mobile hero legibility and loader behavior.
9. Finish and test the in-progress sparse/on-demand hero-frame loading. Add a future asset-production note recommending compressed WebP/AVIF frames or a video fallback; do not require conversion of all 299 source frames in this feature unless measurement shows it is necessary for acceptance.
10. Use a static-first location visual and defer any external map/embed until user interaction.

## Testing Strategy

### Pure unit tests

Use the existing Node test runner for domain modules where practical:

- filter intersection and reset behavior;
- modifier validation and price deltas;
- canonical cart-line key generation;
- add/merge/update/remove/clear reducer transitions;
- quantity boundaries;
- subtotal, tax, fee, and total rounding;
- storage parsing, schema versions, corrupted data, missing products, and stale modifiers;
- checkout payload validation; and
- demo adapter success/failure contracts.

### Component tests

Add the smallest React testing setup needed to verify behavior that pure tests cannot cover:

- filter toggles and empty-state reset;
- Add versus Customize behavior;
- dialog required-option validation and focus restoration;
- cart announcements, quantities, and checkout enablement;
- checkout error summary and conditional delivery fields; and
- explicit demo disclosure on confirmation.

### Browser acceptance checks

Run the complete journey at desktop and mobile sizes:

1. Open `/menu` and confirm shared navigation and multiple visible products.
2. Combine category and tag filters, toggle them off, and reset an empty result.
3. Open a deep-linked product from the homepage.
4. Customize an item, add it twice, and confirm merge behavior.
5. Add the same item with different options and confirm separate lines.
6. Reload and confirm cart persistence.
7. Edit quantities, remove a line, and verify all totals.
8. Complete pickup checkout and verify demo confirmation and cart clearing.
9. Attempt invalid delivery checkout and verify focus/error behavior and value preservation.
10. Navigate the menu, dialogs, cart, and checkout by keyboard only.
11. Repeat key checks with reduced motion and at 200% text zoom.
12. Confirm no Next.js error overlay or console errors appear.

### Required commands

Every phase must keep these commands green:

```bash
npm run test
npm run lint
npm run build
```

If the implementation adds component or end-to-end test scripts, they become required alongside the existing commands.

## Acceptance Criteria

The feature is complete when:

- A visitor can browse, filter, customize, cart, checkout, and reach an explicit demo confirmation without encountering a dead end.
- Cart data survives reloads and safely recovers from invalid stored data.
- All totals are consistent across menu, cart, checkout, and confirmation.
- `/menu` and `/checkout` look and behave like part of the homepage brand at all required widths.
- Every visible action is implemented, truthfully labelled as a demo, configurable, or intentionally absent.
- Homepage menu deep links, shared navigation, mobile navigation, skip links, and focus behavior work across routes.
- The audited runtime style warning is gone and no new console errors appear.
- Existing tests, lint, and production build pass, along with the new ordering tests.
- Current uncommitted hero-loading and map-asset work remains intact and is either incorporated or explicitly isolated before execution begins.

## Execution Constraint for Luna 5.6

The implementation plan must be executable by Luna 5.6 without architectural inference. Each task must name exact files, interfaces, test cases, commands, expected failures/successes, and a narrow commit boundary. The executor must inspect the current diff before every task that touches `BurgerAnimation.tsx`, gallery-asset tests, frame-loading modules, or location assets so it does not overwrite concurrent user work.
