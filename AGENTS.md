# AJ Portfolio — contributor guidance

## Project and current scope

This is Amal Jith's developer portfolio. Amal is a Python Developer. Use React
functional components, JavaScript/JSX, Vite, and Tailwind CSS v4.

The approved editorial Hero V2 is integrated into production. Its graphite,
ivory, and orange composition uses wide Anybody typography, original SVG collage
artwork, responsive desktop/mobile layouts, and its own scoped GSAP motion.
The Navbar, AJ monogram, character roll, CONTACT outline, and fullscreen mobile
navigation retain their approved components and behavior. A page-local palette
provides the approved dark Navbar appearance; the sibling preloader now shares
graphite/orange/ivory colors with architectural construction and a 2.64-second
stepped orange curtain sequence.

App mounts Hero with autoPlay=false and a ref. The preloader calls play() once
when the last orange step clears [data-hero-heading]. Hero also exposes restart()
and finish(). Never duplicate its entrance in the preloader. Fonts prepare under
the overlay; preparation is bounded to 600ms. Reduced motion, skip, and failures
show usable content promptly. See MOTION.md for lifecycle and timing.

The name uses the existing local Anybody subset: AMAL rests at weight 500/width
125 and responds toward weight 800; JITH. rests at 800/110 and responds toward
500. Fixed cells preserve spacing. Desktop fine pointers get graded weight,
color, and up to 6px lift, with 320ms response and 520ms return. Artwork pointer
and native-scroll transforms occupy separate layers, including independent
plane/corner/grid responses. Desktop artwork uses a wider architectural SVG;
mobile uses a separate simplified SVG. An IntersectionObserver suspends interaction
work outside the viewport without replaying the entrance on return. Coarse
pointers preserve static type and native touch scrolling. Reduced motion disables
these effects, including live changes. There is no idle Hero loop or Lenis. About uses ScrollTrigger from the existing
GSAP package; no new package was installed.

Explore Work is explicitly unavailable with a visible coming-soon description
while no real Work section exists. When adding that section, supply workHref="#work"
to Hero in App; do not offer a broken destination or simulate navigation.
Do not build additional sections or motion features without explicit instructions.
The approved preview is promoted: its query route, comparison controls, and
src/dev/hero-v2 directory are removed. Do not recreate preview utilities in production.
Fonts and the Anybody OFL are retained; see the font directory's README.

The About section at #about is completed and approved. It uses
an ivory editorial surface, Anton line masks, a short native CSS sticky headline
track on sufficiently tall desktops, Space Grotesk copy, a neutral portrait frame,
and section-owned reversible ScrollTrigger reveals. CODE. is orange; the About
role is PYTHON DEVELOPER only. A brief cursor label and one-shot Proofread intro
use SplitText from the existing GSAP package. The paragraph uses one reading-order
Swipe reveal; indexed FOCUS/TOOLS rows use one short Overtype sequence, gated on
viewport entry and paragraph completion. Text settles once; only decorative scrub
motion reverses. Pending text re-splits on width/font changes; started text settles
to its final form on rebuild. Selection/focus restores plain content. Plugins load
only after the opening releases scrolling, and are not requested for initial reduced-motion
or direct About-focus visits. No JS pinning, spacer, scroll lock, or Lenis is used.
See MOTION.md and README.md for behavior and portrait replacement. Do not proceed
to another section or expand this motion without explicit instructions.

Phase 05 Expertise is implemented at #expertise and awaits visual approval. It
contains five featured and seventeen supporting technologies, including the approved
Deployment Platforms and AI Development Tools categories below Backend on desktop.
All 22 tools use six groups including the unchanged featured showcase. At suitable desktop
sizes, a measured native CSS sticky stage
uses 896–1408px of added scroll travel, with one scoped ScrollTrigger controlling
five reversible active states. Desktop eligibility starts at 560px height and
requires measured content to fit; a compact treatment below 704px removes secondary
construction art and trims gaps. Tablet/mobile, very short/unsafe viewports, reduced
motion and failed enhancement retain the normal-flow list. Late enhancement and
breakpoint changes preserve the current article instead of permanently stacking
an eligible desktop; section anchors remain compatible with the sticky stage.
Grouped-character emphasis is distinct from About's text treatments. Brand marks
remain intact; five separate decorative icon entrances are finite. Supporting
items are real documentation links with hover/focus emphasis, not fake controls.
Public SVGs, provenance and the Devicon MIT notice live in public/icons/technologies.
No new dependency, Lenis, scroll lock, JS pin spacer, or idle loop is added.
Do not build Experience, Work or Contact without explicit instructions.

The AJ Signal Cursor mounts once through a body portal after the preloader.
It uses a 12px filled Electric Orange square with exact center tracking and
compact single-line action labels over real controls. A bounded Canvas 2D fragment
pool adapts size, density, spread and decay to movement speed, with quieter About
and slow-frame budgets. Ivory/white cursor marks are not used. Fine mouse input is required; reduced motion and touch use the native
cursor. Text entry, selection, pointer capture, keyboard use and viewport exit
restore native behavior. Its data-cursor API and scoped lifecycle are independent
of section timelines; see MOTION.md. No cursor-dependent actions may be added.

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
- `src/components/cursor/SignatureCursor.jsx`, `cursorModes.js` and `cursor.css`:
  one decorative portal, declarative action resolution and orange geometry.
- `src/hooks/useSignalCursor.js`: exact center tracking, finite type/click timelines,
  capability/reduced-motion fallback and owned cleanup.
- `src/components/cursor/ShatterTrail.js`: fixed-capacity Canvas 2D fragments,
  distance-based emission, smoothed velocity and finite decay; no independent loop.
- `src/App.jsx`: Navbar, skip link, Hero, About and Expertise; section motion is
  enabled only after the preloader completes.
- `src/components/sections/Hero.jsx` and its CSS: approved Hero V2, stable character
  cells, responsive viewport composition, scoped page palette, and CTA availability.
- `src/components/sections/AboutSection.jsx` and `About.css`: semantic #about,
  scoped ivory palette, masked display type, and responsive editorial layout.
- `src/components/sections/AboutPortrait.jsx`: accessible neutral placeholder and
  future image/crop/error fallback; never fetch or fabricate a person.
- `src/components/sections/AboutGeometry.jsx`: secondary architectural SVG lines.
- `src/hooks/useAboutMotion.js`: lazy ScrollTrigger enhancement, scoped scrub
  contexts, media/font/resize/inert lifecycle, and readable static fallbacks.
- `src/hooks/aboutTextMotion.js`: one-shot cursor label, fixed-slot Proofread intro,
  compact paragraph Swipe trails, and fixed-slot metadata Overtype. No Telegram,
  continuous scramble, or competing text entrances.
- `src/components/sections/ExpertiseSection.jsx` and `Expertise.css`: semantic
  #expertise, native sticky showcase, natural-flow fallback and documentation index.
- `src/components/sections/ExpertiseIcon.jsx`: local brand images and separate
  geometric accents; never distort the downloaded brand paths.
- `src/hooks/useExpertiseMotion.js`: scoped activation, finite icon/glyph motion,
  media/font/inert lifecycle and reading-position preservation on mode changes.
- `src/data/expertise.js`: the approved 22-tool stack, factual descriptions and real
  documentation URLs. Motion is displayed as a skill, not installed as a package.
- `src/components/sections/HeroArtwork.jsx`: original decorative collage SVG.
- `src/hooks/useHeroMotion.js`: controlled entrance, bounded font preparation,
  glyph response, pointer/scroll layers, reduced motion, and lifecycle cleanup.
- `src/hooks/usePreloader.js`: geometric construction, orange stepped curtain,
  controlled Hero handoff, and restored scroll/inert/focus state.
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
  lime `#DCEB80`. The approved Hero adds graphite `#151515`, ivory `#F5EEDC`,
  and orange `#FF5C28`; the page overrides semantic roles locally.
- Use semantic tokens for surfaces, ink, accents, and borders. Components should
  use utilities such as `bg-surface`, `text-ink`, `text-accent`, `border-rule`,
  `px-gutter`, and `max-w-content` instead of repeating values.
- Use `font-display` (Anton) for display text, `font-mono` (Kode Mono) for
  navigation/technical labels, and `font-body`/`font-sans` (Space Grotesk) for copy.
- Anton is visually bold at its real weight of 400; use `font-normal`.
- The name uses the existing local AJ Anybody face: wght 100-900, wdth 50-150.
  AMAL uses 500/125 and JITH. uses 800/110; hover changes weight only. Fixed cells
  cover measured advances across 21 weights. Outer reveal spans own the entrance;
  inner glyphs own weight/color/lift. No italics or synthesized weight changes.
- The role and technical labels use Kode Mono; copy uses Space Grotesk 400.
  The former role-only Anybody subset is retained but unused by the current Hero.
- Shared fonts are declared in one Google Fonts stylesheet in `index.html`, with
  preconnects, `display=swap`, and fallback stacks. Anton, Kode Mono, and Space
  Grotesk are requested at 400. Request other weights/styles only when used.
- Anybody retains its name and former role CSS faces with `font-display: swap` and
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
