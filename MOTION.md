# Motion direction

The desktop character roll and geometric mobile toggle use CSS. Fullscreen mobile
navigation uses one reversible GSAP timeline: curtain, staggered links, then footer.
Closing reverses it at a modestly faster rate. The timeline, listeners, inert
states, scroll lock, and inline styles are cleaned up by the owning React hook.
Reduced motion settles immediately, including live preference changes.

## Graphite / orange branded opening

Every full page load mounts Preloader.jsx once alongside the real page. No storage
flag, fake network percentage, hash listener, or scroll-triggered replay is used.
The actual AJLogo paths are unchanged. The opening uses graphite, orange, and
ivory tokens locally; the old cream/cobalt opening is replaced.
The document canvas also uses the graphite token before React mounts.

One scoped usePreloader.js GSAP timeline lasts **2.64 seconds**:

| Phase | Start | Treatment |
| --- | --- | --- |
| draw | 0s | Four architectural construction paths draw over .38s with .045s stagger |
| monogram | .12s | Existing AJ outlines draw over .78s with .085s stagger |
| resolve | .80s | Orange fill resolves over .28s; technical rule finishes by 1.05s |
| hold | 1.08s | Completed logo holds for 200ms; the rule settles over .16s |
| curtain | 1.28s | Orange stepped field rises over .58s, power3.inOut; scene fades/lifts 12px |
| exit | 1.86s | Base becomes transparent only after full orange coverage; curtain exits over .78s, sine.inOut |

The curtain is one oversized CSS surface with a static three-step polygon and
1px coverage bleed. Its only animated shape property is yPercent; the clip-path
does not animate. Additional height above/below the viewport makes both shallow
edges cover every corner at yPercent=0. The widest right step is the last edge
to clear. Cached panel height/offset plus 2px rounding clearance determine when
it has passed [data-hero-heading]. At that point Hero.play() runs once. No Hero
animation is duplicated inside the preloader. Completion has a guarded handoff
fallback. The page remains inert/scroll-locked until the orange panel exits.

The logo is centered without scaling its camera or changing its geometry. Its
160-288px width is capped at 40svh on short screens. The construction frame stays
around the logo; small ivory technical metadata and a thin rule are separate.
There are no images, filters, gradients, extra plugins, or continuous loops.
Short viewports omit secondary labels. The skip button keeps a graphite backing
and an inset ivory keyboard-focus mark during the orange pass.

The original lifecycle remains: cancellable StrictMode startup, owned GSAP
context, scroll/inert/style restoration, Escape/skip, live reduced motion,
visibility/pagehide/pageshow handling, focus restoration, and a 4.2s independent
fail-open deadline. Initial/live reduced motion and skip reveal usable static
content promptly, without awaiting fonts. No focus trap or automatic focus grab
is introduced. Cleanup removes the overlay and its listeners/styles; fonts and
SVG measurements cannot leave the app permanently hidden.

## Approved Hero V2: production motion

The former development experiment is now the production Hero. There is no preview
route, comparison toolbar, preview entry, or separate experimental font bundle.
Hero.jsx/Hero.css and HeroArtwork.jsx render the approved composition;
useHeroMotion.js owns its motion. The superseded V5 entrance, fluid typography,
and ambient signal implementation are removed.

### Controlled handoff and preparation

Hero accepts autoPlay (default true), workHref (default null), and a React ref
exposing play(), restart(), and finish(). App supplies autoPlay=false. play() is
idempotent; restart() explicitly builds a new entrance; finish() restores readable
content immediately. The preloader owns its cover, page inertness, scroll
lock, and 4.2s safety deadline. The current orange stepped panel uses
[data-hero-heading] for the handoff and [data-hero] for the temporary cover. Each
full refresh shows the preloader; hashes do not replay it.

Font preparation begins in a cancellable passive-effect microtask while waiting
under the preloader, without starting the entrance. It loads the existing local
Anybody face at weights 500 and 800, with a 600ms maximum wait. Failure or a late
face freezes readable Arial fallback for that mount. play() synchronously enters
the masked preparation state before the cover is released. Once preparation is
ready, the scoped GSAP timeline plays. The actual heading top supplies handoff
geometry. No arbitrary additional landing delay is introduced.

### Entrance choreography

| Target | Start | Treatment |
| --- | --- | --- |
| AMAL | 0.12s | Characters rise from 112%, 0.85s, 0.045s stagger, expo.out |
| JITH. | 0.38s | Characters descend from -112%, 0.9s, 0.045s stagger, expo.out |
| Collage plane | 0.05s | Assemble from x=-48, opacity 0, 0.75s |
| Collage cut | 0.30s | Assemble from x=36/y=-20, opacity 0, 0.7s |
| Collage bridge | 0.48s | Assemble from x=-24/y=24, opacity 0, 0.75s |
| Artwork construction lines | 0.18s | Stroke-dash drawing, 0.8s, 0.025s stagger |
| Supporting UI | 0.72s | x=14/opacity 0, 0.6s, 0.08s stagger |

Total: 1.64s. Approved typography/supporting timings remain unchanged; new artwork
line construction fits inside that existing choreography. Completion reverts
entrance styles before attaching interaction. A separate 3.5s deadline after play()
fails open if setup/playback stalls. Waiting for external playback never starts
that deadline or a competing animation. Initial/live reduced motion, focus inside
the Hero, hidden tabs, or a width change during playback settle immediately.
Turning reduced motion off does not replay the entrance.

### Interaction ownership

The existing name WOFF2 supports wght 100-900 and wdth 50-150. AMAL rests at 500/125;
nearby letters become 800/125. JITH. rests at 800/110 and responds toward 500/110.
There is no scaling or width animation. Stable cells cover measured maximum
advances across 21 weights, plus .008em. Proximity uses character-specific smooth
falloff; distant characters remain unchanged. Inner glyphs interpolate weight,
ivory/orange color, and at most 6px lift. GSAP quickTo response is 320ms, with a
520ms return. Text selection and keyboard interaction remain native.

The existing collage now has a broader 680x280 desktop canvas: a larger orange
cut plane and original AJ-like negative space extend into a broken architectural
line composition. A separate 440x280 mobile SVG omits the extended grid and extra
registration detail. Both remain decorative and secondary to the name.

A separate artwork layer receives at most 5px x/3px y pointer movement. Plane,
corner, and grid parents respond independently by up to 3px with .6s interpolation;
inner entrance groups retain their own transforms. The whole artwork shifts up
to 14px with native scroll, while a different grid layer moves 8px x/-4px y.
The footer rule grows from .35 to 1. Scrolling upward reverses these accents. A
passive listener schedules one RAF for each update batch. No custom ticker,
ScrollTrigger, smooth-scroll interception, or continuous idle loop is added.
Coarse pointers have no typography/parallax pointer listeners. Mobile scroll
continues to drive the restrained artwork accent without cancelling touch events.

Page inertness during the preloader allows the controlled entrance but prevents
interactive motion. Main inertness from mobile navigation settles any entrance
and detaches interactions. Closing the menu restores interaction eligibility,
without replay. An IntersectionObserver detaches all interaction tweens and
pointer/scroll listeners while Hero is outside the viewport; re-entry only
reattaches interaction, never the entrance. Hidden tabs also settle/detach;
visibility resumes eligible interaction only. Live reduced-motion changes reset
glyphs and decorative layers.

### Viewport and cleanup

Desktop minimum height is calc(100svh - var(--navbar-height)), with a 100vh fallback;
Navbar is 84px at the default root size. Height is never fixed. Padding is 16-24px,
row gaps 14-20px, CTA gap 12px, footer padding 12px, and the old 128px lab-toolbar
allowance is removed. Width-driven oversized type is capped against the remaining
viewport budget. Below 672px desktop height, that cap is removed so full-sized
content scrolls naturally. Mobile also uses natural height and its approved
separate stacking/relative type sizes. Artwork bounds reserve its caption and
full pointer/scroll/fragment excursion beneath AMAL. The wider artwork uses the
existing lower-left whitespace and is capped against the JITH. slot width,
retaining 32px horizontal clearance before interactive displacement.

Each mount owns its GSAP contexts, timers, pending font wait, media/event listeners,
inert/intersection observers, and RAF. Cleanup invalidates pending work, reverts
both contexts, restores styles, and removes listeners. StrictMode cannot start
duplicate playback because startup uses a cancellable microtask. No font, heading, or
artwork animation is duplicated in the preloader or Navbar.

## About: immersive editorial scroll

About is a new normal-flow section after the unchanged Hero. App passes
motionEnabled={!opening}, so About neither registers triggers nor imports
ScrollTrigger or SplitText while the preloader owns scrolling. Both ship with the
existing GSAP dependency and are imported lazily only when enhancement is eligible;
there is no new package. Initial reduced-motion or direct focused #about visits
use static content without requesting either plugin.

The ivory surface and all text/portrait content are visible in default markup.
Only a successfully created scoped context applies masks. Import/setup failure
reverts to readable static content. No preloader, Hero, Navbar, or global motion
configuration is changed.

### Choreography and ownership

- Section entrance: from top 95% to top 20% on tall desktops / top 40% otherwise,
  with .25s scrub smoothing. An ivory sheet lifts 96px / 56px under a graphite
  cover that retracts upward with a thin orange edge. The cover occupies only
  the opening part of About; no overlay or transform targets Hero. Headline
  lines rise 110% through masks with .08 stagger and power3.out after the cover
  starts clearing. BEYOND THE stays graphite; CODE. uses the orange token with
  a 1px graphite outline. Orange/ivory alone measures 2.66:1; the dark edge adds
  definition while retaining the requested orange fill and existing palette.
- Label: top 70% triggers one 480ms cursor/guess pass on 02 / ABOUT. It settles
  exactly to the original label and removes the decorative caret/guesses.
- Intro: top 78% triggers one roughly 1.9s Proofread sequence, replacing the old
  intro line reveal. Characters type in reading order at 17ms intervals; two
  predictable neighbouring-key slips are corrected through small vertical masks
  and briefly accented. The correct glyph reserves each slot throughout. There
  is no reflow, random rewrite of the headline, or idle scramble. Scrolling back
  does not replay these one-shot text treatments; interrupted playback settles
  to the final text on a rebuild. Telegram is studied but reserved for Contact.
- Main paragraph: one Swipe-inspired reveal replaces the previous scrubbed line
  rise. Top 84% arms a paused ~1.15s timeline. SplitText supplies responsive words
  and characters; each measured SVG trail follows a restrained keyboard-row contour.
  Characters become faint as the trail passes, then commit at full strength in
  reading order. There is no random substitution, paragraph displacement, or
  continuous loop. The decorative SVG is removed on completion.
- Metadata: top 88% makes the FOCUS/TOOLS block eligible, but playback waits for
  paragraph completion. One ~1.26s Overtype pass replaces the former fade-up:
  each label leads its value by .22s; the two rows start .4s apart. Fixed slots
  hold dim neutral draft glyphs while correct letters strike down by .08em and
  the old glyphs fall only 3px. The underscore cursors and drafts are removed at
  completion. No rotation, repeated blinking, or random character loop is used.
- Choreography: on slow entry, Swipe waits for the current Proofread to finish.
  If the reader moves the paragraph above 55% of the viewport or crosses its
  trigger faster than 1200px/s, the intro settles immediately and Swipe starts.
  Already-passed paragraphs settle directly. This prevents a queue behind a fast
  scroll. Metadata only plays once it is eligible, so mobile rows below the fold
  do not finish unseen. Started text treatments never replay on upward scrolling.
- Portrait: its own trigger progresses from top 92% to top 52%, with .3s scrub.
  A rectangular inset crop opens from 100% at the bottom to zero, while the
  inner image/placeholder settles 6% vertically. Thin orange architectural corners
  draw during the reveal. The 3:4 frame never changes size.
- Geometry: on desktop only, a third .35s scrub trigger draws three architectural
  paths. Its bottom-35% endpoint is clamped to the available page scroll, so the
  drawing finishes even while About is the final section. It shifts a separate
  grid layer from -10/+6 to +8/-6, slides the orange mark by 12 units, offsets one
  segment by 8 units, and gently expands/lifts the small square fragment. The SVG
  has reserved space and remains decorative.

Scrolling upward reverses the scrubbed visual layers; text transformations settle
once. Focus, selection and reduced motion always reveal the main paragraph and
metadata directly. CSS sticky, not ScrollTrigger pin, holds the
headline on viewports at least 64rem wide and 44rem high. Its 26rem track and
upper-third offset give a deliberately short hold (about 161px at 1440x900),
then release before the geometry. It adds no generated spacer, scroll runway,
scroll trap, or fixed-position content. Short/tablet/mobile viewports, reduced
motion, and focus within the section use normal flow instead.

### Accessibility, lifecycle and future sections

Initial/live reduced motion reverts every mask/transform and removes owned
triggers. Keyboard focus settles the section for the mount, so anchor navigation
never leaves reading content clipped. #about is the existing navigation ID;
the mobile menu keeps its current close/unlock/focus sequence. An explicit initial
#about still at the top after the opening is honored once; browser-restored
positions are not reset. No smooth-scroll interception or arbitrary scroll jump
is introduced.

Each context owns three desktop or two small-screen scrub ScrollTriggers, plus
up to four one-shot text triggers which remove themselves after entry. Breakpoints,
inert main/page state, and tab visibility revert/rebuild only that context.
No killAll or global plugin configuration is used. Cleanup reverts timelines and
triggers, restores styles/state, disconnects ResizeObserver/MutationObserver, and
removes font, load, hash, media, focus, and visibility listeners. Font readiness
and image loads queue one bounded refresh RAF for this section; layout changes
also refresh through ResizeObserver. There is no custom permanent ticker/RAF loop.
Pending imports/font promises check disposal before touching DOM. SplitText restores
original HTML and accessible labels on cleanup; separately owned decorative
carets and SVG trails are removed even when playback is interrupted. Width/font
changes re-measure pending text; already-started text restores its final readable
form without replaying. Selection, like keyboard
focus, settles the section to unsplit, selectable text. StrictMode rehearsal cannot
retain an extra context. Future sections' triggers are preserved.

Reference source inspected: Interlude's [curtain.ts](https://github.com/codrops/interlude/blob/main/src/transitions/curtain.ts)
and TextCharacterAnimations' [cursorScramble.js](https://github.com/codrops/TextCharacterAnimations/blob/main/js/variations/cursorScramble.js),
[proofread.js](https://github.com/codrops/TextCharacterAnimations/blob/main/js/variations/proofread.js),
and [telegram.js](https://github.com/codrops/TextCharacterAnimations/blob/main/js/variations/telegram.js).
The content upgrade also inspects [swipe.js](https://github.com/codrops/TextCharacterAnimations/blob/main/js/variations/swipe.js)
and [overtype.js](https://github.com/codrops/TextCharacterAnimations/blob/main/js/variations/overtype.js).
Cover/reveal, cursor-led guesses, typo correction, keyboard-path word commitment,
and overwrite principles are adapted into section-local React logic. Direct
browser access to the upstream demo failed in this environment; source and demo
markup were retrieved, and the local adaptations were verified through browser
frame captures. No routing, ScrollSmoother, Flip, WebGL,
or demo assets are added.

The neutral portrait placeholder is deliberately not a person. AboutPortrait
accepts src, meaningful alt text, and objectPosition; a real supplied image fits
the reserved frame without a layout redesign. Failed image loading falls back
to the same accessible neutral composition. No photo or face asset is invented.

About awaits visual approval; the following features remain future plans.

## Intent

Motion should reinforce the Mixed Editorial identity: deliberate typography,
clear reading order, generous pauses, and occasional pixel-inspired punctuation.
Each effect must explain hierarchy, location, or an interaction. The Hero has no continuous idle animation. Avoid additional
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
| Page preloader | The explicitly requested branded opening above is implemented. It depicts its own sequence, never network progress. Further asset-loading gates require a separate request; preserve skip, timeout, reduced motion, and focus behavior. |
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
