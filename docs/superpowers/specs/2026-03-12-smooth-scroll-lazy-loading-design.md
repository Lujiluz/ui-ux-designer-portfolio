# Smooth Scroll Navigation, Lazy Loading & Viewport Animations

**Date:** 2026-03-12
**Status:** Approved

---

## Overview

Three improvements to the portfolio site targeting UX polish and mobile performance:

1. Lenis-aware smooth scroll navigation via a React context
2. Code-split lazy loading for below-fold sections
3. Responsive viewport-margin-based animation triggers

---

## 1. Lenis Context

### Goal
Expose the Lenis scroll instance to any component that needs to programmatically scroll, without prop-drilling or module-level globals.

### Design
- Create `src/context/LenisContext.tsx` exporting:
  - `LenisProvider` — initializes Lenis, runs the RAF loop, provides instance via `React.createContext<Lenis | null>`
  - `useLenis()` — hook that reads from context; throws if used outside provider
- `SmoothScroll.tsx` is updated to use `LenisProvider` internally (the component stays as the public API in `page.tsx`, it just delegates to the provider)
- Lenis config: `smoothTouch: false` (default) — touch devices use native momentum scroll, no JS overhead on mobile

### Interface
```ts
const lenis = useLenis(); // returns Lenis instance
lenis.scrollTo('#skills');
lenis.scrollTo(0); // back to top
```

---

## 2. Header: Smooth Navigation + Temporary Re-appear

### Goal
Nav links scroll smoothly via Lenis and the header re-appears during programmatic scroll, then hides again once idle.

### Design
- Nav `<a>` tags replaced with `<button>` elements calling `lenis.scrollTo(href)`
- A `navigating` ref (`useRef<boolean>`) suppresses the hide logic during programmatic scroll
  - Set to `true` on nav button click
  - Cleared in the Lenis `scrollTo` `onComplete` callback
- Header visibility: `hidden = scrollY > 60 && !navigating.current`
- Using a `ref` (not `state`) avoids unnecessary re-renders on every scroll tick

### Section ID Fixes
All four nav hrefs must match section element IDs:

| Nav href | Action |
|---|---|
| `#introduction` | Add `id="introduction"` to `<section>` in HeroSection |
| `#projectsexperiences` | Add `id="projectsexperiences"` to `<section>` in ExperienceTimeline |
| `#skills` | Already correct — no change |
| `#letstalk` | Update ContactSection `id` from `"contact"` to `"letstalk"` |

---

## 3. Back to Top Button

### Goal
A fixed, accessible button that smoothly scrolls to the top of the page, matching the neo-brutalist CTA style.

### Design
- New component: `src/components/BackToTop.tsx`
- Registered in `page.tsx` as a dynamic import (code-split)
- Fixed position: `bottom-6 right-6`, `z-50`
- Visible after `scrollY > 400` — uses a single passive `scroll` listener on `window`
- Enter/exit: `AnimatePresence` — fade + `translateY(16px → 0)` on enter, reverse on exit

### Styling (matches ContactSection CTA)
```
bg-primary text-black rounded-lg border border-black
shadow-[6px_6px_0px_rgba(85,85,85,1)] cursor-pointer
px-4 py-4
```
Icon: `ArrowUp` from `lucide-react`

### Interaction
- `whileHover={{ y: -2 }}`
- `whileTap={{ x: 2, y: 2, boxShadow: "0px 0px 0px rgba(85,85,85,1)" }}`
- On click: `lenis.scrollTo(0)`

---

## 4. Lazy Loading

### Goal
Split JS bundles so mobile devices download only what is needed for the initial viewport.

### Design
- `page.tsx` uses `next/dynamic` for all below-fold components
- Each dynamic import includes a `loading` prop returning a `<div>` with an approximate `minHeight` to prevent Cumulative Layout Shift (CLS)

### Eager imports (visible on first paint)
- `Header`
- `HeroSection`
- `MarqueeBanner` (first instance)

### Dynamic imports (code-split)
| Component | Approx loading placeholder height |
|---|---|
| `ExperienceTimeline` | `300px` |
| `ProjectsGrid` | `600px` |
| `MarqueeBanner` (second) | `64px` |
| `SkillsSection` | `400px` |
| `ContactSection` | `500px` |
| `Footer` | `100px` |
| `BackToTop` | none (fixed position, no layout impact) |

---

## 5. Viewport Animation Margins

### Goal
Animations trigger when a meaningful portion of the section is in view — responsive across screen sizes, engaging on mobile.

### Design
Replace all hardcoded `margin: "-100px"` values with percentage-based equivalents:

| Element type | `viewport.margin` | Rationale |
|---|---|---|
| Section containers | `"-15%"` | Triggers when 15% of section height is visible |
| Individual items (pills, cards, text) | `"-10%"` | Slightly earlier to feel snappy once section appears |

Affected components: `ContactSection`, `SkillsSection`, `ExperienceTimeline`, `ProjectsGrid`

All existing `once: true` flags are preserved — animations fire once and stay.

---

## File Change Summary

| File | Change type |
|---|---|
| `src/context/LenisContext.tsx` | New |
| `src/components/SmoothScroll.tsx` | Update — delegate to LenisProvider |
| `src/components/Header.tsx` | Update — useLenis, navigating ref, button nav |
| `src/components/HeroSection.tsx` | Update — add section id |
| `src/components/ExperienceTimeline.tsx` | Update — add section id, fix viewport margin |
| `src/components/ContactSection.tsx` | Update — fix id, fix viewport margin |
| `src/components/ProjectsGrid.tsx` | Update — fix viewport margin |
| `src/components/SkillsSection.tsx` | Update — fix viewport margin |
| `src/components/BackToTop.tsx` | New |
| `src/app/page.tsx` | Update — lazy imports, add BackToTop |
