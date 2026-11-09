# Motion direction

The desktop character roll and geometric mobile toggle use CSS. Fullscreen mobile
navigation uses one reversible GSAP timeline: curtain, staggered links, then footer.
Closing reverses it at a modestly faster rate. The timeline, listeners, inert
states, scroll lock, and inline styles are cleaned up by the owning React hook.
Reduced motion settles immediately, including live preference changes.

## Hero entrance (V3 timing retained in V4)

The approved editorial composition has one scoped GSAP entrance timeline.
`src/hooks/useHeroEntrance.js` registers the bundled SplitText plugin; no other
motion dependency is required. The AJ branding and Navbar are separate owners.

| Phase / label | Start | Treatment |
| --- | --- | --- |
| `amal` | 0 s | Masked characters, 0.82 s each, 0.04 s stagger, power3.out |
| `jith` | 0.22 s | Same reveal, overlapping AMAL |
| `geometry` | 0.38 s | Existing paths draw over 0.6 s, 0.12 s stagger, power2.inOut; terminals follow |
| `identity` | 0.62 s | PYTHON rises through a mask over 0.65 s; italic developer. follows 0.18 s later with 10px movement and opacity |
| `copy` | 0.96 s | Actual wrapped lines reveal over 0.58 s, with 0.12 s total stagger |
| `cta` | 1.30 s | Label, arrow wrapper, then underline; 0.45–0.55 s |
| `footer` | 1.66 s | Divider draws over 0.5 s; scroll label and static counter follow |

The complete entrance lasts 2.28 s. This feature's explicitly requested timing
takes precedence over the shorter starting ranges in the future plan below.
CTA CSS hover motion owns the inner arrow; entrance motion owns its outer wrapper.
The entrance does not lock scrolling or loop. There is no ScrollTrigger or
preloader; the independent ambient decoration below owns its own CSS motion.

First-paint preparation happens in a layout effect; autoplay begins in a passive
effect so StrictMode's effect rehearsal cannot start duplicate entrances. Font
readiness is bounded to 800ms. Missing faces use the existing fallback stacks,
frozen through Hero-local tokens until unmount to prevent late font swaps. This
can keep fallback typography for the current mount even if fonts load later.
All font overrides are restored on cleanup.

Persistent React cells supply name masks; SplitText measures responsive paragraph lines.
The paragraph uses `autoSplit` and returns its child tween to the parent timeline.
Paragraph split markup and transient styles revert on completion, leaving native text
flow. Width changes during playback settle immediately into native wrapping.
Reduced motion and focus within the Hero settle immediately too; turning reduced
motion off does not replay the entrance. A 3.6 s independent watchdog restores
readable content if setup or playback stalls. Default markup is always readable.

`Hero` accepts `autoPlay` (default true) and a React ref exposing `play()`,
`restart()`, and `finish()`. `play()` is idempotent; `restart()` explicitly rebuilds
one entrance. A future preloader can render `<Hero autoPlay={false} ref={heroRef} />`
and call `heroRef.current.play()` after finishing. Waiting for that call does not
hide the Hero. No preloader is implemented.

### References actually retrieved

- Animaxxing Skills: [split-entrances.md](https://github.com/johnpolacek/animaxxing-skills/blob/main/skills/animaxxing/references/recipes/split-entrances.md)
  and [SKILL.md](https://github.com/johnpolacek/animaxxing-skills/blob/main/skills/animaxxing/SKILL.md).
  Adapted scoped restoration, split text ownership, and settled reduced motion.
  These were research sources, not installed skills or copied components.
- TextCharacterAnimations: [js/index.js](https://github.com/codrops/TextCharacterAnimations/blob/main/js/index.js),
  [js/variations/telegram.js](https://github.com/codrops/TextCharacterAnimations/blob/main/js/variations/telegram.js),
  and [js/variations/swipe.js](https://github.com/codrops/TextCharacterAnimations/blob/main/js/variations/swipe.js).
  Studied character grouping, sequencing, reduced-motion final states, and decorative SVG semantics.
- Atelier North: [src/scripts/global.js](https://github.com/codrops/atelier-north/blob/main/src/scripts/global.js),
  [src/pages/index.astro](https://github.com/codrops/atelier-north/blob/main/src/pages/index.astro),
  [src/layouts/Layout.astro](https://github.com/codrops/atelier-north/blob/main/src/layouts/Layout.astro),
  and [src/styles/top.scss](https://github.com/codrops/atelier-north/blob/main/src/styles/top.scss).
  Studied clipped wrappers, staggered title motion, and editorial alignment;
  its random scale effect and scroll integrations were not adopted.
- Museum of Motion: [README.md](https://github.com/johnpolacek/museum-of-motion/blob/main/README.md)
  only. Source directory, Hero implementation, and motion brief requests failed;
  no museum implementation code was available to inspect or adapt.
- GSAP: current [SplitText documentation](https://gsap.com/docs/v3/Plugins/SplitText/),
  [context documentation](https://gsap.com/docs/v3/GSAP/gsap.context()/), and the installed
  `node_modules/gsap/SplitText.js` were checked for supported APIs and cleanup.

### Hero V3 validation

Oxlint and production build passed. Headless Microsoft Edge checks covered widths
320, 375, 390, 430, 768, 1024, 1280, and 1440px, plus short viewports. Checked
StrictMode single playback, stable masks, actual description lines and re-splitting,
accessible names during motion, CTA hover/focus, mobile navigation, live reduced
motion, explicit restart, late and stalled fonts, partial setup failure, the
watchdog, and cleanup during animation and pending font preparation. No layout
shifts were recorded during initial playback in this run. Google Fonts could not
be fetched in the test environment; actual web-font rendering and physical-device
performance remain visual-review checks. QA scripts and captures are temporary
artifacts, with no new test dependencies or package scripts.

## Hero ambient signal

`HeroAmbient.jsx` has two distinct responsive drawings: a wide horizontal network
on desktop/tablet and a simpler, tall vertical path on mobile. The desktop drawing
has two contours and a connected branch; mobile has one contour and a short branch.
A short signal follows the primary path in each drawing. Non-scaling strokes are
1.25px, up from 1px, with slightly clearer contours and small square terminals.
Both use the existing accent token without altering the approved central SVG.
The wrapper and SVGs are decorative, with `aria-hidden`, no focus stops, and no
pointer interception. The inactive responsive drawing uses `display: none`, so
only one CSS loop exists at a time.

One CSS animation shifts a normalized `12 88` dash pattern by exactly one period
over 12 seconds, with linear easing and infinite repetition. The endpoints match
at the loop boundary. No GSAP timeline or dependency is added. The entrance hook
is unchanged: CSS reads its existing `settled`/`reduced` states, and only enables
the ambient loop under `prefers-reduced-motion: no-preference`. It remains hidden
and paused while the entrance prepares or plays, including explicit restarts.

The latest ambient brief explicitly removes visible motion controls. The button,
control state, focus handlers, preference listener, and button styles are removed;
the decoration runs automatically. CSS media queries handle live reduced-motion
changes without a JavaScript preference listener. Reduced motion hides the entire
decoration and removes its CSS animation. Turning motion back on may resume the
ambient loop, while the entrance stays settled and focus stays in place.

IntersectionObserver and document visibility pause work offscreen and in hidden
tabs. Listeners and the observer are removed on unmount; the browser cancels the
element's CSS animation. React StrictMode does not create duplicate loops.

The desktop/tablet network occupies 82% of the safe identity-column width below
the role. Its height is bounded and responds to the viewport, with a shorter 72px
drawing in short landscape viewports. The mobile drawing has its own portrait
viewBox and vertical geometry, beside the last stacked name and role. Local
heading-size/leading/gap variables extend it through this blank area without
changing Hero metrics or reaching the copy/CTA. A container query hides the
decoration when text zoom leaves too little inline space.

Browser validation covered all eight requested widths, 320x480 and 1440x600 short
viewports, distinct responsive geometry, loop boundary equivalence, live reduced
motion, stable focus, offscreen suspension, simulated document-visibility changes,
mobile navigation, and StrictMode cleanup. Only one loop remained active across
breakpoint changes. No initial layout shifts were recorded. Existing Hero layout
measurements stayed unchanged; broad fallback fonts retained at least 12px of
mobile text clearance. Artwork dimensions ranged from 270x102px on tablet to
656x126px on desktop; mobile ranged from 48x184px to 70x226px. The original entrance
hook, Navbar, branding, tokens, and dependency files were unchanged.
Actual remote-font rendering and physical-device performance remain review limits.

## Hero V4 fluid typography

The approved Archivo comparison is now integrated into AMAL JITH. only. Anton
remains the general display face, including mobile navigation. The temporary
comparison route, comparison components, duplicate Anton subset, and the prior
magnetic-transform hook are removed. Font provenance and the preserved OFL are
in `src/assets/fonts/README.md` and `public/licenses/Archivo-OFL.txt`. The license
is copied into production output alongside the bundled font distribution.

The actual bundled WOFF2 has `wght` 100–900 (default 600), and `wdth` 62–125
(default 100), verified from its OpenType `fvar` records. Production keeps the
approved resting `900 / 62` and interactive `100 / 76` values unchanged.
`useFluidTypography.js` uses the approved flat thin core and smoothstep proximity
falloff. Horizontal reach is 1.05 times the font size, bounded to 90–280px; the
core covers 60% of each cell's width and 84% of its height. A short vertical
falloff keeps the other stacked word bold during a centered interaction.

One GSAP ticker callback interpolates only `font-variation-settings`. Damping
constants remain 65ms on approach and 120ms on return: approximately 195ms and
360ms to reach 95%, followed by a small settling tail. Axes do not overshoot.
The callback removes itself at rest; pointer events retain the latest point
without React state. There are no idle loops, typography transforms, or rotations.

Each React character has one fixed advance/mask, one entrance layer, and one
inner glyph. The entrance exclusively owns transforms on `.hero__char`; fluid
typography owns axes on `.hero__glyph`. Permanent masks replace name SplitText
rebuilding, preserving the same reveal duration, stagger, and timeline labels.
Paragraph line splitting remains unchanged. The heading is one semantic h1 with
the complete accessible name and no duplicated or hidden meaningful name text.

The interaction attaches only after both the actual local font and the entrance
are settled. There are no listeners on a waiting `autoPlay={false}` heading.
Entrance controls synchronously reset and detach interaction before preparation
or settling, and a scoped state observer reattaches afterward. This covers
`play()`, repeated/batched `restart()`, and `finish()` during active interaction,
without accumulating wrappers or competing transform owners.

Actual mouse input drives hover, including mouse events on hybrid devices with
a coarse primary pointer. Touch and pen require a press, then follow the active
pointer. Passive listeners and heading-local `touch-action: pan-y pinch-zoom`
retain vertical scrolling and zoom without capture or preventDefault. Pointer
release/cancellation returns smoothly. Mouse dragging or selection suppresses
interaction. Live reduced motion, resize, blur, and hidden tabs immediately
restore resting axes; reduced motion removes input listeners. Cleanup removes
all owned listeners, observers, ticker callbacks, and temporary variation styles.

The name-only WOFF2 is one CSS `@font-face` with `font-display: swap`, weight
100–900, and stretch 62–125%. Vite emits one hashed binary. CSS, readiness checks,
and entrance preparation share the browser font request. The entrance retains
its 800ms font deadline and mount-local fallback freeze; fallback text stays
static. Fixed cells and a 1.08 line height reserve the full approved axis path.
The desktop type size is adjusted to `clamp(5rem, 17vw, 15rem)` to accommodate
Archivo's wider cells while retaining the central SVG and the desktop single row.
Mobile name size and stacked composition remain, with clearance to the original
ambient drawing. The SVG paths and independent 12-second ambient loop are unchanged.

Headless Edge checks cover all eight requested widths and short viewports,
actual loaded local font/axes, intermediate rendered metrics, graded neighbors,
rapid pointer moves, touch press/glide/end/cancel, native vertical scrolling,
no idle ticker, one accessible heading, initial/repeated entrance controls,
live reduced motion, resize/focus interruption, CTA rerender, mobile menu/Escape,
StrictMode teardown, and missing-font fallback. No initial or interaction layout
shifts, character clipping, or horizontal overflow were observed. QA scripts and
captures remain temporary artifacts outside the repository. Physical-device
performance and visual approval remain review items; remote shared fonts were
blocked in deterministic checks, while the actual local Archivo was rendered.

The remaining motion features below are future plans, requiring explicit requests.
ScrollTrigger, Lenis, custom cursors, preloaders, and animated content sections
are not implemented.

## Intent

Motion should reinforce the Mixed Editorial identity: deliberate typography,
clear reading order, generous pauses, and occasional pixel-inspired punctuation.
Each effect must explain hierarchy, location, or an interaction. The explicitly
requested Hero signal is the only continuous ambient treatment. Avoid additional
ambient motion, scroll spectacle, excessive stagger, glow, and shadow effects.
Content and native interaction must work before enhancements initialize.

## Planned tools and ownership

- **GSAP:** scoped timelines, typography reveals, and landing transitions.
- **ScrollTrigger:** selective section reveals and section progress tracking.
- **Lenis:** optional smooth scrolling, only after native scrolling is complete
  and accessible. Coordinate one animation loop with GSAP rather than competing
  requestAnimationFrame loops. Preserve anchors and browser history.
- **CSS:** simple interaction feedback when a timeline is unnecessary. Avoid
  animating the same property through both CSS and GSAP.

Install tools only when their approved feature is being implemented. Verify
current official APIs at that time. Centralize integrations when there is real
reuse; do not add speculative providers or empty hooks now.

## Planned features

| Feature | Purpose and constraints |
| --- | --- |
| Typography reveals | Use short word or line reveals for selected headings. Retain one coherent accessible reading; hide decorative split copies from assistive technology. Keep text selectable. Recalculate splits after fonts and layout settle. |
| Section progress indicator | Reflect reading position without controlling scrolling. Keep a decorative meter out of the accessibility tree; if it becomes navigation, use labeled links and a clear current state. Avoid live announcements on each scroll update. |
| Page preloader | Only if loading a real critical asset warrants it. Never simulate progress or add a minimum delay. Time out safely, leave essential content available on failure, and avoid stealing focus. |
| Landing transitions | A brief coordinated entrance after required assets are ready. Keep readable content in the initial document; do not leave it hidden if initialization fails. |
| Selective pixel transitions | Use sparingly at meaningful boundaries. Keep decorative overlays noninteractive and hidden from assistive technology. Avoid flashing, full-page noise, and heavy DOM grids. |
| Custom smooth cursor | Optional decoration for a fine pointer with hover support. Preserve the native cursor, selection, and focus cues. The overlay must ignore pointer events, disappear on leaving the window, and be disabled for touch and reduced motion. |
| Fullscreen mobile navigation | Implement only with the Navbar milestone. Use a real toggle with `aria-expanded` and `aria-controls`. When open, contain focus, make background content inert, support Escape, restore focus on close, and restore prior scroll position and behavior on exit. |

## Timing and composition

Starting ranges for later evaluation, not runtime settings:

- Interaction feedback: roughly 120–180 ms.
- Heading and section entrances: roughly 350–700 ms.
- Stagger: roughly 30–60 ms, capped so long headings never delay reading.
- Landing sequence: aim to finish within 1,200 ms; never gate interaction on it.

Prefer restrained ease-out curves for entrances and direct feedback for controls.
Use transforms and opacity where suitable; avoid animating layout properties
such as height or top on each frame. Do not pin sections or replace normal
scroll behavior by default. Do not make scroll tracking lag behind the visitor
merely for an effect. Use `will-change` only while beneficial.

## Reduced motion and input modes

- Read `prefers-reduced-motion` before enabling motion and respond to changes
  during the session. Reduced motion must show the final readable state directly.
- Disable Lenis, cursor interpolation, typography reveals, pixel effects, and
  landing movement for reduced motion. Skip decorative preload sequences.
- Keep navigation immediate and functional without a transition. Never depend
  on animation completion to establish focus or accessibility state.
- On coarse pointers, omit custom cursors and hover-dependent behavior. Start
  with native touch scrolling; enable effects only after device testing.
- Never replace keyboard focus with cursor state or intercept standard scrolling
  keys. Preserve anchors, find-in-page, text selection, and zoom.

## React lifecycle and performance

- Scope animations to component refs. Use GSAP context/match-media cleanup as
  appropriate and make setup safe under React StrictMode's repeated mount checks.
- Revert scoped timelines and ScrollTriggers on cleanup. Remove listeners,
  observers, ticker callbacks, and owned animation frames; destroy owned Lenis
  instances and restore body styles or scroll locks.
- Avoid React state updates on every scroll or pointer event. Batch DOM reads
  and writes, and pause unnecessary work when the document is hidden.
- Refresh measurements after fonts, images, and breakpoint changes without
  rebuilding animations on every frame. Reserve media dimensions to reduce
  layout shifts. Check resize and orientation changes.
- Prefer small decorative surfaces to full-screen animated pixel grids. Content
  must stay available if a dependency or initialization step fails.

## Acceptance checks for the later milestone

Verify normal and reduced motion, live preference changes, keyboard navigation,
touch and mouse input, narrow screens, zoom, slow or failed asset loading, and
back/forward navigation. Check StrictMode cleanup, resizing, anchors, menu focus
restoration, absence of layout shifts, and responsiveness on a lower powered
mobile device. Run the project's lint and production build checks.

Record tested devices and any limits in the feature handoff. Do not introduce
motion merely because it appears in this plan.
