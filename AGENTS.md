# AJ Portfolio — contributor guidance

## Project and current scope

This is Amal Jith's developer portfolio. Amal is a Python Developer. Use React
functional components, JavaScript/JSX, Vite, and Tailwind CSS v4.

The foundation, Navbar, and Hero V5 are implemented. The Navbar uses a CSS character
roll and an outlined CONTACT link. The approved geometric mobile toggle controls a
fullscreen mobile navigation overlay with GSAP timelines, focus containment, and
scroll locking. The Hero uses a scoped GSAP entrance with masked typography,
responsive SplitText lines, and a geometric SVG drawing. Its temporary Explore
Work button announces that selected work is coming soon.
An independent CSS ambient signal starts after the entrance settles, with distinct
horizontal desktop and vertical mobile artwork. It has no visible controls;
reduced motion hides it, and offscreen/background-tab visibility suspends it.
After the entrance settles, the name uses the approved Anybody variable-font
interaction: mouse proximity and touch/pen press-and-glide thin nearby characters
from weight 900 to 300, width 55 to 68, and scale 1 to 0.95. Passive input preserves
native scrolling.
Reduced motion disables interaction, including live preference changes.
Replace the Explore Work button with a #work anchor when the real Work section exists.
Do not build other sections or additional motion features until explicitly
instructed. Hero V5 awaits visual approval before additional motion development.
GSAP is shared by the mobile navigation and Hero; SplitText ships with that
existing dependency. ScrollTrigger and Lenis are not installed. `MOTION.md`
records the implemented entrances and the broader future motion plan.

The approved Anybody comparison has been promoted to production. Its temporary
route, components, hooks, optional Roboto Flex assets, and obsolete Archivo assets
are removed. Anybody's local name-only subset lives in `src/assets/fonts/`; its
role-only subset shares the OFL in `public/licenses/Anybody-OFL.txt`. The original
name subset is unchanged. Anton remains the general display font.
See the font directory's README for provenance and axes.

## Visual identity

- Use a premium, minimal Mixed Editorial direction: oversized display type,
  clear hierarchy, generous whitespace, thin borders, and section-based colors.
- Atelier North and Endcap are references for visual principles. Do not copy
  their layouts, branding, or assets.
- Use pixel-inspired details sparingly and only with a purpose.
- Do not add box shadows, glow effects, or unnecessary gradients.
- The approved Concept 01 geometric AJ monogram is implemented in
  `src/components/branding/AJLogo.jsx` and `public/branding/aj-monogram.svg`.
  Preserve their matching geometry. Do not replace the branding or alter its
  paths without explicit instructions. Favicon integration remains pending.
- Do not invent personal claims, projects, clients, or achievements.

## Source map

- `src/main.jsx`: React entry point; retain StrictMode.
- `src/App.jsx`: Navbar, skip link, and Hero composition.
- `src/components/sections/Hero.jsx` and its CSS: responsive editorial Hero V5,
  fixed character cells, entrance layers, and inner variable-font glyphs.
- `src/components/sections/HeroAmbient.jsx` and its CSS: distinct responsive
  decorative signal paths and visibility lifecycle; keep separate from the entrance.
- `src/hooks/useHeroEntrance.js`: entrance timing, bounded font preparation,
  reduced motion, external controls, and cleanup. Keep motion scoped to the Hero.
- `src/hooks/useFluidTypography.js`: approved pointer/touch axis interpolation,
  font/entrance gating, and idle ticker cleanup. Owns inner glyph axes and scale only.
- `src/components/layout/Navbar.jsx`: desktop navigation and mobile integration.
- `src/components/layout/MobileNavigation.jsx` and its CSS: fullscreen panel.
- `src/hooks/useMobileNavigation.js`: timeline, modal behavior, and cleanup.
- `src/data/navigation.js`: shared section destinations.
- `src/components/ui/MobileMenuToggle.jsx` and its CSS: controlled geometric toggle.
- `src/components/ui/CharacterRoll.jsx` and its CSS: accessible label roll.
- `src/index.css`: Tailwind import, shared tokens, and base styles.
- `index.html`: document metadata and font loading.
- `vite.config.js`: existing React and Tailwind Vite integrations.
- `MOTION.md`: planned animation principles and acceptance criteria.

Keep components near their usage until reuse or complexity warrants extraction.
Introduce `src/components/` for reusable UI when needed; do not create empty
component scaffolds or speculative abstractions. Separate site content from
repeated presentation logic as the site grows.

## Styling and fonts

- Preserve Tailwind v4's `@import "tailwindcss"` and Vite plugin setup. Do not
  introduce a v3 configuration or PostCSS pipeline without a concrete need.
- Define palette values once in `src/index.css` under `@theme`. Initial values:
  cream `#FFF1D6`, cobalt `#0047AB`, off-white `#F5F4EE`, near black `#171916`,
  lime `#DCEB80`. They are provisional.
- Use semantic tokens for surfaces, ink, accents, and borders. Components should
  use utilities such as `bg-surface`, `text-ink`, `text-accent`, `border-rule`,
  `px-gutter`, and `max-w-content` instead of repeating values.
- Use `font-display` (Anton) for display text, `font-mono` (Kode Mono) for
  navigation/technical labels, and `font-body`/`font-sans` (Space Grotesk) for copy.
- Anton is visually bold at its real weight of 400; use `font-normal`.
- The Hero role uses local `--font-hero-role` (AJ Anybody Role): PYTHON at weight
  900 / width 75, developer. at weight 500 / width 90. Both are upright. The role
  subset covers only those words. Instrument Serif is no longer loaded or used.
- The Hero name alone uses `--font-hero-name` (local AJ Anybody), resting at
  `wght=900, wdth=55, scale=1`. Its fixed cells cover the approved coupled axis path.
  Entrance transforms belong to `.hero__char`; axes and scale belong to `.hero__glyph`.
- Shared fonts are declared in one Google Fonts stylesheet in `index.html`, with
  preconnects, `display=swap`, and fallback stacks. Anton, Kode Mono, and Space
  Grotesk are requested at 400. Request other weights/styles only when used.
- Anybody uses separate name and role CSS faces with `font-display: swap` and
  bundled WOFF2 subsets. Font readiness reuses the browser cache. A missing/late
  face stays on the Hero-local fallback after the entrance's bounded preparation deadline;
  never enable variable interaction on fallback text.
- Keep fluid type and spacing bounded with `clamp()`. Prefer responsive content
  flow to fixed dimensions. Do not mask layout overflow with global clipping.

## Accessibility and behavior

- Use semantic HTML, meaningful headings, real links for navigation, and buttons
  for actions. Keep keyboard focus visible and interactions keyboard accessible.
- Check contrast for each foreground/background combination, including future
  section surfaces; the palette alone does not guarantee accessible contrast.
- Keep body text legible, support zoom and narrow screens, and preserve native
  scrolling and text selection. Do not force heights that clip content.
- Keep primary content readable if fonts or future animation code fail to load.
- Follow `MOTION.md` when motion is explicitly authorized. Never hide essential
  content behind a preloader.

## Dependencies and validation

- Preserve existing React and Tailwind configuration. Use existing dependencies;
  avoid additions unless the requested feature needs them. Explain changes.
- `npm run dev` starts Vite; `npm run build` creates the production build;
  `npm run lint` runs Oxlint; `npm run preview` serves the built output.
- Run available lint and production build checks after changes. On Windows,
  use `npm.cmd` if PowerShell execution policy blocks `npm.ps1`.
- There is currently no automated test script. Add meaningful tests for new
  behavior when warranted; do not add dependencies or tests for static styling
  alone. Report browser verification that could not be performed.
- Remove assets only after checking references and confirming their origin.

## Git and delivery

Do not automatically commit, push, change branches, or create pull requests.
Keep foundation work local; deployment is outside the current scope. Preserve
unrelated user changes. Report created, modified, and deleted files, dependency
changes, validation results, and remaining issues at handoff.
