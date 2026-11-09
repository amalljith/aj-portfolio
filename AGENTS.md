# AJ Portfolio — contributor guidance

## Project and current scope

This is Amal Jith's developer portfolio. Amal is a Python Developer. Use React
functional components, JavaScript/JSX, Vite, and Tailwind CSS v4.

The current milestone is the project foundation only. Keep the app as a minimal
placeholder. Do not implement the Navbar, Hero, or any other website sections
until explicitly instructed. Do not install animation libraries or implement
motion features yet. `MOTION.md` records future plans, not current deliverables.

## Visual identity

- Use a premium, minimal Mixed Editorial direction: oversized display type,
  clear hierarchy, generous whitespace, thin borders, and section-based colors.
- Atelier North and Endcap are references for visual principles. Do not copy
  their layouts, branding, or assets.
- Use pixel-inspired details sparingly and only with a purpose.
- Do not add box shadows, glow effects, or unnecessary gradients.
- The selected logo is a futuristic geometric AJ monogram. Its final production
  SVG has not been supplied. Use ordinary text until it arrives; do not invent
  an alternate symbol, monogram, or branded favicon.
- Do not invent personal claims, projects, clients, or achievements.

## Source map

- `src/main.jsx`: React entry point; retain StrictMode.
- `src/App.jsx`: application composition; currently a text placeholder.
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
  navigation/technical labels, `font-editorial` (Instrument Serif) for selective
  accents, and `font-body`/`font-sans` (Space Grotesk) for readable copy.
- Anton is visually bold at its real weight of 400; use `font-normal`. Instrument
  Serif is also loaded at 400. Avoid synthesizing heavy or italic variants.
- Fonts are declared in one Google Fonts stylesheet in `index.html`, with
  preconnects, `display=swap`, and fallback stacks. Currently only regular 400
  styles are requested. Request additional weights/styles only when used.
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
