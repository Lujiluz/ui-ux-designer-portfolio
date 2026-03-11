# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server at http://localhost:3000
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Tech Stack

- **Next.js 16** with App Router (`/src/app`)
- **React 19** + **TypeScript**
- **Tailwind CSS v4** (PostCSS-based, no `tailwind.config.js` — configuration is in CSS)
- **shadcn UI** components (style: "base-vega") located in `src/components/ui`
- **@base-ui/react** for headless primitives
- **lucide-react** for icons

## Architecture

- `src/app/` — Next.js App Router pages and layouts
- `src/components/` — Reusable components; `src/components/ui/` for shadcn-generated UI primitives
- `src/lib/utils.ts` — `cn()` utility (clsx + tailwind-merge) for conditional class merging
- Path alias `@/*` maps to `./src/*`

## Styling Conventions

- Use Tailwind utility classes; merge with `cn()` from `@/lib/utils`
- CSS custom properties (oklch color format) define the theme; dark mode via `.dark` class
- Component variants use `class-variance-authority` (cva)
- Animation utilities via `tw-animate-css`

## Adding shadcn Components

```bash
npx shadcn@latest add <component-name>
```

Components are added to `src/components/ui/`.
