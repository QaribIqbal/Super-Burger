# Smooth High-Resolution Image Loading Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make both burger scroll animations render reliably and feel immediate while preserving every source frame at its original 2560×1440 PNG quality.

**Architecture:** Replace the current preload-everything behavior with an adaptive frame scheduler and a bounded `ImageBitmap` cache. A full-resolution poster frame is requested first, the canvas always draws the requested frame or the nearest loaded frame, and additional frames are fetched around the current scroll position only while their section is near the viewport. The initial loader reports progress for the small critical opening set and never blocks on all 418 frames.

**Tech Stack:** Next.js 16 App Router, React 19 hooks, TypeScript, Canvas 2D, `fetch`, `createImageBitmap`, `IntersectionObserver`, browser HTTP cache, Vitest.

**Spec:** `/Users/qaribiqbal/.codex/attachments/851faf40-6212-421d-b4e3-33d9bdadd8e5/pasted-text.txt` plus the user’s 2026-09-06 requirement to preserve high-resolution image quality and provide a smooth loading experience.

## Global Constraints

- Keep every source PNG unchanged at 2560×1440; do not resize, recompress, or re-encode the supplied frames.
- The hero animation uses all 299 files under `public/images/burger-build/`.
- The lower explosion animation uses all 119 files under `public/images/burger-explosion/`.
- The canvas must never become blank after the first frame has appeared.
- Native document scrolling must remain enabled; do not intercept or cancel wheel, touch, trackpad, Page Up, Page Down, Home, End, or Space key behavior.
- Scrolling forward and backward must map continuously to forward and backward frame selection in both animation sections.
- Recalculate scroll progress after viewport resize, orientation change, and direct navigation to `#how-its-made`.
- Do not start downloading the lower explosion sequence until it is within 1200px of the viewport.
- Keep the fixed navigation and the existing hero design unchanged.
- The lower animation canvas must also use 2560×1440 backing dimensions.
- Preserve the existing `Cache-Control: public, max-age=31536000, immutable` header for `/images/:path*`.

---

## Confirmed Root Cause and Performance Risks

1. In `components/BurgerAnimation.tsx`, the `loadWhenVisible` branch returns its cleanup function before `framesRef.current = frames` runs. The explosion frames can download into the local array while the drawing code continues reading an empty ref, which produces a blank canvas.
2. The current hero schedules all 299 frames only 250ms after mount. The two sequences total about 527 MB, so this saturates the connection and competes with fonts, JavaScript, and the first visible frame.
3. Holding hundreds of decoded 2560×1440 frames can require several gigabytes of memory because one decoded RGBA frame is roughly 14 MB.
4. The lower section declares a 1920×1080 canvas even though its source frames are 2560×1440, which prevents full-resolution rendering on high-density displays.
5. The loader percentage is based on all 299 hero frames even though the loader disappears after the first frame; this makes progress appear stuck near 0% and does not represent the work required to show the page.

### Acceptance Targets

- One high-priority poster request begins immediately for the hero.
- The branded blocking loader disappears after the poster and first two neighboring frames are decoded, not after the full sequence.
- No explosion-frame request occurs before its section enters the 1200px preload margin.
- No more than four frame fetches run concurrently on desktop and two on a reduced-data connection.
- The decoded-frame cache holds at most eight desktop frames or four mobile/reduced-data frames.
- Rapid scrolling displays the nearest cached frame until the exact target arrives; the canvas never flashes transparent.
- Slow, rapid, reverse, touch, trackpad, and keyboard scrolling update both animations without a frozen frame or skipped section.
- Scroll handlers perform at most one layout measurement and one React state update per animation frame.
- All displayed frames retain a 2560×1440 canvas backing store and use the original PNG data.
- `npm run lint`, `npm run test`, and `npm run build` finish successfully.

---

### Task 1: Lock Down Frame Configuration and Reproduce the Lazy-Load Failure

**Files:**
- Create: `lib/burger-sequences.ts`
- Create: `lib/frame-sequence.ts`
- Create: `lib/frame-sequence.test.ts`
- Modify: `package.json`
- Modify: `package-lock.json`

**Interfaces:**
- Produces: `FrameSequenceConfig`, `BURGER_BUILD_SEQUENCE`, `BURGER_EXPLOSION_SEQUENCE`, `frameUrl()`, and `getFramePriorityOrder()`.
- Consumes: Existing frame names and counts in `public/images/burger-build/` and `public/images/burger-explosion/`.

- [ ] **Step 1: Add a small test runner**

Run:

```bash
npm install --save-dev vitest
```

Add this script to `package.json`:

```json
"test": "vitest run"
```

- [ ] **Step 2: Write failing scheduler and path tests**

Create `lib/frame-sequence.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { frameUrl, getFramePriorityOrder } from "./frame-sequence";

describe("frameUrl", () => {
  it("uses one-based, three-digit PNG names", () => {
    expect(frameUrl("/images/burger-build/frame-", 0)).toBe(
      "/images/burger-build/frame-001.png",
    );
    expect(frameUrl("/images/burger-explosion/ezgif-frame-", 118)).toBe(
      "/images/burger-explosion/ezgif-frame-119.png",
    );
  });
});

describe("getFramePriorityOrder", () => {
  it("prioritizes the target and nearby frames without duplicates", () => {
    expect(getFramePriorityOrder(10, 20, 2).slice(0, 5)).toEqual([
      10, 11, 9, 12, 8,
    ]);
  });

  it("clamps priorities at sequence boundaries", () => {
    expect(getFramePriorityOrder(0, 3, 2)).toEqual([0, 1, 2]);
  });
});
```

- [ ] **Step 3: Run tests and verify they fail**

Run:

```bash
npm run test
```

Expected: FAIL because `lib/frame-sequence.ts` does not exist.

- [ ] **Step 4: Add exact sequence configuration**

Create `lib/burger-sequences.ts`:

```ts
export interface FrameSequenceConfig {
  frameCount: number;
  frameDir: string;
  width: number;
  height: number;
  posterIndex: number;
  preloadRadius: number;
}

export const BURGER_BUILD_SEQUENCE: FrameSequenceConfig = {
  frameCount: 299,
  frameDir: "/images/burger-build/frame-",
  width: 2560,
  height: 1440,
  posterIndex: 0,
  preloadRadius: 3,
};

export const BURGER_EXPLOSION_SEQUENCE: FrameSequenceConfig = {
  frameCount: 119,
  frameDir: "/images/burger-explosion/ezgif-frame-",
  width: 2560,
  height: 1440,
  posterIndex: 0,
  preloadRadius: 3,
};
```

Create `lib/frame-sequence.ts`:

```ts
export function frameUrl(frameDir: string, zeroBasedIndex: number): string {
  return `${frameDir}${String(zeroBasedIndex + 1).padStart(3, "0")}.png`;
}

export function getFramePriorityOrder(
  target: number,
  frameCount: number,
  radius: number,
): number[] {
  const order: number[] = [];
  for (let distance = 0; distance <= radius; distance += 1) {
    const candidates = distance === 0
      ? [target]
      : [target + distance, target - distance];
    for (const index of candidates) {
      if (index >= 0 && index < frameCount && !order.includes(index)) {
        order.push(index);
      }
    }
  }
  return order;
}
```

- [ ] **Step 5: Run tests and verify they pass**

Run:

```bash
npm run test
```

Expected: all frame path and priority-order tests pass.

- [ ] **Step 6: Commit the configuration and tests**

```bash
git add package.json package-lock.json lib/burger-sequences.ts lib/frame-sequence.ts lib/frame-sequence.test.ts
git commit -m "test: define burger frame sequence behavior"
```

---

### Task 2: Build a Bounded Adaptive Frame Loader

**Files:**
- Create: `components/useFrameSequence.ts`
- Modify: `lib/frame-sequence.ts`
- Modify: `lib/frame-sequence.test.ts`

**Interfaces:**
- Consumes: `FrameSequenceConfig`, `frameUrl()`, and `getFramePriorityOrder()` from Task 1.
- Produces: `useFrameSequence({ config, active, targetIndex })`, returning `{ getBestFrame, criticalLoaded, criticalProgress, loadError }`.

- [ ] **Step 1: Add failing cache-eviction tests**

Append to `lib/frame-sequence.test.ts`:

```ts
import { selectEvictionCandidate } from "./frame-sequence";

describe("selectEvictionCandidate", () => {
  it("evicts the cached frame farthest from the target", () => {
    expect(selectEvictionCandidate([8, 9, 10, 14], 10)).toBe(14);
  });

  it("does not evict critical frames when another candidate exists", () => {
    expect(selectEvictionCandidate([0, 1, 3, 8], 7, [0, 1])).toBe(3);
  });
});
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run:

```bash
npx vitest run lib/frame-sequence.test.ts
```

Expected: FAIL because `selectEvictionCandidate` is not exported.

- [ ] **Step 3: Implement deterministic eviction**

Add to `lib/frame-sequence.ts`:

```ts
export function selectEvictionCandidate(
  cachedIndices: number[],
  target: number,
  protectedIndices: readonly number[] = [],
): number | undefined {
  return cachedIndices
    .filter((index) => !protectedIndices.includes(index))
    .sort((a, b) => Math.abs(b - target) - Math.abs(a - target))[0];
}
```

- [ ] **Step 4: Implement the hook with cancellable fetching and bounded decoded memory**

Create `components/useFrameSequence.ts` with these behaviors:

```ts
export interface UseFrameSequenceOptions {
  config: FrameSequenceConfig;
  active: boolean;
  targetIndex: number;
}

export interface UseFrameSequenceResult {
  getBestFrame: (targetIndex: number) => ImageBitmap | undefined;
  criticalLoaded: boolean;
  criticalProgress: number;
  loadError: boolean;
}
```

Use the following implementation body in `components/useFrameSequence.ts`:

```ts
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { FrameSequenceConfig } from "@/lib/burger-sequences";
import {
  frameUrl,
  getFramePriorityOrder,
  selectEvictionCandidate,
} from "@/lib/frame-sequence";

interface NetworkInformationLike {
  saveData?: boolean;
}

interface NavigatorWithConnection extends Navigator {
  connection?: NetworkInformationLike;
}

export interface UseFrameSequenceOptions {
  config: FrameSequenceConfig;
  active: boolean;
  targetIndex: number;
}

export interface UseFrameSequenceResult {
  getBestFrame: (targetIndex: number) => ImageBitmap | undefined;
  criticalLoaded: boolean;
  criticalProgress: number;
  loadError: boolean;
}

export function useFrameSequence({
  config,
  active,
  targetIndex,
}: UseFrameSequenceOptions): UseFrameSequenceResult {
  const cacheRef = useRef(new Map<number, ImageBitmap>());
  const queueRef = useRef<number[]>([]);
  const queuedRef = useRef(new Set<number>());
  const controllersRef = useRef(new Map<number, AbortController>());
  const activeLoadsRef = useRef(0);
  const aliveRef = useRef(true);
  const pumpRef = useRef<() => void>(() => undefined);
  const [, announceFrame] = useState(0);
  const [criticalProgress, setCriticalProgress] = useState(0);
  const [loadError, setLoadError] = useState(false);

  const posterIndex = config.posterIndex;
  const criticalIndices = useMemo(
    () => [
      posterIndex,
      Math.min(posterIndex + 1, config.frameCount - 1),
      Math.min(posterIndex + 2, config.frameCount - 1),
    ].filter((index, position, items) => items.indexOf(index) === position),
    [config.frameCount, posterIndex],
  );

  useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
      controllersRef.current.forEach((controller) => controller.abort());
      controllersRef.current.clear();
      cacheRef.current.forEach((bitmap) => bitmap.close());
      cacheRef.current.clear();
      queueRef.current = [];
      queuedRef.current.clear();
    };
  }, [config]);

  useEffect(() => {
    if (!active) return;

    const navigatorWithConnection = navigator as NavigatorWithConnection;
    const reducedData = navigatorWithConnection.connection?.saveData === true;
    const concurrency = reducedData ? 2 : 4;
    const cacheLimit = reducedData || window.innerWidth < 700 ? 4 : 8;

    const updateCriticalProgress = () => {
      const loaded = criticalIndices.filter((index) => cacheRef.current.has(index)).length;
      setCriticalProgress(Math.round((loaded / criticalIndices.length) * 100));
    };

    const enqueue = (indices: number[], priority = false) => {
      const fresh = indices.filter(
        (index) =>
          !cacheRef.current.has(index) &&
          !queuedRef.current.has(index) &&
          !controllersRef.current.has(index),
      );
      fresh.forEach((index) => queuedRef.current.add(index));
      queueRef.current = priority
        ? [...fresh, ...queueRef.current]
        : [...queueRef.current, ...fresh];
    };

    const loadFrame = async (index: number) => {
      const controller = new AbortController();
      controllersRef.current.set(index, controller);
      activeLoadsRef.current += 1;
      try {
        const response = await fetch(frameUrl(config.frameDir, index), {
          signal: controller.signal,
          cache: "force-cache",
        });
        if (!response.ok) throw new Error(`Frame ${index} returned ${response.status}`);
        const bitmap = await createImageBitmap(await response.blob());
        if (!aliveRef.current || controller.signal.aborted) {
          bitmap.close();
          return;
        }

        cacheRef.current.set(index, bitmap);
        while (cacheRef.current.size > cacheLimit) {
          const evict = selectEvictionCandidate(
            [...cacheRef.current.keys()],
            targetIndex,
            criticalIndices,
          );
          if (evict === undefined) break;
          cacheRef.current.get(evict)?.close();
          cacheRef.current.delete(evict);
        }
        updateCriticalProgress();
        announceFrame((value) => value + 1);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setLoadError(true);
        }
      } finally {
        controllersRef.current.delete(index);
        activeLoadsRef.current -= 1;
        pumpRef.current();
      }
    };

    pumpRef.current = () => {
      while (activeLoadsRef.current < concurrency && queueRef.current.length > 0) {
        const index = queueRef.current.shift();
        if (index === undefined) break;
        queuedRef.current.delete(index);
        void loadFrame(index);
      }
    };

    enqueue(criticalIndices, true);
    enqueue(
      getFramePriorityOrder(targetIndex, config.frameCount, config.preloadRadius),
      true,
    );
    pumpRef.current();
  }, [active, config, criticalIndices, posterIndex, targetIndex]);

  const getBestFrame = useCallback(
    (requestedIndex: number) => {
      const exact = cacheRef.current.get(requestedIndex);
      if (exact) return exact;
      const nearestIndex = [...cacheRef.current.keys()].sort(
        (a, b) => Math.abs(a - requestedIndex) - Math.abs(b - requestedIndex),
      )[0];
      return nearestIndex === undefined
        ? cacheRef.current.get(posterIndex)
        : cacheRef.current.get(nearestIndex);
    },
    [posterIndex],
  );

  return {
    getBestFrame,
    criticalLoaded: criticalProgress === 100,
    criticalProgress,
    loadError,
  };
}
```

- [ ] **Step 5: Run unit tests**

Run:

```bash
npm run test
```

Expected: all scheduler and cache-selection tests pass.

- [ ] **Step 6: Commit the adaptive loader**

```bash
git add components/useFrameSequence.ts lib/frame-sequence.ts lib/frame-sequence.test.ts
git commit -m "feat: add adaptive frame sequence loader"
```

---

### Task 3: Replace the Broken Animation Preloader and Guarantee a Non-Blank Canvas

**Files:**
- Modify: `components/BurgerAnimation.tsx`
- Modify: `components/Hero.module.css`

**Interfaces:**
- Consumes: `FrameSequenceConfig` and `useFrameSequence()`.
- Produces: `BurgerAnimation` props `{ scrollProgress, config, loadWhenVisible?, onLoadProgress? }`.

- [ ] **Step 1: Replace loose frame props with one sequence config**

Use this public component interface:

```ts
interface BurgerAnimationProps {
  scrollProgress: number;
  config: FrameSequenceConfig;
  loadWhenVisible?: boolean;
  onLoadProgress?: (percent: number) => void;
  onCriticalReady?: () => void;
}
```

This removes duplicated frame counts and prevents the lower animation from declaring 1920×1080 while loading 2560×1440 assets.

- [ ] **Step 2: Fix lazy activation before any early return**

Create `active` state in `BurgerAnimation`:

```ts
const [active, setActive] = useState(!loadWhenVisible);
```

Observe `wrapperRef` in a dedicated effect with `{ rootMargin: "1200px 0px" }`. Set `active` to true once intersecting and disconnect the observer. Frame storage must live in `useFrameSequence`; no local array may be hidden behind an effect cleanup return.

- [ ] **Step 3: Draw the best available bitmap**

Set the canvas backing dimensions directly from `config.width` and `config.height`. In the animation frame loop, call `getBestFrame(targetIndex)` and draw only when the selected bitmap or target index changes. Keep the last successfully drawn bitmap on the canvas while a better frame loads; never clear the canvas without immediately drawing a replacement.

- [ ] **Step 4: Add a full-resolution poster beneath the canvas**

Render a native image beneath the canvas using the unchanged first PNG:

```tsx
<img
  className={styles.canvasPoster}
  src={frameUrl(config.frameDir, config.posterIndex)}
  width={config.width}
  height={config.height}
  alt=""
  decoding="async"
  fetchPriority={loadWhenVisible ? "low" : "high"}
/>
```

Keep the poster visible until the first canvas draw succeeds, then fade it out. This guarantees meaningful imagery even if Canvas decoding is delayed or unsupported.

- [ ] **Step 5: Style the poster without changing the composition**

Add `.canvasPoster` to `components/Hero.module.css` with the same width, height, aspect ratio, and positioning rules as `.canvas`. Use `object-fit: contain`, and transition opacity only. Do not add blur, filters, low-resolution placeholders, or CSS image scaling beyond the existing responsive fit.

- [ ] **Step 6: Verify the component statically**

Run:

```bash
npm run lint
npm run test
npm run build
```

Expected: all commands exit successfully with no TypeScript or lint errors.

- [ ] **Step 7: Commit the renderer replacement**

```bash
git add components/BurgerAnimation.tsx components/Hero.module.css
git commit -m "fix: keep burger canvas visible during frame loading"
```

---

### Task 4: Make Scroll-to-Frame Mapping Smooth and Input-Agnostic

**Files:**
- Create: `components/useScrollProgress.ts`
- Modify: `lib/frame-sequence.ts`
- Modify: `lib/frame-sequence.test.ts`
- Modify: `components/ScrollySection.tsx`
- Modify: `components/BurgerExplosionSection.tsx`

**Interfaces:**
- Consumes: A React section ref and the existing 400vh sticky-section layout.
- Produces: `sectionScrollProgress()` and `useScrollProgress(sectionRef)`, returning a clamped number from 0 to 1.

- [ ] **Step 1: Add failing scroll-mapping tests**

Append to `lib/frame-sequence.test.ts`:

```ts
import { sectionScrollProgress } from "./frame-sequence";

describe("sectionScrollProgress", () => {
  it("maps the beginning, midpoint, and end of a sticky track", () => {
    expect(sectionScrollProgress(0, 4000, 1000)).toBe(0);
    expect(sectionScrollProgress(-1500, 4000, 1000)).toBe(0.5);
    expect(sectionScrollProgress(-3000, 4000, 1000)).toBe(1);
  });

  it("clamps overscroll in both directions", () => {
    expect(sectionScrollProgress(200, 4000, 1000)).toBe(0);
    expect(sectionScrollProgress(-3400, 4000, 1000)).toBe(1);
  });

  it("returns zero when the section has no scrollable distance", () => {
    expect(sectionScrollProgress(0, 1000, 1000)).toBe(0);
  });
});
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run:

```bash
npx vitest run lib/frame-sequence.test.ts
```

Expected: FAIL because `sectionScrollProgress` is not exported.

- [ ] **Step 3: Implement pure scroll-progress mapping**

Add to `lib/frame-sequence.ts`:

```ts
export function sectionScrollProgress(
  sectionTop: number,
  sectionHeight: number,
  viewportHeight: number,
): number {
  const scrollableDistance = sectionHeight - viewportHeight;
  if (scrollableDistance <= 0) return 0;
  return Math.max(0, Math.min(1, -sectionTop / scrollableDistance));
}
```

- [ ] **Step 4: Implement one-measurement-per-frame scroll tracking**

Create `components/useScrollProgress.ts`:

```ts
"use client";

import { useEffect, useState, type RefObject } from "react";
import { sectionScrollProgress } from "@/lib/frame-sequence";

export function useScrollProgress(
  sectionRef: RefObject<HTMLElement | null>,
): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let animationFrame = 0;
    let scheduled = false;

    const measure = () => {
      scheduled = false;
      const section = sectionRef.current;
      if (!section) return;
      const next = sectionScrollProgress(
        section.getBoundingClientRect().top,
        section.offsetHeight,
        window.innerHeight,
      );
      setProgress((current) => (Math.abs(current - next) < 0.0005 ? current : next));
    };

    const scheduleMeasure = () => {
      if (scheduled) return;
      scheduled = true;
      animationFrame = window.requestAnimationFrame(measure);
    };

    window.addEventListener("scroll", scheduleMeasure, { passive: true });
    window.addEventListener("resize", scheduleMeasure, { passive: true });
    window.addEventListener("orientationchange", scheduleMeasure, { passive: true });
    scheduleMeasure();

    return () => {
      window.removeEventListener("scroll", scheduleMeasure);
      window.removeEventListener("resize", scheduleMeasure);
      window.removeEventListener("orientationchange", scheduleMeasure);
      window.cancelAnimationFrame(animationFrame);
    };
  }, [sectionRef]);

  return progress;
}
```

This hook observes document movement without calling `preventDefault`, so mouse wheel, trackpad, touch, keyboard, anchor navigation, and browser-native momentum remain intact.

- [ ] **Step 5: Use the shared hook in both animation sections**

In `ScrollySection.tsx` and `BurgerExplosionSection.tsx`, delete their local scroll listeners and progress calculations, then use:

```ts
const sectionRef = useRef<HTMLElement>(null);
const scrollProgress = useScrollProgress(sectionRef);
```

Pass `scrollProgress` to `BurgerAnimation`; in the explosion section, also use it for callout visibility and the progress indicator.

- [ ] **Step 6: Run scroll math, lint, and build checks**

Run:

```bash
npm run test && npm run lint && npm run build
```

Expected: scroll mapping tests and all project checks pass.

- [ ] **Step 7: Commit the shared scroll behavior**

```bash
git add components/useScrollProgress.ts components/ScrollySection.tsx components/BurgerExplosionSection.tsx lib/frame-sequence.ts lib/frame-sequence.test.ts
git commit -m "fix: make burger scroll animations input agnostic"
```

---

### Task 5: Make the Initial Loader Represent Real User-Visible Progress

**Files:**
- Modify: `components/ScrollySection.tsx`
- Modify: `components/Hero.module.css`
- Modify: `components/BurgerExplosionSection.tsx`

**Interfaces:**
- Consumes: `BURGER_BUILD_SEQUENCE`, `BURGER_EXPLOSION_SEQUENCE`, and the critical-progress callbacks from `BurgerAnimation`.
- Produces: A branded, accessible loader that exits after the critical opening set and a lazy lower sequence configured at full resolution.

- [ ] **Step 1: Use shared sequence constants in both sections**

In `ScrollySection.tsx`, pass `config={BURGER_BUILD_SEQUENCE}`. In `BurgerExplosionSection.tsx`, pass `config={BURGER_EXPLOSION_SEQUENCE}` and retain `loadWhenVisible`.

- [ ] **Step 2: Track critical progress rather than all frames**

Replace `loadedFrames` with:

```ts
const [criticalProgress, setCriticalProgress] = useState(0);
const firstFrameReady = criticalProgress > 0;
const criticalReady = criticalProgress === 100;
```

Keep the loader visible until `criticalReady`. The poster remains visible beneath it, so the transition reveals a complete image rather than a blank canvas.

- [ ] **Step 3: Improve loader motion and accessibility**

Keep the existing “Super Burger Co.” branding and “Preparing your first bite” copy. Update the loader so:

- progress is based on the three critical frames;
- the bar moves from 0 to 100 in meaningful increments;
- `role="status"` uses `aria-live="polite"` and visible text includes the percentage;
- the exit uses opacity and visibility only;
- `prefers-reduced-motion: reduce` disables loader transitions;
- a recoverable fetch failure changes the label to “Still warming the grill…” while the poster remains visible.

- [ ] **Step 4: Preserve full-resolution explosion rendering**

Remove the explicit 1920×1080 props from `BurgerExplosionSection.tsx`; the shared explosion config supplies 2560×1440. Preserve the navbar offset CSS already present in `BurgerExplosionSection.module.css`.

- [ ] **Step 5: Run component and production checks**

Run:

```bash
npm run lint
npm run test
npm run build
```

Expected: all checks pass.

- [ ] **Step 6: Commit the loader experience**

```bash
git add components/ScrollySection.tsx components/BurgerExplosionSection.tsx components/Hero.module.css
git commit -m "feat: improve burger animation loading experience"
```

---

### Task 6: Verify Network, Scrolling, Rendering, and Source Quality

**Files:**
- Modify only if verification exposes a specific defect.

**Interfaces:**
- Consumes: Completed Tasks 1–5.
- Produces: Evidence that the bug is fixed and the quality/performance constraints are met.

- [ ] **Step 1: Verify every expected source frame exists and remains 2560×1440**

Run a Node script that checks all 299 build paths and all 119 explosion paths, then use `sips` to inspect representative first, middle, and last frames from each sequence. Expected: zero missing files and 2560×1440 for every sampled frame.

- [ ] **Step 2: Record source hashes before and after implementation**

Run:

```bash
find public/images/burger-build public/images/burger-explosion -type f -name '*.png' -print0 \
  | sort -z \
  | xargs -0 shasum -a 256 > /tmp/super-burger-frame-hashes.txt
git diff --exit-code -- public/images/burger-build public/images/burger-explosion
```

Expected: Git reports no image changes. The hash file provides an audit record for the unchanged originals.

- [ ] **Step 3: Verify the initial route in a browser with cache disabled**

Start `npm run dev`, open `/`, disable browser cache, and reload. Confirm:

- the branded loader appears immediately;
- the hero poster loads and the loader reaches 100% for the critical set;
- the loader fades out to a visible burger;
- scrolling before background loading finishes never clears the canvas;
- no explosion requests appear in the Network panel while still in the hero.

- [ ] **Step 4: Verify lazy explosion loading and rapid-scroll fallback**

Scroll toward `#how-its-made`. Confirm explosion requests begin within the 1200px preload margin, the top bun remains below the navbar, and rapid scrubbing shows the nearest available frame instead of a blank canvas.

- [ ] **Step 5: Verify all native scrolling inputs in both directions**

For both the hero and explosion tracks, test mouse wheel, trackpad, touch emulation, Page Up, Page Down, Space, Shift+Space, Home, and End. Confirm forward scrolling advances frames, reverse scrolling reverses frames, browser momentum remains natural, and no input becomes trapped by the sticky section. Navigate directly to `/#how-its-made`, then confirm its progress initializes correctly without requiring an additional scroll event.

- [ ] **Step 6: Verify scroll stability during resize and loading**

While each animation is mid-progress, resize the viewport and rotate mobile emulation. Confirm progress remains clamped from 0 to 1, the selected frame remains aligned with the current section position, and loading a delayed exact frame replaces the nearest-frame fallback without flashing or jumping the document scroll position.

- [ ] **Step 7: Verify cache and concurrency behavior**

In the Network panel, confirm at most four frame requests are actively transferring at once. Reload with cache enabled and confirm the frame responses are served from memory/disk cache with the immutable caching header.

- [ ] **Step 8: Test responsive, resolution, and reduced-motion behavior**

Check widths 390px, 768px, and 1440px. Inspect both canvas elements and confirm their DOM backing dimensions are exactly `width=2560` and `height=1440`; CSS may fit them responsively but must not replace the backing store with a smaller size. Enable reduced motion and confirm loader transitions are disabled while both burger images remain visible and correctly fitted.

- [ ] **Step 9: Run the final verification gate**

Run:

```bash
npm run lint && npm run test && npm run build && git diff --check
```

Expected: exit code 0 for the full command.

- [ ] **Step 10: Commit any verification-only correction, then push after user-approved execution**

If verification required a correction, commit only the relevant files with a message describing that defect. Once the implementation is complete and verified, push the resulting commits to `origin/main` as previously requested by the user.

---

## Library Decision

Do not add a runtime React image library for the frame sequences. React/Next image components are useful for standalone responsive images, but they do not manage scroll-target prioritization, decoded-frame memory, cancellation, or nearest-frame fallback. The native browser APIs in this plan preserve the supplied PNG pixels and provide direct control over the sequence. Vitest is the only new package, used for deterministic scheduler tests.

Lossless WebP or AVIF conversion is deliberately excluded because the user previously asked not to compress the images. It can be benchmarked later as a separately approved optimization while retaining the original PNG archive.
