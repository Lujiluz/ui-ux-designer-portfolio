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

### Architecture
`SmoothScroll.tsx` is promoted to the Lenis context provider — it both initializes Lenis and exposes the instance via context. `src/context/LenisContext.tsx` contains only the context object and the `useLenis()` hook (no provider logic). `SmoothScroll` imports from it and calls `LenisContext.Provider` internally.

This keeps the public API in `page.tsx` unchanged (`<SmoothScroll>` stays).

**Component tree (page.tsx is unchanged):**
```
<SmoothScroll>
  <LenisContext.Provider value={lenis}>   ← rendered inside SmoothScroll
    <Header />          ← consumer via useLenis()
    <HeroSection />
    ...
    <BackToTop />       ← consumer via useLenis(), dynamically imported
  </LenisContext.Provider>
</SmoothScroll>
```

### `LenisContext.tsx` (new file)
Must be marked `"use client"` — it uses `createContext` and `useContext`, both client-only APIs.

```ts
"use client";
export const LenisContext = createContext<Lenis | null>(null);
export function useLenis(): Lenis | null {
  return useContext(LenisContext);
}
// Returns Lenis | null. Does NOT throw if used outside provider.
// Callers MUST null-check before calling .scrollTo().
```

### `SmoothScroll.tsx` (updated)
Moves Lenis initialization here (already owns it). Adds `LenisContext.Provider` around children.

**Also fix pre-existing RAF leak:** Store the `requestAnimationFrame` return value and call `cancelAnimationFrame` in the cleanup function to prevent the RAF from ticking on a destroyed Lenis instance in React Strict Mode.

```ts
useEffect(() => {
  const lenis = new Lenis({ ... });
  setLenisInstance(lenis); // expose via state → context value
  let rafId: number;
  function raf(time: number) { lenis.raf(time); rafId = requestAnimationFrame(raf); }
  rafId = requestAnimationFrame(raf);
  return () => { lenis.destroy(); cancelAnimationFrame(rafId); };
}, []);
```

### Lenis Config (unchanged from current)
```ts
{ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true, smoothTouch: false }
```
`smoothTouch: false` ensures mobile uses native scroll — no JS overhead on touch devices.

---

## 2. Header: Smooth Navigation + Temporary Re-appear

### Scroll Helper
A local `scrollToSection(href: string)` function handles nav clicks. BackToTop calls `lenis.scrollTo(0)` directly and does NOT use this helper.

```ts
const navigatingRef = useRef<boolean>(false);
const fallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

function scrollToSection(href: string) {
  if (!lenis) return;
  navigatingRef.current = true;

  // 2-second fallback in case lenis never fires onComplete
  // (e.g. user interrupts scroll with a touch gesture)
  fallbackTimerRef.current = setTimeout(() => {
    navigatingRef.current = false;
  }, 2000);

  lenis.scrollTo(href, {
    onComplete: () => {
      navigatingRef.current = false;
      if (fallbackTimerRef.current) {
        clearTimeout(fallbackTimerRef.current);
        fallbackTimerRef.current = null;
      }
    },
  });
}
```

> **Note on `onComplete`:** Lenis 1.x (`lenis@1.3.18`) supports `onComplete` in `scrollTo` options. The 2-second `fallbackTimerRef` also guards against any version edge cases — the feature works correctly regardless of whether `onComplete` fires.

Header visibility (used inside the existing `onScroll` handler — not in JSX, no re-renders):
```ts
hidden = scrollY > 60 && !navigatingRef.current
```

### Section ID Fixes (verified against actual files)

| Nav href | Target component | Current id | Required change |
|---|---|---|---|
| `#introduction` | `HeroSection` | `"introduction"` | Already correct — no change |
| `#projectsexperiences` | `ExperienceTimeline` | `"projectexperiences"` | Change to `"projectsexperiences"` (add "s") |
| `#skills` | `SkillsSection` | `"skills"` | Already correct — no change |
| `#letstalk` | `ContactSection` | `"contact"` | Change to `"letstalk"` |

**Audit:** `id="contact"` appears only on the `<section>` element in `ContactSection.tsx`. No other file references `#contact`. Safe to rename. `id="projectexperiences"` likewise appears only on the `<section>` in `ExperienceTimeline.tsx`.

**DOM order:** `ExperienceTimeline` renders before `ProjectsGrid` in `page.tsx`. Placing `#projectsexperiences` on `ExperienceTimeline` is intentional — it marks the start of the combined "Projects & Experiences" block.

---

## 3. Back to Top Button

### Component
New file: `src/components/BackToTop.tsx` — marked `"use client"`.

- Fixed position: `bottom-6 right-6`, `z-50`
- Visible state: `scrollY > 400` — tracked with a single passive `scroll` listener in `useEffect`, cleaned up on unmount
- Enter/exit: `AnimatePresence` → `opacity: 0→1` + `y: 16→0` on enter, reverse on exit

### Interaction
```ts
onClick={() => { if (!lenis) return; lenis.scrollTo(0); }}
// Inherits global duration 1.2s — feels natural for any scroll distance
```

```ts
whileHover={{ y: -2 }}
// Lift only. Shadow stays at 6px — matches ContactSection CTA pattern exactly.

whileTap={{ x: 2, y: 2, boxShadow: "0px 0px 0px rgba(0,0,0,1)" }}
// Button shifts toward shadow direction; shadow collapses to 0px.
// Value rgba(0,0,0,1) matches ContactSection CTA whileTap exactly (line 85).
```

### Styling
```
bg-primary text-black rounded-lg border border-black
shadow-[6px_6px_0px_rgba(85,85,85,1)] cursor-pointer p-4
```
Icon: `ArrowUp` from `lucide-react`, `w-5 h-5`

---

## 4. Lazy Loading

### Goal
Split JS bundles so mobile devices only download what is needed for the initial viewport.

### Eager imports (no change — visible on first paint)
- `Header`
- `HeroSection`
- `MarqueeBanner` — **1st instance only** (line 17 in page.tsx, directly after HeroSection)

### Dynamic imports (`next/dynamic`)

`page.tsx` currently has **3 MarqueeBanner instances** (lines 17, 20, 22). The 1st is eager. The 2nd (between ProjectsGrid and SkillsSection) and 3rd (between SkillsSection and ContactSection) are dynamically imported.

`BackToTop` uses `ssr: false` — it reads `window.scrollY` on mount; server-rendering would cause a hydration mismatch. All other dynamic imports use `ssr: true` (default) so their HTML is server-rendered for SEO and first paint.

Loading placeholder: a plain `<div style={{ minHeight: 'Xpx' }} />` — no spinner. Heights calibrated to mobile (taller than desktop) to prevent upward layout shift.

| Component | Instance | Placeholder `minHeight` | `ssr` |
|---|---|---|---|
| `ExperienceTimeline` | — | `400px` | `true` |
| `ProjectsGrid` | — | `800px` | `true` |
| `MarqueeBanner` | 2nd (after ProjectsGrid) | `64px` | `true` |
| `SkillsSection` | — | `500px` | `true` |
| `MarqueeBanner` | 3rd (after SkillsSection) | `64px` | `true` |
| `ContactSection` | — | `600px` | `true` |
| `Footer` | — | `120px` | `true` |
| `BackToTop` | — | none (fixed position) | `false` |

---

## 5. Viewport Animation Margins

### Why Percentage Margins
Framer Motion passes `viewport.margin` directly to `IntersectionObserver.rootMargin`. When `root` is `null` (the default viewport root), percentage values are computed relative to viewport height — standard behavior per the IntersectionObserver spec. Safari percentage `rootMargin` support was fixed in Safari 15.4 (March 2022). This is an accepted risk for a portfolio targeting modern devices.

### Values
| Element type | `viewport.margin` | Practical effect (667px phone) |
|---|---|---|
| Section containers | `"-15%"` | Triggers when ~100px of section is inside viewport |
| Individual items (cards) | `"-10%"` | Triggers slightly earlier, feels snappy |

All existing `once: true` flags are preserved.

### Per-component changes

**ContactSection** — container `motion.div` only:
```ts
viewport={{ once: true, margin: "-15%" }}  // was "-100px"
```

**SkillsSection** — container `motion.div` only. Inner items animate via stagger variants (no separate `whileInView` on each item — the stagger hierarchy drives them):
```ts
viewport={{ once: true, margin: "-15%" }}  // was "-100px"
```

**ExperienceTimeline** — the outer `motion.div` at line 54:
```ts
viewport={{ once: true, margin: "-15%" }}  // add margin (was missing)
```

**ProjectsGrid** — add `margin` to whichever `motion` containers drive card entry animations:
```ts
viewport={{ once: true, margin: "-10%" }}  // add margin (was missing)
```

---

## File Change Summary

| File | Change type | Notes |
|---|---|---|
| `src/context/LenisContext.tsx` | New | `"use client"`, context + `useLenis()` |
| `src/components/SmoothScroll.tsx` | Update | Become context provider + fix RAF leak |
| `src/components/Header.tsx` | Update | `useLenis`, `scrollToSection`, `navigatingRef` + fallback timer |
| `src/components/HeroSection.tsx` | No change | `id="introduction"` already correct |
| `src/components/ExperienceTimeline.tsx` | Update | Fix `id` typo, add `margin` to viewport |
| `src/components/ContactSection.tsx` | Update | `id="letstalk"`, `margin: "-15%"` |
| `src/components/ProjectsGrid.tsx` | Update | Add `margin: "-10%"` to viewport |
| `src/components/SkillsSection.tsx` | Update | `margin: "-15%"` on container |
| `src/components/BackToTop.tsx` | New | `"use client"`, fixed CTA button |
| `src/app/page.tsx` | Update | Lazy imports, `<BackToTop />`, remove `"use client"` if unused |
