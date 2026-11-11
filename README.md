# AJ Portfolio

A minimal editorial developer portfolio for Amal Jith, Python Developer.

The current milestone includes the foundation, desktop Navbar, approved AJ
monogram, fullscreen mobile navigation, and responsive Hero V5. The Hero has one
coordinated entrance for its typography, geometric SVG, CTA, and editorial footer.
After the entrance settles, a quiet SVG signal loops through the available Hero
whitespace: a wide horizontal network on desktop and a separate, taller vertical
path on mobile. There are no visible ambient controls. Reduced motion hides the
decoration, and work pauses offscreen or in hidden tabs. The loop uses CSS
independently of the existing entrance timeline.
After the entrance settles, the oversized name uses the approved local Anybody
variable font: mouse proximity or touch/pen press-and-glide makes nearby letters
moderately thinner and smaller, with graded neighbors and a smooth return.
The approved range is 900/55/1 to 300/68/0.95 (weight/width/scale), with about
255ms response and 450ms return to 95%, followed by a settling tail. Fixed character
cells keep the layout stable. Reduced motion leaves the name static.
Other content sections and additional motion await explicit implementation
instructions and visual approval. Favicon integration is pending.

The approved Anybody comparison is integrated into production. The temporary
comparison route, components, hooks, Roboto Flex assets, and obsolete Archivo
assets have been removed. Font provenance, actual axis ranges, and licensing
are documented in [font documentation](src/assets/fonts/README.md).

## Development

The existing stack is React, JavaScript/JSX, Vite, Tailwind CSS v4 through its
Vite plugin, and Oxlint. GSAP owns the mobile menu's reversible curtain timeline
and the Hero entrance. Persistent character masks keep React ownership of the
name, while the bundled SplitText plugin measures actual paragraph lines.
The character roll and geometric toggle remain CSS.

The five section anchors are reserved for future sections. The mobile menu closes
without changing the hash or scrolling when a target is absent. GitHub and
LinkedIn are hidden until real profile URLs are supplied in `src/data/navigation.js`.
The Hero's Explore Work button displays an accessible coming-soon notice until
the real Work section is implemented. Its scroll label and section counter are
static design elements, with no simulated destination or progress tracking.

```sh
npm install
npm run dev
npm run lint
npm run build
npm run preview
```

Install only when dependencies are missing or dependency inputs change. The
preview command serves production output after a build. On Windows, use
`npm.cmd` if PowerShell blocks `npm.ps1`. There is currently no test script.

## Design system

`src/index.css` is the source of truth for provisional colors, typography, fluid
spacing, content width, and base accessibility styles. Palette tokens live under
`@theme static` so unused palette tokens remain available in production;
semantic roles live under `:root`. The `@theme inline` aliases expose
utilities that respect role overrides on future sections.

Examples: `bg-surface`, `text-ink`, `text-accent`, `border-rule`, `px-gutter`,
`py-section`, `max-w-content`, `font-display`, `font-mono`, and
`font-body`.

Anton remains the general display face. The Hero name and role use local Anybody
subsets; Kode Mono is for navigation and technical labels, and Space Grotesk is
for readable copy. PYTHON is bold/condensed (weight 900, width 75); developer. is
upright and medium (weight 500, width 90). The description uses Space Grotesk 400
at 18-21px, line height 1.6, and a 32ch measure, with tighter tracking and
Kode Mono/cobalt technology accents. Instrument Serif is no longer
used and has been removed from font loading and tokens.

`index.html` declares Anton, Kode Mono, and Space Grotesk 400 through one Google
Fonts request with preconnects and `display=swap`. These shared fonts require
Google's service. The original 2,872-byte Anybody name subset is preserved, and a
5,876-byte role-only subset supplies the previously missing role glyphs. Both
local variable faces share the existing OFL and use `font-display: swap`.
No font package was added. Fallback stacks keep the page usable offline.
Hero font preparation waits at most 800ms, then freezes any unavailable
face to its existing fallback for that mount, preventing a late font swap during
or after the entrance. The rest of the site keeps its usual font loading.

The Hero plays once by default. For a future preloader, pass `autoPlay={false}`
and a React ref, then call `ref.current.play()` when ready. `play()` is idempotent;
`restart()` requests a fresh entrance and `finish()` settles immediately. Waiting
for an external trigger leaves content readable. Reduced motion, keyboard focus,
resizing, failed setup, and unmount all restore native text and temporary styles.
See `MOTION.md` for phase timing and the exact research sources inspected.

## Project guidance

- Read [AGENTS.md](AGENTS.md) for architecture, visual identity, scope, and
  contributor rules.
- Read [MOTION.md](MOTION.md) for future motion direction, accessibility,
  lifecycle cleanup, and acceptance checks. It authorizes no implementation.

Keep work local for this milestone. Do not automatically commit, push, change
branches, create pull requests, or publish.
