# Motion direction

The desktop character roll and geometric mobile toggle use CSS. Fullscreen mobile
navigation uses one reversible GSAP timeline: curtain, staggered links, then footer.
Closing reverses it at a modestly faster rate. The timeline, listeners, inert
states, scroll lock, and inline styles are cleaned up by the owning React hook.
Reduced motion settles immediately, including live preference changes.

The remaining motion features below are future plans, requiring explicit requests.
ScrollTrigger, Lenis, custom cursors, preloaders, and animated content sections
are not implemented.

## Intent

Motion should reinforce the Mixed Editorial identity: deliberate typography,
clear reading order, generous pauses, and occasional pixel-inspired punctuation.
Each effect must explain hierarchy, location, or an interaction. Avoid constant
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
