# Featured Project Cards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current uneven featured-project grid with responsive editorial cards that present project imagery, metadata, technology, and case-study links clearly.

**Architecture:** Keep project fetching and filtering inside `ShowcaseSection`, and introduce a focused `FeaturedProjectCard` presentation component. Each card receives an existing `Project` object plus its index and alternates its desktop image position without changing mobile document order.

**Tech Stack:** React 19, TypeScript, Tailwind CSS 4, GSAP, React Router

---

### Task 1: Build The Editorial Card

**Files:**
- Create: `src/components/FeaturedProjectCard.tsx`
- Modify: `src/components/sections/ShowcaseSection.tsx`

- [ ] **Step 1: Create the focused card component**

Create a semantic article that accepts `project` and `index`, renders the first
image with the established placeholder fallback, limits tags to five, and links
to `/projects/${project.slug}`. Use an `md:grid-cols-2` layout and apply
`md:order-2` to the image when `index` is odd.

- [ ] **Step 2: Replace the old layout loop**

Import `FeaturedProjectCard`, preserve the current featured filter and three-item
limit, and render one component per item inside a vertical list:

```tsx
<div className="showcaselayout">
  {items.map((project, index) => (
    <FeaturedProjectCard
      key={project.slug || project.id}
      project={project}
      index={index}
    />
  ))}
</div>
```

- [ ] **Step 3: Preserve state behavior**

Keep the existing API request, error message, empty message, and `.showcase-card`
selector used by the GSAP reveal animation.

### Task 2: Replace Legacy Showcase Styling

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Remove obsolete nested card layout rules**

Delete `.first-project-wrapper` and `.project-list-wrapper` styles because the
new card component owns a single responsive structure.

- [ ] **Step 2: Style the section and card**

Make `.showcaselayout` a constrained vertical list. Add near-black surfaces,
thin borders, rounded image clipping, subtle green glows, clear title hierarchy,
technology pills, and a compact circular-arrow CTA. Keep all cards single-column
on mobile and two-column from the medium breakpoint.

- [ ] **Step 3: Respect reduced motion**

Disable image scaling and CTA translation under
`@media (prefers-reduced-motion: reduce)`.

### Task 3: Verify The Redesign

**Files:**
- Verify: `src/components/FeaturedProjectCard.tsx`
- Verify: `src/components/sections/ShowcaseSection.tsx`
- Verify: `src/index.css`

- [ ] **Step 1: Check stale selectors**

Run:

```bash
rg -n "first-project-wrapper|project-list-wrapper" src
```

Expected: no matches.

- [ ] **Step 2: Run the production build**

Run:

```bash
npm run build
```

Expected: Prisma generation, TypeScript compilation, and Vite build all finish
with exit code 0.
