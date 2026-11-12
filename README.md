# AJ Portfolio

Amal Jith's editorial developer portfolio, built with React, Vite, Tailwind CSS v4,
and GSAP. The visually approved Hero V2 is now the production composition at /
with the existing Navbar, AJ monogram, and branded preloader. The new editorial
About section at #about is completed and approved. Phase 05 Expertise at
#expertise is implemented and awaiting visual review.

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
workHref="#work" to Hero to render the real anchor instead. About and Expertise
destinations are live. The remaining section IDs in
src/data/navigation.js remain reserved; mobile navigation safely closes without
scrolling or changing the hash when a destination is absent. Social links stay
hidden until real URLs are supplied. Experience, Work and Contact are not implemented.

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

## About: editorial spread and native scroll

About follows Hero in normal document flow, with a warm ivory surface and graphite
text. Upright Anton supplies BEYOND THE CODE., with CODE. in orange and a thin
graphite outline for definition against ivory; Space Grotesk
supplies the intro and main paragraph. Kode Mono supplies technical labels and
the single PYTHON DEVELOPER identity. There are no intern labels, invented
employment details, or statistics in About.

A short native CSS sticky track anchors the headline in the upper third on
desktops at least 1024px wide and 704px tall. It releases before the architectural
linework below it. There is no JS pinning, generated pin spacer, added scroll
runway, or scroll lock. Tablet/short screens remove sticky positioning; mobile
stacks the headline, introduction, portrait and copy, and omits the larger geometry.

useAboutMotion.js enables only after the preloader releases the page. It lazily
loads ScrollTrigger and SplitText from the existing GSAP package, keeping those
chunks out of the opening's critical path. Three desktop / two small-screen
section-owned scrub timelines choreograph a graphite-cover/ivory-sheet reveal,
headline line masks, portrait crop/orange corners, and geometric line construction.
Decorative effects
reverse with native scrolling. The geometry endpoint is clamped to the available
scroll range so its drawing completes while About is the last section.
No Lenis, smooth-scroll interception, or extra
animation package is added.

02 / ABOUT has a single short cursor-scramble entrance. The introduction has one
Proofread pass: rapid typing, two restrained corrections, then the exact final
statement. Fixed glyph slots prevent shifts; carets and incorrect decorative
glyphs are removed on completion. There is no continuous scrambling or additional
intro line entrance. These adapt the studied Codrops TextCharacterAnimations
principles; Telegram is reserved for the future Contact section. The layered
curtain adapts Interlude's cover/reveal principle without its router or WebGL.

The paragraph now uses a one-shot Swipe-inspired reveal instead of its former
line-rise animation. Thin orange keyboard-contour trails lead the words, which
commit in reading order over approximately 1.15s. The unchanged copy then stays
fully readable and selectable. Indexed FOCUS/TOOLS rows use architectural rules
and small orange markers, followed by a brief fixed-slot Overtype pass: labels
lead values by .22s. Neutral draft glyphs are overwritten, not randomly scrambled.
Both effects clean up their decorative layers and never replay on scrolling back.

Paragraph entry at top 84% waits for the introduction when scrolling slowly;
fast/deep entry settles the intro to prevent delayed reading. Metadata at top
88% waits until the paragraph completes and its own block enters the viewport.
This keeps the mobile metadata from animating unseen below the portrait/copy.

All markup is readable by default. Initial/live reduced motion, keyboard focus,
or failed enhancement show unmasked content; a focused About section uses normal
flow. The real About Navbar anchor and mobile destination work without changing
the existing navigation components. Initial #about loads deferred by the opening
are honored after unlock; restored browser positions are preserved. Main/page
inertness and hidden tabs remove the section's motion contexts. Cleanup releases
only owned triggers, tweens, media/listeners, observers, and pending refresh frame.
ResizeObserver plus font/image readiness refresh only this section's measurements.
Width/font changes re-split pending text; already-started text treatments settle
to their final form and never replay
on resize or scrolling back. Text selection also restores the original unsplit
content. Reduced motion disables all these effects, including live changes.

### Replacing the portrait

No portrait is fetched or generated. The current neutral frame explicitly marks
the photograph as forthcoming. In AboutSection.jsx, replace the existing call:

```jsx
<AboutPortrait
  src="/images/amal-jith.webp"
  alt="Amal Jith"
  objectPosition="50% 35%"
/>
```

Use that URL only after supplying the real file. The 3:4 frame reserves layout
space; object-fit: cover and objectPosition control the crop without redesign.
Images load lazily with async decoding. A failed source restores the same neutral
placeholder and dimensions. The existing font assets/licenses remain untouched.

### About verification

Oxlint and the production build pass. Headless Edge checks cover widths 320,
360, 390, 768, 1280, and 1440px, including short viewports, native touch scrolling,
desktop/mobile About navigation, live reduced motion, reversible reveals, and
the short sticky track. Repeated StrictMode mounts and visibility changes leave
no extra section-owned triggers, tweens, listeners, observers, or animation frames;
an unrelated ScrollTrigger remains intact. Interrupted proofreading also removes
its shared caret, split wrappers and accessible-label overrides. All text effects
settle to the exact supplied copy and do not restart on scrolling back. Missing
fonts, a blocked animation
module, and a failed SVG setup leave readable static content. Portrait replacement
and failed-image recovery preserve the same frame dimensions.

These are emulated browser checks, not physical iOS/Safari coverage. The actual
portrait remains pending; the About implementation is approved.
The content upgrade was visually checked through desktop/mobile frame captures:
the Swipe commitment took 1.11–1.14s, Overtype visibly progressed label-before-value,
and the paragraph's dimensions remained stable. The upstream live demo could not
load in the browser; the actual Swipe/Overtype source and demo markup were studied.

## Expertise: five featured tools, seventeen supporting tools

The graphite #expertise section follows About. An oversized Anton heading and
five-tool showcase contrast with About's ivory spread. On measured desktops at
least 1024px wide/560px tall when content fits, native CSS sticky anchors a stage 24px from
the top. Its finite scroll track adds 896–1408px; one scoped ScrollTrigger chooses
Python → Django → FastAPI → React → PostgreSQL in either scroll direction.
The stage releases into a compact categorized documentation index.

All 22 approved tools are present across six groups, including Featured:

- Featured: Python, Django, FastAPI, React, PostgreSQL.
- Backend: Django REST Framework.
- Deployment Platforms: Vercel, Render.
- Frontend: JavaScript, TypeScript, HTML5, CSS3, Tailwind CSS, Motion (Framer Motion).
- Development tools: Docker, Git, GitHub, Visual Studio Code, Vite, Postman.
- AI Development Tools: OpenAI Codex, Claude Code.

Each featured icon has its own finite accent/mask treatment; its brand paths
remain unchanged. Name transitions use matching-character emphasis inspired by
Codrops Find All, distinct from About's text effects. Supporting rows are real
documentation links with restrained glyph, icon and divider interactions on
hover and keyboard focus. Motion is a displayed skill; no Motion dependency
was installed.

Mobile/tablet, unsafe or very short screens, reduced motion and failed
enhancement show the complete normal-flow list. Native scrolling and anchor/menu
focus behavior remain intact. Live preference changes preserve the article being
read. The preloader gates section enhancement; no opening or Hero logic changes.
Expertise owns and cleans up its contexts/triggers/listeners/observers/RAF without
altering About's controllers. No JS pin spacer, Lenis, scroll lock or idle loop is
added.

The original 18 SVGs use a pinned Devicon revision; Vercel and Render use official
white brand assets. Backend and Deployment Platforms share the compact left
column with AI Development Tools below, and Frontend and Development Tools
alongside on desktop. Tablet uses two columns, with the AI pair on a final row;
mobile follows the category reading order in one column. The Codex and Claude
Code marks use pinned Lobe Icons / Simple Icons sources and separate notices.
See the [icon notes](public/icons/technologies/README.md),
[source manifest](public/icons/technologies/sources.json) and bundled
[MIT notice](public/icons/technologies/LICENSE-Devicon.txt). Monochrome marks use
ivory fills for contrast; the core brand geometry is preserved. Python's
decorative ground shadow is removed. Native gradients inside source brand artwork
are retained; the section adds no gradients, shadows or filters.

Expertise awaits visual approval. Experience, Work and Contact remain outside
this phase.

Expertise verification used headless Edge at 320, 360, 390, 768, 1024, 1280 and
1440px widths, including 600px-high desktop and 640px-high mobile viewports.
Checks covered forward/reverse activation, all 22 icons, keyboard and touch input,
live reduced-motion changes, rapid transitions, breakpoint rebuilding, StrictMode
cleanup and failed enhancement. The production bundle passed refresh/preloader
handoff and direct-anchor checks without duplicate Hero entrances or horizontal
overflow. Oxlint and the production build pass. Physical iOS/Safari and other
browser engines remain unverified.

The featured stage has one visibility owner. It switches all panel opacities,
pointer states and the numeric counter together; only the selected panel's
characters and decorative icon layers animate. This removes the former panel
crossfade that exposed two technologies during scroll reversals. Refresh
reconciles selection without replaying an unchanged entrance, and teardown
disables activation before reverting scoped animations. No arbitrary panel hiding or additional scroll controller is used. Short desktop
windows now retain the measured stage from 560px height when content fits; below
704px, only secondary artwork and excess spacing are compacted. Direct anchors
and late plugin loading no longer permanently disable a suitable desktop stage.
Tablet/mobile, reduced motion, failed enhancement and unsafe fits remain readable
in normal flow; mode changes preserve the current article.

## AJ Signal Cursor

The cursor uses a 12px filled Electric Orange square with an exact centered
hotspot. Real interactions show the earlier compact OPEN/VISIT/VIEW/EXPLORE labels:
11px Kode Mono, flat graphite backing, small cut corners and finite character
reveals. The targeting reticle, brackets, connector and TARGET ACTIVE line are
removed. All visible cursor marks remain orange on dark and ivory surfaces.

The Canvas trail adapts to speed: slow motion creates sparse tiny pixels with
quick decay; faster movement adds slightly larger squares and a fuller short
trail. Sizes span 2.5-6.5px and travel decay 240-560ms, with restrained drift,
rotation and shrink. A slower fade and 620px distance cap preserve a longer visible
tail. Distance-based emission uses smoothed velocity and a 36-particle pool, capped
at ten over About and twelve in slow-frame mode.
Labels suppress emissions; clicks give a small throttled burst and centered
215ms contraction/return. DPR caps at two, with one RAF and no idle loop or
React updates per frame.

Future real controls can use `data-cursor="view" data-cursor-label="VIEW PROJECT"`.
`minimal` removes the readout; `native` opts out. `explore`, `open`, `visit` and
`drag` are also supported, with drag limited to actual draggable/slider controls.
Unavailable destinations never gain a false action label.

Touch, reduced motion, text editing, selection, keyboard use, pointer capture,
blur and viewport exit retain native behavior. Setup/runtime failure also restores
the native cursor. StrictMode cleanup owns listeners, timelines, frames and Canvas
resources. No section animation or ScrollTrigger is controlled by the cursor.
Existing GSAP is reused; no dependency was added.

## Fonts and project guidance

The local Anybody WOFF2 and OFL remain intact. The former role-only subset is
retained for provenance but unused by Hero V2. Actual axes, fixed cells, and font
sources are documented in [font notes](src/assets/fonts/README.md).
Anton, Kode Mono, and Space Grotesk 400 retain the existing Google Fonts stylesheet
with preconnects and display=swap. Missing/late name fonts use readable, stable
Hero-local fallback. No font package or new font asset was added.

Read [AGENTS.md](AGENTS.md) for source ownership and contributor rules, and
[MOTION.md](MOTION.md) for sequencing, lifecycle, reduced motion, and future plans.
The Hero, About and preloader remain approved. Expertise awaits visual approval
before further refinement or expansion. Later sections, Lenis, horizontal Projects
scrolling, and favicon integration remain outside the current scope.
Do not automatically commit, push, change branches, create pull requests, or publish.
