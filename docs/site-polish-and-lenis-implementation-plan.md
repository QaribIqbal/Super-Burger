# Super Burger Co. Site Polishing and Lenis Smooth Scrolling Implementation Plan

## 1. Purpose and expected outcome

This plan defines a safe, staged implementation for polishing the Super Burger Co. marketing site and adding Lenis smooth scrolling. It is written so that an engineer or a weak coding model can execute it without making architectural guesses.

The finished site should preserve the current brand direction: cream and rust split backgrounds, bold burger-focused typography, hand-written accent text, and the scroll-driven burger animation. The work must improve perceived quality without replacing working content unnecessarily.

The implementation must satisfy five outcomes:

1. The page scrolls smoothly on desktop and remains native-feeling on touch devices.
2. The existing hero animation remains synchronized with the actual scroll position.
3. Anchor links, keyboard navigation, reduced-motion preferences, mobile navigation, and nested scrollable areas continue to work.
4. Every section has consistent spacing, typography, focus states, responsive behavior, and reveal transitions.
5. The result is production-safe: no hydration errors, no duplicate animation loops, no scroll-lock bugs, and no new lint or TypeScript errors.

> **Important constraint:** Do not add Lenis by creating a second custom scrolling container unless there is a compelling reason. Use Lenis on the document root so the current `position: sticky` hero and normal browser layout continue to work.

## 2. Current project baseline

The project is a Next.js App Router site using React, TypeScript, CSS Modules, and `next/font/google`. The home page composes the site in this order:

| Order | Component | Current role | Primary files |
|---:|---|---|---|
| 1 | Header | Fixed navigation, order CTA, mobile menu | `components/Header.tsx`, `components/Header.module.css` |
| 2 | ScrollySection | 400vh sticky hero with 120 canvas frames | `components/ScrollySection.tsx`, `components/BurgerAnimation.tsx`, `components/ScrollyCopy.tsx`, `components/Hero.module.css` |
| 3 | USP | Feature/value proposition section | `components/USP.tsx`, `components/USP.module.css` |
| 4 | SignaturePicks | Menu cards or signature products | `components/SignaturePicks.tsx`, `components/SignaturePicks.module.css` |
| 5 | About | Brand story split section | `components/About.tsx`, `components/About.module.css` |
| 6 | Gallery | Image gallery | `components/Gallery.tsx`, `components/Gallery.module.css` |
| 7 | Location | Visit/location information | `components/Location.tsx`, `components/Location.module.css` |
| 8 | FinalCTA | Final ordering call to action | `components/FinalCTA.tsx`, `components/FinalCTA.module.css` |
| 9 | Footer | Navigation, contact, newsletter, legal links | `components/Footer.tsx`, `components/Footer.module.css` |

The root composition lives in `app/page.tsx`. Global styles and design tokens live in `app/globals.css` and `styles/tokens.css`. The package currently does not include Lenis.

The hero currently calculates scroll progress from the track's `getBoundingClientRect()` in a window scroll listener. After Lenis is added, that calculation must continue to use the browser's document geometry, but it should be scheduled from Lenis scroll events or a single frame-coalesced update rather than creating a second independent smooth-scroll loop.

## 3. Non-negotiable implementation rules

### 3.1 Preserve the current layout model

Do not convert the site to a full-screen custom scroller. Keep the document as the scroll container. Keep the hero sticky region inside its existing 400vh track. Keep the 120-frame canvas animation architecture unless performance testing proves it unusable.

### 3.2 Keep one owner for each animation loop

Lenis owns smooth scrolling. The hero owns frame selection and canvas drawing. Do not add a second `requestAnimationFrame` loop to update Lenis if `ReactLenis` is using its default `autoRaf` behavior. Do not add GSAP solely for this task.

### 3.3 Respect reduced motion

Lenis must honor `prefers-reduced-motion`. The hero must stop or minimize frame animation for reduced-motion users. CSS transitions and reveal animations must be disabled or reduced in the existing reduced-motion media query.

### 3.4 Prefer progressive enhancement

If JavaScript fails, the document must remain readable and natively scrollable. If Lenis fails to initialize, do not hide content or lock the body. If frame assets fail, the loading state must not block the rest of the page permanently.

### 3.5 Do not hide content for polish

Reveal effects may animate opacity and transform, but content must remain present in the DOM and accessible to assistive technologies. Avoid `display: none` for content that should be read or keyboard reachable.

## 4. Recommended implementation sequence

Implement in this exact order. Complete and verify each phase before starting the next phase.

| Phase | Scope | Main output | Must pass before continuing |
|---:|---|---|---|
| 0 | Baseline and safety snapshot | Known-good baseline and documented current issues | Existing production build passes |
| 1 | Lenis dependency and root provider | One document-level Lenis instance | No hydration errors; native links still work |
| 2 | Hero synchronization | Hero progress uses Lenis-aware updates | Frame changes remain stable and accurate |
| 3 | Anchor navigation | Header/footer links animate correctly | Correct offset below fixed header |
| 4 | Design-system polish | Consistent tokens, spacing, buttons, focus states | All sections remain responsive |
| 5 | Section reveal and micro-interactions | Subtle, accessible polish | No layout shift or motion violations |
| 6 | Mobile and reduced-motion hardening | Touch-safe and accessible behavior | iOS/Android and reduced-motion checks pass |
| 7 | Performance and QA | Production-ready result | Build, lint, keyboard, visual, and scroll checks pass |

## 5. Phase 0 — establish a baseline before changing behavior

### Step 0.1: Record the current state

Before editing, run:

```bash
npm run build
npm run lint
```

Record whether each command passes. Do not attribute existing errors to the Lenis work. At the time this plan was written, the project build passed, while lint reported unrelated existing errors in menu and content components.

Also record these manual baseline checks:

- Load `/` at desktop width around 1440px.
- Load `/` at tablet width around 768px.
- Load `/` at mobile width around 390px.
- Scroll through the complete hero track.
- Click every header navigation item.
- Open and close the mobile menu.
- Tab through the page from the top.
- Enable `prefers-reduced-motion` in browser settings.
- Open `/menu` directly and use its controls.

### Step 0.2: Create a rollback point

Create a git commit or checkpoint before installing Lenis. Do not mix unrelated content edits into the Lenis commit. The first commit should contain only the dependency and root integration if possible.

## 6. Phase 1 — install and integrate Lenis at the document root

The official Lenis React package is included in the `lenis` package. Its current React API provides `ReactLenis` and `useLenis`. The recommended CSS is `lenis/dist/lenis.css`. Lenis supports a root instance, `anchors`, `stopInertiaOnNavigate`, `smoothWheel`, `lerp`, and `respectReducedMotion` options. [1] [2]

### Step 6.1: Install the dependency

From the project root, run:

```bash
npm install lenis
```

Do not install the obsolete `@studio-freight/lenis` or an unrelated third-party React wrapper.

### Step 6.2: Create a client-only scroll provider

Create `components/SmoothScroll.tsx` with this responsibility only:

1. Mark the file with `"use client"`.
2. Import `ReactLenis` from `lenis/react`.
3. Import `lenis/dist/lenis.css` once in this client component or in the global stylesheet according to the project’s Next.js CSS import rules.
4. Render `<ReactLenis root options={...}>{children}</ReactLenis>`.
5. Accept and return `children` with a typed `ReactNode` prop.
6. Do not manually call `requestAnimationFrame` when using the default `autoRaf` behavior.

Use a conservative starting configuration:

```tsx
<ReactLenis
  root
  options={{
    autoRaf: true,
    anchors: {
      offset: -72,
      duration: 0.9,
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
    },
    smoothWheel: true,
    lerp: 0.1,
    smoothTouch: false,
    syncTouch: false,
    stopInertiaOnNavigate: true,
    respectReducedMotion: true,
  }}
>
  {children}
</ReactLenis>
```

If the installed Lenis type does not accept one of these option names, remove only the unsupported option and use the package’s installed type definition as the source of truth. Do not cast the complete options object to `any`.

The `offset` must be adjusted if the actual fixed header height differs from `72px`. Prefer a CSS custom property or a shared constant so the header and Lenis use the same value.

### Step 6.3: Wrap the application body

In `app/layout.tsx`, import `SmoothScroll` and wrap `{children}` inside it. The structure should remain conceptually:

```tsx
<body>
  <a className="skip-to-content" href="#main-content">Skip to content</a>
  <SmoothScroll>{children}</SmoothScroll>
</body>
```

Do not put the provider around `<html>`. Do not make `app/layout.tsx` a client component just to initialize Lenis.

### Step 6.4: Apply the Lenis CSS and remove conflicting behavior

Import the official Lenis stylesheet exactly once. Inspect its rules before adding local overrides. Remove or override global `html { scroll-behavior: smooth; }` because two smooth-scroll systems can fight each other. Use `scroll-behavior: auto` as the default and let Lenis handle animated anchor movement.

Keep `overscroll-behavior-x: none` on the document if horizontal bounce is a problem. Do not set `overflow: hidden` on `html` or `body` for the root integration.

### Step 6.5: Verify the root integration

After this phase:

- The page scrolls with a mouse wheel.
- Trackpad scrolling does not continuously accelerate.
- Touch scrolling remains native on mobile.
- Browser refresh restores a usable page.
- The skip link still moves focus to `#main-content`.
- No server/client hydration error appears.
- No duplicate scrollbar appears.
- Keyboard Page Up, Page Down, Home, End, and arrow keys still work.

## 7. Phase 2 — synchronize the hero with Lenis without adding a second scroll engine

### Step 7.1: Refactor `ScrollySection.tsx` to expose one progress calculation

Extract the current geometry calculation into a stable callback named `updateProgress` or equivalent. It should calculate:

```ts
const rect = track.getBoundingClientRect();
const scrollable = track.offsetHeight - window.innerHeight;
const progress = Math.max(0, Math.min(1, -rect.top / scrollable));
```

Handle `scrollable <= 0` by using progress `0` rather than dividing by zero.

### Step 7.2: Subscribe to Lenis scroll events

Use `useLenis` inside `ScrollySection.tsx` or create a small `useHeroScrollProgress` hook. On each Lenis scroll callback, call the progress updater. Because React state updates on every scroll can be expensive, use one of these safe approaches:

- Store the latest progress in a ref and update React state only when the rounded frame index changes.
- Or coalesce updates with `requestAnimationFrame`, ensuring only one pending update exists.

Do not subscribe with both a raw `window.addEventListener("scroll")` handler and a Lenis handler unless the raw handler is strictly needed for fallback behavior and is carefully deduplicated.

### Step 7.3: Keep resize handling separate

Add a passive `resize` listener or `ResizeObserver` for the hero track. On resize, recalculate progress and allow Lenis to recalculate its dimensions. Do not call `lenis.resize()` on every scroll event.

### Step 7.4: Preserve frame rendering behavior

In `BurgerAnimation.tsx`:

- Keep the current frame preload and error counting behavior.
- Keep the current frame index clamp.
- Keep the existing canvas dimensions.
- Do not call Lenis from the canvas component.
- Do not draw a frame if the requested frame has not loaded.
- Consider changing the rAF loop to draw only when the target index changes, which the current code already attempts.

### Step 7.5: Add reduced-motion behavior

When `window.matchMedia("(prefers-reduced-motion: reduce)").matches` is true:

- Lenis should honor reduced motion through `respectReducedMotion: true`.
- The hero should show a stable representative frame, preferably frame 1 or a deliberately selected final burger frame.
- The hero copy should remain visible without requiring scroll-driven transitions.
- The scroll track may remain tall for layout continuity, but avoid making users scroll 400vh just to read content. A future refinement may use a shorter track for reduced-motion users.

## 8. Phase 3 — make anchor links reliable and polished

### Step 8.1: Normalize navigation targets

Create one shared navigation definition, for example in `lib/navigation.ts`, and use it in both the header and footer. Each target must exist:

| Label | Target |
|---|---|
| Menu | `/menu` or `#menu`, based on the intended product decision |
| Our Story | `#our-story` |
| How It’s Made | `#how-its-made` |
| Locations | `#locations` |
| Order Now | external order URL or `/menu` |

If a section currently lacks the target ID, add the ID to the section’s semantic root element. Do not rely on text selectors.

### Step 8.2: Add fixed-header offset consistently

Set a shared `--header-height` token and use it for:

- Header height.
- Mobile navigation top position.
- `scroll-padding-top`.
- Lenis anchor offset.
- Section `scroll-margin-top` where useful.

Use one source of truth. Do not hardcode `72px` in multiple components.

### Step 8.3: Handle route links and hash links differently

For same-page hash links, Lenis anchors can handle the scroll. For links to `/menu`, use Next `Link`. Do not intercept every link with a custom click handler. Preserve normal browser behavior for modified clicks, external URLs, keyboard activation, and open-in-new-tab actions.

### Step 8.4: Add active-section indication only after correctness

After anchor navigation works, optionally add an active navigation state using `IntersectionObserver`. Do not use a scroll event for this. The active state must not be the only way users understand where they are.

## 9. Phase 4 — design-system polish

### Step 9.1: Consolidate design tokens

Review `styles/tokens.css` and replace repeated literal values in component CSS with tokens. Add tokens only when a value is reused at least twice. Recommended additions:

```css
--color-rust-soft: #ab5235;
--color-rust-surface: #af5639;
--color-cream-deep: #ebd8bb;
--header-height: 72px;
--content-gutter: clamp(1.25rem, 4vw, 5rem);
--section-padding-block: clamp(4rem, 10vw, 9rem);
--focus-ring: 0 0 0 3px var(--color-accent-gold);
```

Keep the brand colors intentional. Do not silently change colors in unrelated sections while fixing the hero seam.

### Step 9.2: Establish a section shell pattern

For each major section, use a consistent structure:

```tsx
<section id="section-id" className={styles.section} aria-labelledby="section-title">
  <div className={styles.container}>
    <p className={styles.eyebrow}>...</p>
    <h2 id="section-title" className={styles.title}>...</h2>
    <div className={styles.content}>...</div>
  </div>
</section>
```

The exact markup may vary when a section already has a more appropriate semantic structure. Every section must have one clear heading.

### Step 9.3: Standardize buttons and links

Create shared classes or a small `Button` component only if the current site repeats the same markup. Define primary, secondary, and text-link variants. Every button needs:

- Visible hover state.
- Visible keyboard focus state.
- Pressed/active feedback.
- Minimum 44px touch target.
- Sufficient contrast against its background.
- No transform that causes layout shift.

Do not turn plain navigation links into buttons.

### Step 9.4: Improve typography hierarchy

Use the existing font family roles consistently:

- `Archivo Black` for large display headlines.
- `Caveat` for short accent labels only.
- `Work Sans` for body copy, navigation, buttons, and utility text.

Limit line lengths to approximately 55–75 characters for body copy. Use `text-wrap: balance` for large headings where supported. Avoid excessive uppercase text in body content.

### Step 9.5: Improve surfaces and spacing

Use a small number of deliberate surface treatments:

- Cream page background.
- Rust feature panels.
- Warm off-white text on rust.
- Very light borders or shadows only when they clarify grouping.

Avoid adding gradients, shadows, and rounded cards to every section. The brand is editorial and bold; hierarchy should come from spacing, scale, color, and imagery first.

## 10. Phase 5 — accessible reveal animations and micro-interactions

### Step 10.1: Create one reusable reveal pattern

Add a small client component such as `components/Reveal.tsx` only if needed. Use `IntersectionObserver` with:

- `threshold` around `0.15`.
- `rootMargin` such as `0px 0px -10% 0px`.
- A `once` behavior so content does not repeatedly animate while scrolling.
- A fallback that immediately reveals content if `IntersectionObserver` is unavailable.

The component should add a class such as `reveal--visible`. CSS should animate only `opacity` and `transform`.

### Step 10.2: Avoid animation overuse

Use reveal animation for section headings and the first row of content. Do not animate every word, icon, and card independently. Stagger no more than three child groups. Keep durations between roughly 350ms and 700ms.

### Step 10.3: Add hover effects that do not break layout

Good effects include color changes, opacity changes, subtle `translateY`, and image scale inside an `overflow: hidden` wrapper. Avoid changing dimensions, margins, font weights, or border widths on hover.

### Step 10.4: Keep the burger hero the dominant motion

Downstream motion must be quieter than the hero. Do not add parallax to every image. A static, carefully cropped image is preferable to many competing animations.

## 11. Phase 6 — responsive and mobile hardening

### Step 11.1: Mobile navigation

Verify the mobile menu:

- Uses a real button with `aria-expanded` and `aria-controls`.
- Has an accessible label.
- Closes after a navigation link is activated.
- Closes on Escape.
- Does not leave focus behind a closed overlay.
- Does not allow the page to scroll underneath an open full-screen menu if the menu is modal.
- Restores focus to the menu button after closing.

Do not use Lenis `stop()` for the menu unless there is a clear modal scroll-lock implementation with guaranteed cleanup. Prefer CSS and a tested body-lock helper if locking is required.

### Step 11.2: Touch behavior

Keep `syncTouch: false` initially. Test native touch scrolling on iOS and Android before considering touch inertia. Lenis documentation notes that touch synchronization can be unstable on older iOS versions. [2]

Do not apply `touch-action: none` globally. Do not disable pinch zoom.

### Step 11.3: Small-screen hero behavior

At widths below the mobile breakpoint:

- Ensure the canvas does not cover interactive copy.
- Ensure the burger remains visually centered.
- Ensure the split background still makes sense when the viewport is narrow.
- Ensure the scroll hint does not overlap buttons or text.
- Ensure the loading indicator does not obscure the first meaningful content for too long.

## 12. Phase 7 — performance work

### Step 12.1: Measure before optimizing

Use browser DevTools to inspect:

- Frames per second during hero scrolling.
- Main-thread time during wheel input.
- Memory usage while loading all 120 frames.
- Largest contentful paint.
- Cumulative layout shift.
- Long tasks over 50ms.

Do not optimize based on visual guesswork alone.

### Step 12.2: Avoid unnecessary React renders

For the hero:

- Keep frame indexes in refs where possible.
- Do not store every scroll pixel in React state.
- Do not recreate callbacks on every render without reason.
- Keep `BurgerAnimation` props stable.

For reveals:

- Observe only section-level elements.
- Disconnect observers on unmount.
- Do not attach a separate observer to every decorative span.

### Step 12.3: Improve frame loading only if measured necessary

The current implementation loads 120 PNG frames. If the performance budget is exceeded, choose one measured improvement at a time:

1. Convert frames to a smaller modern format if image quality remains acceptable.
2. Reduce frame dimensions for mobile.
3. Load an initial subset first, then progressively load the remainder.
4. Use a poster frame before the animation is ready.

Do not change the animation format simply because Lenis is being introduced.

## 13. Exact files expected to change

The implementation should normally touch the following files:

| File | Expected change |
|---|---|
| `package.json` | Add `lenis` dependency through npm. |
| `package-lock.json` | Automatically updated by npm. |
| `components/SmoothScroll.tsx` | New root Lenis provider. |
| `app/layout.tsx` | Wrap body content with `SmoothScroll`. |
| `app/globals.css` or `styles/tokens.css` | Import Lenis CSS or add compatible global rules; remove conflicting smooth-scroll behavior. |
| `components/ScrollySection.tsx` | Replace duplicate raw scroll handling with Lenis-aware, coalesced progress updates. |
| `components/Header.tsx` | Normalize anchors, active state, and mobile-menu accessibility if needed. |
| `components/Header.module.css` | Header, link, focus, mobile-menu, and transition polish. |
| `components/BurgerAnimation.tsx` | Only if reduced-motion or frame scheduling requires a targeted change. |
| `components/Hero.module.css` | Hero responsive, reduced-motion, and visual polish. |
| `styles/tokens.css` | Shared spacing, color, focus, and header tokens. |
| Section component/style pairs | Consistent IDs, headings, spacing, buttons, reveals, and responsive fixes. |
| `lib/navigation.ts` | Optional shared navigation data. |
| `components/Reveal.tsx` | Optional reusable section reveal component. |

Do not edit generated `.next` files. Do not edit all section files merely to create noise; only change a section when it receives a concrete polish or accessibility improvement.

## 14. Testing checklist

### 14.1 Automated checks

Run all commands from the project root:

```bash
npm run lint
npm run build
```

If lint fails on pre-existing unrelated errors, record the exact file and line. Do not suppress the errors globally. Fix only errors introduced by this implementation unless the task explicitly expands scope.

### 14.2 Functional checks

| Check | Expected result |
|---|---|
| Wheel scroll | Smooth, controlled motion with no acceleration loop. |
| Trackpad scroll | No jitter or sudden jumps. |
| Touch scroll | Native-feeling scroll on mobile. |
| Hero frames | Frame progression follows scroll and reaches first/last frame correctly. |
| Header anchor | Scrolls to the correct section below the fixed header. |
| Route link | `/menu` navigates normally. |
| Skip link | Focus moves to main content and the target is visible. |
| Mobile menu | Opens, closes, supports Escape, and restores focus. |
| Reduced motion | Motion is disabled or minimized and content remains readable. |
| Resize | No broken canvas or wrong progress after orientation change. |
| Refresh | Page remains usable at the top and at a deep URL. |
| Back/forward | Browser history behaves normally. |

### 14.3 Visual checks

Capture screenshots at minimum at:

- 1440 × 900 desktop.
- 1280 × 800 laptop.
- 1024 × 1366 tablet portrait.
- 768 × 1024 tablet portrait.
- 390 × 844 mobile.
- 320 × 700 narrow mobile.

Review these details:

- No seam or color block around the hero animation.
- Header text remains readable on both hero halves.
- Section spacing feels intentional and consistent.
- Headings do not collide with images or buttons.
- Cards do not overflow horizontally.
- Footer columns collapse cleanly.
- Focus rings are visible.
- Motion does not make text hard to read.

## 15. Definition of done

The work is complete only when all of the following are true:

1. `lenis` is installed and used through one root `ReactLenis` instance.
2. There is no competing global CSS smooth-scroll behavior.
3. The hero remains a normal document sticky section and its frame progress remains correct.
4. Anchor links account for the fixed header.
5. Reduced-motion users receive a usable, low-motion experience.
6. Touch scrolling and keyboard scrolling remain functional.
7. The mobile menu remains accessible and does not trap the page in a locked state.
8. Major sections have consistent spacing, headings, link states, focus states, and responsive behavior.
9. Reveal effects are subtle, one-time, and disabled or reduced for reduced-motion users.
10. Production build passes.
11. Any remaining lint failures are documented as pre-existing or are fixed before release.
12. A final manual QA pass is recorded with viewport sizes and browser/device coverage.

## 16. Suggested commit sequence

Use small commits so a regression can be isolated:

1. `chore: add lenis dependency`
2. `feat: add root lenis smooth scroll provider`
3. `fix: synchronize hero progress with lenis scroll`
4. `fix: normalize anchor offsets and navigation targets`
5. `style: polish design tokens and shared interaction states`
6. `feat: add accessible section reveals`
7. `fix: harden mobile and reduced motion behavior`
8. `test: verify scroll performance and responsive layouts`

## References

[1]: https://github.com/darkroomengineering/lenis/blob/main/packages/react/README.md "Lenis React integration documentation"

[2]: https://github.com/darkroomengineering/lenis "Lenis core documentation and options"
