# Burger Creation Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Turn the existing homepage into a polished Super Burger Co. burger-building experience using the attached 299-frame sequence.

**Architecture:** Preserve the existing App Router and component boundaries. Copy the user-provided frames into `public/images/burger-build`, update the canvas loader to use the actual frame count, and consolidate the page styling through the existing CSS modules and shared tokens.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, CSS Modules, native canvas rendering.

**Spec:** Approved chat design based on the pasted Super Burger Co. implementation brief.

## Global Constraints

- Keep the existing Next.js App Router structure and dependencies.
- Use the provided burger frame assets; do not fabricate replacement food imagery.
- Maintain keyboard accessibility, responsive layouts, and reduced-motion support.
- Avoid adding speculative routes or backend behavior.

### Task 1: Integrate the supplied frame sequence

**Files:**
- Create: `public/images/burger-build/frame-001.png` through `frame-299.png`
- Modify: `components/BurgerAnimation.tsx`

- [ ] Copy and numerically normalize the attached PNG sequence into the public asset directory.
- [ ] Update frame count, path, and canvas sizing to match the supplied assets.
- [ ] Load the first usable frame eagerly and render a fallback frame if an individual image fails.

### Task 2: Rework the visual system and scroll hero

**Files:**
- Modify: `styles/tokens.css`
- Modify: `components/Hero.module.css`
- Modify: `components/ScrollySection.tsx`
- Modify: `components/ScrollyCopy.tsx`

- [ ] Apply cream, burnt orange, cheddar, charcoal, and pickle tokens from the brief.
- [ ] Make the first viewport read as a burger creation experience with a strong split composition.
- [ ] Use concise beat copy and ingredient callouts tied to scroll progress.
- [ ] Keep the section usable when reduced motion is requested.

### Task 3: Polish supporting sections and metadata

**Files:**
- Modify: `components/SignaturePicks.module.css`
- Modify: `components/About.module.css`
- Modify: `components/Gallery.module.css`
- Modify: `components/Footer.module.css`
- Modify: `components/Location.tsx`
- Modify: `components/FinalCTA.tsx`
- Modify: `app/layout.tsx`

- [ ] Align menu, story, gallery, location, CTA, and footer surfaces with the shared brand system.
- [ ] Keep the page content specific to the burger brand and its primary order action.
- [ ] Ensure metadata and theme color match the visual system.

### Task 4: Validate

**Files:**
- Test: repository build and lint commands

- [ ] Run `npm run build`.
- [ ] Run `npm run lint`.
- [ ] Fix only errors introduced or exposed by the implementation.
