# Portfolio Theme Mode Design

## Goal

Add dark and light mode to the portfolio while preserving the current dark look as the dark theme. On a visitor's first visit, the site should use their operating system color preference. When the visitor uses the toggle, that explicit choice should override the system preference and persist across reloads.

## Current Context

The project is a Vite, React 19, React Router, and Tailwind CSS v4 portfolio. Theme colors are currently hard-coded across `src/index.css` and route/section components with classes such as `bg-black`, `bg-zinc-900`, `text-white`, `text-gray-300`, and project-specific colors like `black-100`.

The repo already has uncommitted edits in several source files. Theme work must be scoped and must not revert or rewrite unrelated changes.

## Recommended Architecture

Use class-free semantic theming through CSS custom properties on the root document element:

- `data-theme="dark"` keeps the current dark visual direction.
- `data-theme="light"` swaps semantic variables for light surfaces and text.
- React owns theme state through a small provider and hook.
- CSS owns color rendering through semantic variables and utility classes.

This fits the current codebase because much of the shared UI styling already lives in `src/index.css`, while still allowing component-level hard-coded classes to be patched gradually where needed.

## Theme Behavior

On first load:

1. If `localStorage.portfolio-theme` is `"light"` or `"dark"`, use that value.
2. Otherwise, use `window.matchMedia("(prefers-color-scheme: dark)")`.
3. Apply the resolved value to `document.documentElement.dataset.theme`.

After a visitor toggles:

1. Save the explicit theme to `localStorage.portfolio-theme`.
2. Apply it immediately to `document.documentElement.dataset.theme`.
3. Continue using the saved value on future visits.

System preference changes:

- If the visitor has not chosen a theme manually, update with the system preference.
- If the visitor has a saved explicit choice, keep that saved choice.

## UI

Add a compact theme toggle to the navbar for desktop and mobile.

- The control must be a real `<button>`.
- It must expose an accessible label such as `"Switch to light mode"` or `"Switch to dark mode"`.
- It should use a small icon-like visual rather than long text.
- It should match the existing navbar button styling and green/emerald accent system.

## Styling Scope

Add semantic theme variables for:

- Page background
- Section background
- Elevated surface
- Card surface
- Primary text
- Muted text
- Soft text
- Border
- Overlay
- Input background
- Accent colors

Then migrate shared/global styles first:

- `html, body`
- `.navbar`
- mobile menu
- `.card-border`
- timeline rails and logos
- forms
- footer shared styles
- gradient edges

Patch route and section components enough that all current routes remain readable in both themes:

- Home
- About
- Case Studies
- Blog
- Blog post
- Process
- Projects
- Project detail

The light theme should not look like a separate redesign. It should feel like the same portfolio with lighter surfaces, dark text, and preserved emerald accents.

## Testing And Verification

Add focused tests for theme resolution and persistence if the project has an existing test runner. If it does not, keep the theme logic small and pure enough to inspect, and verify with:

- `npm run build`
- local dev server visual pass
- manual checks for default system preference, persisted override, and navbar toggle behavior

## Non-Goals

- Do not add a full settings panel.
- Do not redesign the portfolio layout.
- Do not replace Tailwind or introduce a new styling framework.
- Do not refactor unrelated components.
