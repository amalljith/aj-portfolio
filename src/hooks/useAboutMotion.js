import { useLayoutEffect } from "react";
import { gsap } from "gsap";
import { cursorLabel, proofreadIntro, swipeParagraph, overtypeMetadata } from "./aboutTextMotion.js";

// The title uses native CSS sticky. These section-owned triggers only animate
// visual layers; they never pin, add spacing, normalize, or intercept scrolling.
export default function useAboutMotion(rootRef, enabled) {
  useLayoutEffect(() => {
    if (!enabled) return;
    const root = rootRef.current;
    const main = root.closest("main");
    const page = root.closest(".portfolio-page");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = matchMedia("(min-width: 64rem) and (min-height: 44rem)");
    const previousState = root.getAttribute("data-about-motion");
    let disposed = false;
    let context;
    let scrollPlugin;
    let textPlugin;
    let loadingPlugin = false;
    let triggers = [];
    let splits = [];
    let artifacts = [];
    let introPlayed = false;
    let labelPlayed = false;
    let copyPlayed = false;
    let metadataPlayed = false;
    let needsSplit = false;
    let refreshFrame = 0;
    let keyboardSettled = root.contains(document.activeElement) || location.hash === "#about";
    let lastWidth = 0;
    let lastHeight = 0;

    const clear = () => {
      cancelAnimationFrame(refreshFrame);
      refreshFrame = 0;
      context?.revert();
      context = null;
      // The shared intro caret sits outside its split lines, so reverting those
      // lines alone cannot remove it when playback is interrupted.
      artifacts.forEach((node) => node.remove());
      artifacts = [];
      splits.forEach((split) => split.revert());
      splits = [];
      triggers = [];
      root.dataset.aboutMotion = "static";
    };
    const refresh = () => {
      refreshFrame = 0;
      if (disposed || !context || root.closest("[inert]") || document.hidden) return;
      if (needsSplit) { needsSplit = false; build(); return; }
      // Refresh only this section's measurements, without changing another
      // section's triggers, scroll behavior, or pin state.
      triggers.forEach((trigger) => {
        trigger.refresh();
        trigger.animation?.progress(trigger.progress);
      });
    };
    const queueRefresh = () => {
      if (!disposed && context && !refreshFrame) refreshFrame = requestAnimationFrame(refresh);
    };
    const queueSplit = () => { needsSplit = true; queueRefresh(); };
    const build = () => {
      if (disposed) return;
      clear();
      if (reduced.matches || keyboardSettled) {
        introPlayed = labelPlayed = copyPlayed = metadataPlayed = true;
        return;
      }
      if (document.hidden || root.closest("[inert]")) return;
      if (!scrollPlugin) {
        if (!loadingPlugin) {
          loadingPlugin = true;
          // Keep the opening's critical path and initial reduced-motion visits
          // free of ScrollTrigger. Failed/late imports leave static readable UI.
          Promise.all([import("gsap/ScrollTrigger"), import("gsap/SplitText")]).then(([{ ScrollTrigger }, { SplitText }]) => {
            if (disposed) return;
            scrollPlugin = ScrollTrigger;
            textPlugin = SplitText;
            build();
          }).catch((error) => {
            if (!disposed) console.warn("About scroll enhancement unavailable; showing the static section.", error);
          });
        }
        return;
      }
      try {
        needsSplit = false;
        // Register only after the opening has released scrolling. The plugin is
        // part of the existing GSAP package; no global plugin settings are changed.
        gsap.registerPlugin(scrollPlugin, textPlugin);
        context = gsap.context(() => {}, root);
        let failure;
        context.add(() => {
          try {
            const opening = gsap.timeline({
              scrollTrigger: {
                trigger: root, start: "top 95%", end: desktop.matches ? "top 20%" : "top 40%",
                scrub: 0.25, invalidateOnRefresh: true,
              },
            });
            triggers.push(opening.scrollTrigger);
            opening.fromTo(".about__surface", { y: desktop.matches ? 96 : 56 }, { y: 0, duration: 0.5, ease: "power2.out" }, 0)
              .fromTo(".about__curtain", { display: "block", scaleY: 1 }, { scaleY: 0, duration: 0.55, ease: "power2.inOut" }, 0.04)
              .fromTo("[data-about-title]", { yPercent: 110 }, { yPercent: 0, duration: 0.45, stagger: 0.08, ease: "power3.out" }, 0.42);

            // Separate one-shot text treatments. Scrolling back reverses the
            // curtain/line masks, but never repeatedly rewrites readable copy.
            if (!labelPlayed) {
              const label = root.querySelector("[data-about-label]");
              const timeline = cursorLabel(label, gsap, textPlugin, splits, artifacts);
              triggers.push(scrollPlugin.create({
                trigger: label, start: "top 70%", once: true,
                onEnter: () => { labelPlayed = true; timeline.play(); },
              }));
            }
            let introTimeline;
            let copyTimeline;
            let metadataTimeline;
            let copyPending = false;
            let metadataEligible = false;
            let copyComplete = copyPlayed;
            const playMetadata = () => {
              if (!metadataPlayed && metadataEligible && copyComplete) {
                metadataPlayed = true;
                metadataTimeline.play();
              }
            };
            const playCopy = () => {
              copyPending = false;
              copyTimeline.play();
            };
            if (!introPlayed) {
              const intro = root.querySelector(".about__intro");
              introTimeline = proofreadIntro(intro, gsap, textPlugin, splits, artifacts);
              const settleIntro = introTimeline.eventCallback("onComplete");
              introTimeline.eventCallback("onComplete", () => {
                settleIntro();
                if (copyPending) playCopy();
              });
              triggers.push(scrollPlugin.create({
                trigger: intro, start: "top 78%", once: true,
                onEnter: () => { introPlayed = true; introTimeline.play(); },
              }));
            }

            const copy = root.querySelector("[data-about-copy]");
            if (!copyPlayed) {
              copyTimeline = swipeParagraph(copy, gsap, textPlugin, splits, artifacts);
              const settleCopy = copyTimeline.eventCallback("onComplete");
              copyTimeline.eventCallback("onComplete", () => {
                settleCopy();
                copyComplete = true;
                playMetadata();
              });
              const enterCopy = (trigger) => {
                if (copyPlayed) return;
                copyPlayed = true;
                const bounds = copy.getBoundingClientRect();
                if (bounds.bottom < 0) {
                  introTimeline?.progress(1);
                  copyTimeline.progress(1);
                } else if (introTimeline && introTimeline.progress() < 1) {
                  copyPending = true;
                  // Never queue a long intro ahead of someone already reading
                  // the paragraph. Normal slow entry preserves the full intro.
                  if (bounds.top < innerHeight * 0.55 || Math.abs(trigger.getVelocity()) > 1200) introTimeline.progress(1);
                } else playCopy();
              };
              const trigger = scrollPlugin.create({
                trigger: copy, start: "top 84%", once: true,
                onEnter: enterCopy,
                onUpdate: (self) => {
                  if (copyPending && (copy.getBoundingClientRect().top < innerHeight * 0.55 || Math.abs(self.getVelocity()) > 1200)) introTimeline.progress(1);
                },
              });
              triggers.push(trigger);
              if (trigger.progress > 0) enterCopy(trigger);
            }
            if (!metadataPlayed) {
              const facts = root.querySelector(".about__facts");
              metadataTimeline = overtypeMetadata(facts, gsap, textPlugin, splits, artifacts);
              const eligible = () => { metadataEligible = true; playMetadata(); };
              const trigger = scrollPlugin.create({ trigger: facts, start: "top 88%", once: true, onEnter: eligible });
              triggers.push(trigger);
              if (trigger.progress > 0) eligible();
            }

            const frame = root.querySelector("[data-about-portrait]");
            const portrait = gsap.timeline({
              scrollTrigger: { trigger: frame, start: "top 92%", end: "top 52%", scrub: 0.3, invalidateOnRefresh: true },
            });
            triggers.push(portrait.scrollTrigger);
            portrait.fromTo(frame, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "power2.out" }, 0)
              .fromTo("[data-about-crop]", { yPercent: 6 }, { yPercent: 0, duration: 1, ease: "none" }, 0);
            const corners = [...frame.querySelectorAll("[data-about-corner]")];
            const cornerLengths = corners.map((path) => path.getTotalLength());
            portrait.fromTo(corners, { strokeDasharray: (index) => cornerLengths[index], strokeDashoffset: (index) => cornerLengths[index] }, { strokeDashoffset: 0, duration: 0.65, stagger: 0.06, ease: "none" }, 0.18);

            const geometry = root.querySelector(".about__geometry");
            if (getComputedStyle(geometry).display !== "none") {
              const paths = [...geometry.querySelectorAll("[data-about-stroke]")];
              const lengths = paths.map((path) => path.getTotalLength());
              const construction = gsap.timeline({
                // About is currently the last section. Keep the full drawing
                // reachable without adding a blank scroll runway beneath it.
                scrollTrigger: { trigger: geometry, start: "top bottom", end: "clamp(bottom 35%)", scrub: 0.35, invalidateOnRefresh: true },
              });
              triggers.push(construction.scrollTrigger);
              construction.fromTo(paths, { strokeDasharray: (index) => lengths[index], strokeDashoffset: (index) => lengths[index] }, { strokeDashoffset: 0, duration: 1, stagger: 0.08, ease: "none" }, 0)
                .fromTo("[data-about-grid]", { x: -10, y: 6 }, { x: 8, y: -6, duration: 1.16, ease: "none" }, 0)
                .fromTo("[data-about-mark]", { x: 0 }, { x: 12, duration: 1.16, ease: "none" }, 0)
                .fromTo("[data-about-segment]", { x: -4 }, { x: 4, duration: 1.16, ease: "none" }, 0)
                .fromTo("[data-about-fragment]", { y: 4, scale: 0.85, transformOrigin: "50% 50%" }, { y: -2, scale: 1, duration: 1.16, ease: "none" }, 0);
            }
          } catch (error) { failure = error; }
        });
        if (failure) throw failure;
        root.dataset.aboutMotion = "scroll";
        refresh();
      } catch (error) {
        clear();
        console.warn("About motion unavailable; keeping the editorial section readable.", error);
      }
    };
    const onFocus = () => { keyboardSettled = true; clear(); };
    const onHash = () => { if (location.hash === "#about") onFocus(); };
    const onVisibility = () => { if (document.hidden) clear(); else build(); };
    const resizeObserver = new ResizeObserver(([entry]) => {
      if (disposed || !entry) return;
      const { width, height } = entry.contentRect;
      if (Math.abs(width - lastWidth) < 0.5 && Math.abs(height - lastHeight) < 0.5) return;
      if (lastWidth && Math.abs(width - lastWidth) >= 0.5) needsSplit = true;
      lastWidth = width; lastHeight = height;
      queueRefresh();
    });
    const inertObserver = new MutationObserver(build);
    resizeObserver.observe(root);
    if (main) inertObserver.observe(main, { attributes: true, attributeFilter: ["inert"] });
    if (page) inertObserver.observe(page, { attributes: true, attributeFilter: ["inert"] });
    reduced.addEventListener("change", build);
    desktop.addEventListener("change", build);
    document.addEventListener("visibilitychange", onVisibility);
    root.addEventListener("focusin", onFocus);
    root.addEventListener("selectstart", onFocus);
    root.addEventListener("load", queueRefresh, true);
    window.addEventListener("hashchange", onHash);
    document.fonts?.addEventListener("loadingdone", queueSplit);
    document.fonts?.addEventListener("loadingerror", queueSplit);
    document.fonts?.ready.then(() => { if (!disposed) queueSplit(); });

    // An explicit initial fragment can be deferred by the opening's scroll lock.
    // Respect a browser-restored position; only repair a still-at-top #about load.
    if (location.hash === "#about" && window.scrollY === 0 && root.getBoundingClientRect().top > 16) {
      root.scrollIntoView({ block: "start", behavior: "instant" });
      root.focus({ preventScroll: true });
    }
    build();

    return () => {
      disposed = true;
      clear();
      resizeObserver.disconnect();
      inertObserver.disconnect();
      reduced.removeEventListener("change", build);
      desktop.removeEventListener("change", build);
      document.removeEventListener("visibilitychange", onVisibility);
      root.removeEventListener("focusin", onFocus);
      root.removeEventListener("selectstart", onFocus);
      root.removeEventListener("load", queueRefresh, true);
      window.removeEventListener("hashchange", onHash);
      document.fonts?.removeEventListener("loadingdone", queueSplit);
      document.fonts?.removeEventListener("loadingerror", queueSplit);
      if (previousState === null) root.removeAttribute("data-about-motion");
      else root.setAttribute("data-about-motion", previousState);
    };
  }, [rootRef, enabled]);
}
