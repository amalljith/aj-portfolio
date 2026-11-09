# AJ Portfolio

A minimal editorial developer portfolio for Amal Jith, Python Developer.

The current milestone includes the foundation, desktop Navbar, approved AJ
monogram, and fullscreen mobile navigation. The rest of the page is a static
placeholder; Hero and content sections are awaiting explicit implementation
instructions. Favicon integration is pending.

## Development

The existing stack is React, JavaScript/JSX, Vite, Tailwind CSS v4 through its
Vite plugin, and Oxlint. GSAP owns the mobile menu's reversible curtain timeline;
the character roll and geometric toggle remain CSS animations.

The five section anchors are reserved for future sections. The mobile menu closes
without changing the hash or scrolling when a target is absent. GitHub and
LinkedIn are hidden until real profile URLs are supplied in `src/data/navigation.js`.

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
`py-section`, `max-w-content`, `font-display`, `font-mono`, `font-editorial`, and
`font-body`.

Anton is the display face; Kode Mono is for navigation and technical labels;
Instrument Serif is for selective accents; Space Grotesk is for body copy.
`index.html` declares all four through a single Google Fonts CSS request with
preconnects and `display=swap`, following the
[Google Fonts CSS API guidance](https://developers.google.com/fonts/docs/css2).
Only regular 400 styles are requested; extend the request when another style is
actually used. Browsers fetch font files as needed for rendered text, so the
unused editorial face is available without preloading its binary.

Fonts require access to Google's font service. Local fallback stacks keep the
page usable offline; fonts are not self-hosted or bundled. No font package was
added.

## Project guidance

- Read [AGENTS.md](AGENTS.md) for architecture, visual identity, scope, and
  contributor rules.
- Read [MOTION.md](MOTION.md) for future motion direction, accessibility,
  lifecycle cleanup, and acceptance checks. It authorizes no implementation.

Keep work local for this milestone. Do not automatically commit, push, change
branches, create pull requests, or publish.
