# AJ Portfolio

Amal Jith's editorial developer portfolio, built with React, Vite, Tailwind CSS v4,
and GSAP. The visually approved Hero V2 is now the production composition at /
with the existing Navbar, AJ monogram, and branded preloader.

## Development

```sh
npm install
npm run dev
npm run lint
npm run build
npm run preview
```

Install only when dependencies are missing or inputs change. On Windows use
npm.cmd if PowerShell blocks npm.ps1. Lint runs Oxlint; there is no test script.
The preview command serves the production build. No new dependency was needed.

The former ?preview=hero-v2 entry, development directory, comparison controls,
and replay toolbar are removed. Query strings now render the same production app.

## Approved composition

The page uses graphite #151515, ivory #F5EEDC, and orange #FF5C28. These palette
tokens live in src/index.css; semantic overrides are scoped to .portfolio-page.
The actual Navbar retains its approved components, geometry, character roll,
CONTACT link, mobile toggle, focus handling, and fullscreen navigation. Its
palette matches the approved dark design. The redesigned sibling preloader uses the same graphite/orange/ivory identity
and preserves the actual AJ logo geometry.

The oversized asymmetric AMAL / JITH. heading reuses the existing local Anybody
name subset. AMAL uses weight 500/width 125; JITH. uses 800/110. Kode Mono supplies
roles and labels; Space Grotesk supplies copy. The original SVG collage is
HeroArtwork.jsx: a larger orange cut plane, negative diagonal, ivory corner
fragment, and a wider broken-line composition. A simplified mobile SVG omits
the extended grid. It is decorative artwork, not a replacement logo.

Desktop uses a minimum of 100svh minus the 84px Navbar, never a fixed height.
Padding and gaps are tightened first; a height-aware type cap preserves the
complete composition on common laptop screens. Short desktop viewports below
672px allow natural scrolling at the width-driven type size. Mobile uses its
approved stacked name, artwork beside the role, and full-width copy/CTA, with
natural scrolling and no viewport-fit font compression.

Explore Work has no fabricated destination. Until a real Work section is added,
it is explicitly aria-disabled with visible 'Selected work - coming soon' text,
and has no fake click behavior. Once App renders that section, pass
workHref="#work" to Hero to render the real anchor instead. The section IDs in
src/data/navigation.js remain reserved; mobile navigation safely closes without
scrolling or changing the hash when a destination is absent. Social links stay
hidden until real URLs are supplied. No additional sections are implemented.

## Opening and Hero motion

Every full refresh plays a 2.64s graphite/orange opening: architectural rules
construct around the actual AJ monogram, its orange outlines draw and fill, then
the completed identity holds for 200ms. A single orange field with static stepped
edges rises at 1.28s over .58s, covers the viewport, and exits upward from 1.86s
over .78s. Transform motion moves the curtain; its polygon never morphs.
There is no fake loading percentage, persistent seen flag, or cream/cobalt layer.
The last orange edge clearing [data-hero-heading] triggers Hero.play() once.
The preloader never animates Hero elements itself. Hash navigation does not replay.

App mounts Hero with autoPlay=false and a ref exposing play(), restart(), finish().
The new production useHeroMotion.js warms fonts under the preloader with a 600ms
limit, then runs the approved 1.64s opposing masked character reveals, SVG assembly,
architectural stroke construction, and supporting-text choreography. Interaction
attaches after entrance cleanup.
The previous V5 Hero hooks and ambient-signal files are removed.

On desktop fine pointers, a graded character-specific response redistributes
weights 500-800, adds up to 6px lift and restrained orange/ivory emphasis, and
returns smoothly. Width stays fixed. Separate artwork layers own pointer parallax
and small reversible native-scroll offsets. Individual plane/corner/grid fragments
respond subtly to the pointer, using transform owners separate from the entrance.
No continuous idle loop or scroll interception is added; coarse pointers retain
static type and native touch scrolling.

Initial/live reduced motion, skip, Escape, a hidden/leaving page, and BFCache
restoration reveal usable content promptly. Both controllers own bounded safety
deadlines and scoped cleanup. Scroll lock and inertness restore on exit. Focus
moves to main only when needed after leaving the skip control. StrictMode stays
enabled; its rehearsal cannot start duplicate playback. Mobile navigation pauses
Hero interaction without replaying its entrance on close. Leaving the viewport
detaches interaction listeners/tweens; re-entry resumes interaction only.

## Fonts and project guidance

The local Anybody WOFF2 and OFL remain intact. The former role-only subset is
retained for provenance but unused by Hero V2. Actual axes, fixed cells, and font
sources are documented in [font notes](src/assets/fonts/README.md).
Anton, Kode Mono, and Space Grotesk 400 retain the existing Google Fonts stylesheet
with preconnects and display=swap. Missing/late name fonts use readable, stable
Hero-local fallback. No font package or new font asset was added.

Read [AGENTS.md](AGENTS.md) for source ownership and contributor rules, and
[MOTION.md](MOTION.md) for sequencing, lifecycle, reduced motion, and future plans.
The kinetic artwork and matching preloader are implemented. Additional sections, motion,
ScrollTrigger, Lenis, and favicon integration remain outside the current scope.
Do not automatically commit, push, change branches, create pull requests, or publish.
