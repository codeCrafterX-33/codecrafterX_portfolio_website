# Featured Project Cards Redesign

## Goal

Make featured projects feel more premium, easier to scan, and consistent with
the portfolio's permanent black-and-green theme.

## Layout

- Render up to three featured projects as full-width editorial cards.
- Alternate the image and content columns on desktop.
- Stack image above content on mobile.
- Keep every card in normal document flow so it cannot interfere with scrolling.

## Card Content

- Project sequence number and `Featured project` eyebrow.
- Category, title, short description, and a restrained long-description excerpt.
- Up to five technology tags from the existing `techStack`.
- A compact `View case study` link to the existing project detail route.
- The first existing project image, with the current placeholder fallback.

## Visual Direction

- Near-black card surface with thin neutral borders.
- Green accents reserved for labels, focus states, and the CTA.
- Large rounded image area with subtle hover scaling on pointer devices.
- Soft background glow for depth without overlays obscuring project screenshots.
- Clear type hierarchy and generous spacing instead of oversized buttons.

## Behavior

- Preserve the existing API request, loading behavior, empty state, and error state.
- Preserve the existing GSAP reveal animation.
- Respect reduced-motion preferences for hover transitions.
- Use semantic links and descriptive image alternative text.

## Verification

- Run the TypeScript and Vite production build.
- Confirm project fields and routes remain unchanged.
- Confirm the layout is one column on mobile and two columns within each card on
  desktop.
