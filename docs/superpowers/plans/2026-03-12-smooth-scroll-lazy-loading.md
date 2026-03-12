# Smooth Scroll Navigation, Lazy Loading & Viewport Animations — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Lenis-aware smooth navigation, a back-to-top button, code-split lazy loading, and responsive viewport animation margins to the portfolio.

**Architecture:** `SmoothScroll` becomes a React context provider exposing the Lenis instance. `Header` and `BackToTop` consume the instance via `useLenis()`. Below-fold sections are code-split with `next/dynamic`. All `whileInView` triggers shift from fixed-pixel to percentage-based viewport margins.

**Tech Stack:** Next.js 15, React 19, Framer Motion, Lenis, lucide-react, TypeScript

**Spec:** `docs/superpowers/specs/2026-03-12-smooth-scroll-lazy-loading-design.md`

**Verification command (no test suite — use build + lint):**
```bash
npm run lint && npm run build
```

---

## Chunk 1: Lenis Context, SmoothScroll, Header, Section IDs, BackToTop

### Task 1: Create LenisContext

**Files:**
- Create: `src/context/LenisContext.tsx`

- [ ] **Step 1: Create the file**

```tsx
"use client";

import { createContext, useContext } from "react";
import type Lenis from "lenis";

export const LenisContext = createContext<Lenis | null>(null);

export function useLenis(): Lenis | null {
  return useContext(LenisContext);
}
```

- [ ] **Step 2: Verify — no errors**

```bash
npm run lint
```
Expected: no errors on the new file.

- [ ] **Step 3: Commit**

```bash
git add src/context/LenisContext.tsx
git commit -m "feat(context): add LenisContext and useLenis hook"
```

---

### Task 2: Refactor SmoothScroll into context provider + fix RAF leak

**Files:**
- Modify: `src/components/SmoothScroll.tsx`

Current file initializes Lenis and runs a RAF loop but (a) does not expose the instance and (b) leaks the RAF on cleanup. Replace the entire file:

- [ ] **Step 1: Rewrite SmoothScroll.tsx**

```tsx
"use client";

import { useEffect, useState } from "react";
import Lenis from "lenis";
import { LenisContext } from "@/context/LenisContext";

const SmoothScroll = ({ children }: { children: React.ReactNode }) => {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const instance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
    });

    setLenis(instance);

    let rafId: number;
    function raf(time: number) {
      instance.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      instance.destroy();
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <LenisContext.Provider value={lenis}>
      {children}
    </LenisContext.Provider>
  );
};

export default SmoothScroll;
```

- [ ] **Step 2: Verify**

```bash
npm run lint && npm run build
```
Expected: build succeeds, no type errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/SmoothScroll.tsx
git commit -m "refactor(scroll): promote SmoothScroll to Lenis context provider and fix RAF leak"
```

---

### Task 3: Update Header — smooth nav + temporary re-appear

**Files:**
- Modify: `src/components/Header.tsx`

Changes: replace `<a>` nav tags with `<button>`, add `useLenis()`, add `navigatingRef` + fallback timer, fix visibility condition.

- [ ] **Step 1: Add imports and refs at top of component**

Add `useRef` to the existing React import and add `useLenis`:
```tsx
import { useState, useEffect, useRef } from "react";
import { useLenis } from "@/context/LenisContext";
```

Inside `Header`:
```tsx
const lenis = useLenis();
const navigatingRef = useRef<boolean>(false);
const fallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
```

- [ ] **Step 2: Add scrollToSection helper** (inside `Header`, before return)

**Critical ordering:** `navigatingRef.current = true` MUST be set synchronously before calling `lenis.scrollTo()`. The existing `onScroll` handler fires immediately when scroll starts, so the guard must already be `true` by then.

```tsx
function scrollToSection(href: string) {
  if (!lenis) return;
  // Set BEFORE lenis.scrollTo() — onScroll may fire on the very next tick
  navigatingRef.current = true;
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

- [ ] **Step 3: Update the onScroll handler to respect navigatingRef**

Find the existing `onScroll` function and update the condition:
```tsx
// Before:
if (window.scrollY > 60) { setHidden(true); ... }
// After:
if (window.scrollY > 60 && !navigatingRef.current) { setHidden(true); ... }
```

- [ ] **Step 4: Replace desktop nav `<a>` tags with `<button>`**

Find the desktop nav map and replace:
```tsx
// Before:
<a key={item.label} href={item.href} className="...">
  {item.label}
</a>

// After:
<button
  key={item.label}
  onClick={() => scrollToSection(item.href)}
  className="text-sm text-foreground hover:text-foreground transition-colors duration-200 font-body px-4 py-2 rounded-xl hover:bg-white/[0.07]"
>
  {item.label}
</button>
```

- [ ] **Step 5: Replace mobile nav `<motion.a>` tags with `<motion.button>`**

Find the mobile dropdown nav map and replace:
```tsx
// Before:
<motion.a
  key={item.label}
  href={item.href}
  ...
  onClick={() => setIsOpen(false)}
  className="..."
>
  {item.label}
</motion.a>

// After:
<motion.button
  key={item.label}
  onClick={() => { scrollToSection(item.href); setIsOpen(false); }}
  initial={{ opacity: 0, x: -10 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: i * 0.07, duration: 0.22 }}
  className="text-sm text-muted-foreground hover:text-foreground transition-colors font-body px-5 py-4 hover:bg-white/6 border-b border-white/6 last:border-0 w-full text-left"
>
  {item.label}
</motion.button>
```

- [ ] **Step 6: Verify**

```bash
npm run lint && npm run build
```
Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add src/components/Header.tsx
git commit -m "feat(header): add Lenis smooth navigation with temporary re-appear on nav click"
```

---

### Task 4: Fix section IDs

**Files:**
- Modify: `src/components/ExperienceTimeline.tsx` (line 48)
- Modify: `src/components/ContactSection.tsx` (line 29)

- [ ] **Step 1: Fix ExperienceTimeline** — change `id="projectexperiences"` to `id="projectsexperiences"` (adds "s")

In `ExperienceTimeline.tsx` line 48:
```tsx
// Before:
<section id="projectexperiences" className="...">
// After:
<section id="projectsexperiences" className="...">
```

- [ ] **Step 2: Fix ContactSection** — change `id="contact"` to `id="letstalk"`

In `ContactSection.tsx` line 29:
```tsx
// Before:
<section id="contact" className="...">
// After:
<section id="letstalk" className="...">
```

- [ ] **Step 3: Verify**

```bash
npm run lint
```

- [ ] **Step 4: Commit**

```bash
git add src/components/ExperienceTimeline.tsx src/components/ContactSection.tsx
git commit -m "fix(nav): correct section ids to match header nav hrefs"
```

---

### Task 5: Create BackToTop button

**Files:**
- Create: `src/components/BackToTop.tsx`

- [ ] **Step 1: Create the component**

```tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useLenis } from "@/context/LenisContext";

const BackToTop = () => {
  const lenis = useLenis();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleClick() {
    if (!lenis) return;
    lenis.scrollTo(0);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.22, ease: [0.32, 0, 0.2, 1] }}
          whileHover={{ y: -2 }}
          whileTap={{ x: 2, y: 2, boxShadow: "0px 0px 0px rgba(0,0,0,1)" }}
          onClick={handleClick}
          aria-label="Back to top"
          className="fixed bottom-6 right-6 z-50 p-4 bg-primary text-black rounded-lg border border-black shadow-[6px_6px_0px_rgba(85,85,85,1)] cursor-pointer"
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default BackToTop;
```

- [ ] **Step 2: Verify**

```bash
npm run lint && npm run build
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/BackToTop.tsx
git commit -m "feat(ui): add BackToTop button with Lenis smooth scroll and neo-brutalist style"
```

---

## Chunk 2: Lazy Loading and Viewport Animation Margins

### Task 6: Lazy-load below-fold sections in page.tsx

> **Note on `ssr:true`:** All below-fold components use `ssr:true` (except `BackToTop`). This means Next.js still server-renders their HTML for SEO and first-paint quality — the JS bundle is split but the DOM is present. The `loading` placeholder heights are fallbacks for **client-side navigation** (when the user arrives via a Next.js route transition and the JS chunk hasn't loaded yet), not for the initial SSR page load. This is intentional: `ssr:false` would show blank placeholders on first load and hurt perceived performance.

**Files:**
- Modify: `src/app/page.tsx`

`page.tsx` currently has 3 `MarqueeBanner` instances (lines 17, 20, 22). The first stays eager. The 2nd and 3rd are dynamically imported.

- [ ] **Step 1: Rewrite page.tsx**

```tsx
import dynamic from "next/dynamic";
import SmoothScroll from "@/components/SmoothScroll";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import MarqueeBanner from "@/components/MarqueeBanner";

// Below-fold: code-split
const ExperienceTimeline = dynamic(() => import("@/components/ExperienceTimeline"), {
  ssr: true,
  loading: () => <div style={{ minHeight: "400px" }} />,
});
const ProjectsGrid = dynamic(() => import("@/components/ProjectsGrid"), {
  ssr: true,
  loading: () => <div style={{ minHeight: "800px" }} />,
});
const MarqueeBannerDynamic = dynamic(() => import("@/components/MarqueeBanner"), {
  ssr: true,
  loading: () => <div style={{ minHeight: "64px" }} />,
});
const SkillsSection = dynamic(() => import("@/components/SkillsSection"), {
  ssr: true,
  loading: () => <div style={{ minHeight: "500px" }} />,
});
const ContactSection = dynamic(() => import("@/components/ContactSection"), {
  ssr: true,
  loading: () => <div style={{ minHeight: "600px" }} />,
});
const Footer = dynamic(() => import("@/components/Footer"), {
  ssr: true,
  loading: () => <div style={{ minHeight: "120px" }} />,
});
const BackToTop = dynamic(() => import("@/components/BackToTop"), {
  ssr: false,
});

export default function Home() {
  return (
    <SmoothScroll>
      <Header />
      <HeroSection />
      <div className="relative z-10">
        <MarqueeBanner />
        <ExperienceTimeline />
        <ProjectsGrid />
        <MarqueeBannerDynamic />
        <SkillsSection />
        <MarqueeBannerDynamic />
        <ContactSection />
        <Footer />
      </div>
      <BackToTop />
    </SmoothScroll>
  );
}
```

- [ ] **Step 2: Verify**

```bash
npm run lint && npm run build
```
Expected: build succeeds, no type errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "perf(page): lazy-load below-fold sections with next/dynamic for faster mobile TTI"
```

---

### Task 7: Update viewport animation margins — ContactSection and SkillsSection

**Files:**
- Modify: `src/components/ContactSection.tsx` (line 42)
- Modify: `src/components/SkillsSection.tsx` (line ~82)

- [ ] **Step 1: ContactSection — update viewport margin**

Find (line 42):
```tsx
viewport={{ once: true, margin: "-100px" }}
```
Replace with:
```tsx
viewport={{ once: true, margin: "-15%" }}
```

- [ ] **Step 2: SkillsSection — update viewport margin on container**

Find the outermost `motion.div` with `whileInView` (the container that drives stagger):
```tsx
viewport={{ once: true, margin: "-100px" }}
```
Replace with:
```tsx
viewport={{ once: true, margin: "-15%" }}
```
No changes to inner items — they animate via stagger variants, not separate `whileInView` calls.

- [ ] **Step 3: Verify**

```bash
npm run lint
```

- [ ] **Step 4: Commit**

```bash
git add src/components/ContactSection.tsx src/components/SkillsSection.tsx
git commit -m "perf(animation): use responsive percentage viewport margins in ContactSection and SkillsSection"
```

---

### Task 8: Update viewport animation margins — ExperienceTimeline and ProjectsGrid

**Files:**
- Modify: `src/components/ExperienceTimeline.tsx` (line 54-58)
- Modify: `src/components/ProjectsGrid.tsx`

- [ ] **Step 1: ExperienceTimeline — add margin to existing viewport prop**

Find (line 58):
```tsx
viewport={{ once: true }}
```
Replace with:
```tsx
viewport={{ once: true, margin: "-15%" }}
```

- [ ] **Step 2: ProjectsGrid — add margin to card container viewport props**

Open `ProjectsGrid.tsx` and find all `whileInView` / `viewport` declarations on the card/grid container elements. For each one, add or update:
```tsx
viewport={{ once: true, margin: "-10%" }}
```
Apply to the outer container `motion` elements (not each individual card if they are driven by stagger).

- [ ] **Step 3: Verify**

```bash
npm run lint && npm run build
```
Expected: build succeeds.

- [ ] **Step 4: Smoke test in dev**

```bash
npm run dev
```
Open `http://localhost:3000`. Check:
- [ ] Clicking nav links scrolls smoothly and header briefly re-appears
- [ ] Back-to-top button appears after scrolling 400px, scrolls to top smoothly
- [ ] Sections animate in as they enter the viewport (not immediately on page load)
- [ ] No layout shift visible as lazy-loaded sections mount
- [ ] Mobile: native scroll works, no jank, back-to-top visible

- [ ] **Step 5: Commit**

```bash
git add src/components/ExperienceTimeline.tsx src/components/ProjectsGrid.tsx
git commit -m "perf(animation): use responsive percentage viewport margins in ExperienceTimeline and ProjectsGrid"
```
