# Motion direction

The desktop character roll and geometric mobile toggle use CSS. Fullscreen mobile
navigation uses one reversible GSAP timeline: curtain, staggered links, then footer.
Closing reverses it at a modestly faster rate. The timeline, listeners, inert
states, scroll lock, and inline styles are cleaned up by the owning React hook.
Reduced motion settles immediately, including live preference changes.

## Hero entrance (V3 timing retained in V5)

The approved editorial composition has one scoped GSAP entrance timeline.
`src/hooks/useHeroEntrance.js` registers the bundled SplitText plugin; no other
motion dependency is required. The AJ branding and Navbar are separate owners.

| Phase / label | Start | Treatment |
| --- | --- | --- |
| `amal` | 0 s | Masked characters, 0.82 s each, 0.04 s stagger, power3.out |
| `jith` | 0.22 s | Same reveal, overlapping AMAL |
| `geometry` | 0.38 s | Existing paths draw over 0.6 s, 0.12 s stagger, power2.inOut; terminals follow |
| `identity` | 0.62 s | PYTHON rises through a mask over 0.65 s; upright developer. follows 0.18 s later with 10px movement and opacity |
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

## Hero V5 Anybody fluid typography

The visually approved Anybody shrink/grow study is now integrated into **AMAL
JITH.** only. Anton remains the general display face; role, description, CTA,
Navbar, and both SVG artworks retain their existing motion. The
comparison route, components, private hooks, optional Roboto Flex assets, and
obsolete Archivo font/license have been removed. Provenance and the preserved
OFL are in `src/assets/fonts/README.md` and `public/licenses/Anybody-OFL.txt`.
The license ships alongside the production font.

The actual bundled WOFF2 has `wght` 100?900 (default 100), and `wdth` 50?150
(default 100), verified from its OpenType `fvar` records. Production preserves
the final approved study values: **900 / 55 / 1 ? 300 / 68 / 0.95**
(weight / width / scale). This is a moderate thin state, with no hairlines.

`useFluidTypography.js` retains the approved flat proximity core and smoothstep
falloff. Horizontal reach is 0.9 times font size, bounded to 85?280px. The core
covers 60% of each cell's width and 84% of its height; a short vertical falloff
keeps the other stacked word bold during a centered interaction.

One GSAP ticker interpolates axes and scale with frame-rate-independent damping:
85ms approach and 150ms return constants, about **255ms / 450ms to 95%**, plus a
settling tail. There is no overshoot or per-input React state. The ticker stops
both at rest and when held targets settle. Cleanup restores original inline
styles. Inner `.hero__glyph` elements own axes and scale (origin 50% / 78%);
outer `.hero__char` elements exclusively own entrance transforms. Nine fixed
cells reserve maximum unscaled advances along the approved coupled axis path,
plus 0.025em. There is one semantic heading and no duplicated meaningful text.

Interaction attaches only after the actual local font and the entrance settle.
Waiting `autoPlay={false}` headings remain readable without input listeners.
`play()`, `restart()`, and `finish()` synchronously reset/detach interaction
before preparing or settling, and a scoped state observer reattaches afterward.
The existing 2.28-second entrance, masks, SplitText lines, timings, fallback
deadline, and fail-open behavior remain intact.

Actual mouse input drives proximity, including a mouse on hybrid devices.
Touch and pen require a press and follow only that pointer. Passive listeners
and `touch-action: pan-y pinch-zoom` preserve native scrolling/zoom without
pointer capture or preventDefault. Release/cancel returns smoothly; mouse
selection suppresses motion. Resize, blur, hidden tabs, and live reduced motion
restore glyphs immediately. Reduced motion removes input listeners and shows
the bold resting heading. StrictMode teardown releases listeners, observers,
ticker callbacks, and temporary styles.

Anybody uses one CSS face with accurate weight 100?900 and stretch 50?150%
descriptors, `font-display: swap`, and one hashed, non-inlined WOFF2 asset.
Readiness and entrance preparation share the browser font cache. The existing
800ms preparation deadline freezes an unavailable face to a Hero-local fallback
for that mount. A 0.55em fallback glyph fits the narrower fixed cells; the loaded
Anybody glyph uses 1em. Fixed slots prevent font-loading layout shifts. Interaction
never runs on fallback text.

The approved Anybody proportions use a 1.12 line height, mobile name size
`clamp(4rem, 40vw, 18rem)`, and desktop `clamp(5rem, 22vw, 20rem)`.
Desktop retains its name/SVG/name row; smaller screens retain stacked words.
The existing responsive ambient system reads the shared heading metrics without
changes to its artwork, positioning rules, or independent 12-second CSS loop.

Headless Edge validation covered all eight requested widths and short heights,
graded axes/scale, rapid pointer input, touch press/glide/end/cancel, native
scrolling/selection, initial/live reduced motion, mobile menu/Escape/focus return,
all entrance controls, failure recovery, font failure/late loading, and StrictMode
teardown. The entrance remains 2.28 seconds. No initial or interaction layout
shifts or horizontal overflow were recorded. Unscaled advances fit reserved
cells through 101 points on the coupled axis path. Full stroked ambient bounds
retain at least 24px divider clearance across 26 viewport combinations and all
loop phases. The built page downloads one local font and ships its unchanged OFL;
one independent 12-second ambient loop advances during typography interaction.
Shared Google Fonts were blocked for deterministic checks; actual local Anybody
rendering was verified. Physical-device performance and final visual approval
remain review limits. Temporary QA artifacts are under `node_modules/.cache/`;
no dependencies or package scripts were added.

The subsequent role refinement uses an additional local Anybody subset because
its name-only sibling cannot render PYTHON/developer. The role is upright:
PYTHON at weight 900 / width 75, developer. at weight 500 / width 90. The inner
secondary reveal target is now `.hero__role-detail`; its existing 10px movement,
0.65s duration, and 0.18s offset remain unchanged. Font preparation checks both
role weights and Space Grotesk 400, with the same bounded deadline and fallback
restoration. Instrument Serif preparation and loading are removed. Name-fluid
settings, central/ambient SVG motion, and desktop viewport spacing are unchanged.

### Hero supporting interactions

The description keeps its exact wording in Space Grotesk, with inline Kode Mono
technology accents. SplitText continues to reveal actual wrapped lines and restores
the nested semantic spans afterward; no hard-coded line breaks or copied text are
added. The existing entrance timeline and its 2.28-second duration are unchanged.

EXPLORE WORK is a thin outlined button with a separated arrow cell. A 9% cobalt
wash wipes across it, its inner text shifts 2px, and its arrow shifts 3px right/up
on hover and keyboard focus. CSS uses 240ms and cubic-bezier(0.22, 1, 0.36, 1).
The existing GSAP label/arrow wrappers retain entrance transforms; CSS targets
an extra inner label span and the existing inner arrow, preventing ownership
conflicts. The touch target stays at least 48px and the native focus ring remains.
The temporary coming-soon announcement is unchanged until real Work content exists.

After entrance settlement, only the decorative scroll arrow nudges 6px with a
subtle opacity dip: 1.8 seconds per cycle, two cycles (3.6 seconds), then rest.
The label stays stationary and the arrow is aria-hidden. This finite cue avoids
an additional continuous loop or a new control. Reduced motion removes the cue
and text/arrow transitions, including live changes; the button retains an instant
static wash on hover/focus. CSS animations/transitions require no new listeners
or tickers. The independent ambient signal is unchanged.

The remaining motion features below are future plans, requiring explicit requests.
ScrollTrigger, Lenis, custom cursors, preloaders, and additional sections are not
implemented. Hero V5 awaits final visual approval.

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
