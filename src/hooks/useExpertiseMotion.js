import { useLayoutEffect } from "react";
import { gsap } from "gsap";

function iconEntrance(panel, timeline) {
  const type = panel.dataset.technology;
  if (type === "python") timeline.fromTo(panel.querySelectorAll("[data-python-corner]"), {
    x: (i) => i % 2 ? 9 : -9, y: (i) => i < 2 ? -6 : 6,
  }, { x: 0, y: 0, duration: 0.55, stagger: 0.035, ease: "power3.out" }, 0.08);
  const paths = [...panel.querySelectorAll("[data-expertise-draw]")];
  if (paths.length) {
    const lengths = paths.map((path) => path.getTotalLength());
    timeline.fromTo(paths, { strokeDasharray: (i) => lengths[i], strokeDashoffset: (i) => lengths[i] }, {
      strokeDashoffset: 0, duration: type === "fastapi" ? 0.3 : 0.65, stagger: 0.06, ease: "power2.out",
    }, 0.08);
  }
  if (type === "react") timeline.fromTo(panel.querySelector("[data-react-orbit]"), { rotation: -35, svgOrigin: "140 120" }, { rotation: 0, duration: 0.8, ease: "power2.out" }, 0.08);
  if (type === "postgresql") {
    const mask = panel.querySelector("[data-brand-mask]");
    timeline.fromTo(mask, { clipPath: "polygon(0 0,0 0,0 34%,0 34%,0 67%,0 67%,0 100%,0 100%)" }, {
      clipPath: "polygon(0 0,55% 0,55% 34%,35% 34%,35% 67%,15% 67%,15% 100%,0 100%)", duration: 0.22, ease: "power2.out",
    }, 0.06).to(mask, { clipPath: "polygon(0 0,100% 0,100% 34%,100% 34%,100% 67%,100% 67%,100% 100%,0 100%)", duration: 0.35, ease: "power2.out" }, 0.28);
  }
}

// Codrops Find All inspires grouped glyph emphasis; the Museum's pinned handoff
// informs the short stage. No routing, smooth scroller or demo controls are used.
export default function useExpertiseMotion(rootRef, enabled) {
  useLayoutEffect(() => {
    if (!enabled) return;
    const root = rootRef.current;
    const desktop = matchMedia("(min-width: 64rem) and (min-height: 35rem)");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const fine = matchMedia("(hover: hover) and (pointer: fine)");
    const previousMode = root.getAttribute("data-expertise-mode");
    const previousActive = root.getAttribute("data-expertise-active");
    const counter = root.querySelector("[data-expertise-current]");
    let context, activeContext, plugin;
    let disposed = false;
    let importing = false;
    let frame = 0;
    let active = -1;
    let anchored = location.hash === "#expertise" || document.activeElement === root;
    let triggers = [];
    let removeInteractions = () => {};
    const clear = () => {
      cancelAnimationFrame(frame); frame = 0;
      removeInteractions(); removeInteractions = () => {};
      // Disable activation before reverting: trigger cleanup can render callbacks.
      const previousAnimation = activeContext, previousContext = context;
      activeContext = context = null;
      triggers = []; active = -1;
      root.dataset.expertiseMode = "flow";
      root.removeAttribute("data-expertise-active");
      counter.textContent = "01";
      previousAnimation?.revert();
      previousContext?.revert();
    };
    const refresh = () => {
      frame = 0;
      if (!disposed && context && !document.hidden && !root.closest("[inert]")) {
        if (root.dataset.expertiseMode === "stage" && root.querySelector(".expertise__stage").getBoundingClientRect().height > innerHeight - 48) {
          rebuildPreservingReading();
        } else triggers.forEach((trigger) => trigger.refresh());
      }
    };
    const queueRefresh = () => { if (!disposed && context && !frame) frame = requestAnimationFrame(refresh); };
    const build = () => {
      if (disposed) return;
      clear();
      if (reduced.matches || document.hidden || root.closest("[inert]")) return;
      if (!plugin) {
        if (!importing) {
          importing = true;
          import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
            if (!disposed) {
              // Preserve the article being read instead of permanently turning
              // an eligible desktop into a stacked list after a late import.
              plugin = ScrollTrigger; rebuildPreservingReading();
            }
          })
            .catch((error) => { if (!disposed) console.warn("Expertise motion unavailable; keeping the full technology list visible.", error); });
        }
        return;
      }
      try {
        gsap.registerPlugin(plugin);
        context = gsap.context(() => {}, root);
        let failure;
        context.add(() => {
          try {
            const panels = [...root.querySelectorAll(".expertise__panel")];
            const stage = root.querySelector(".expertise__stage");
            if (desktop.matches) {
              root.dataset.expertiseMode = "stage";
              // All five articles retain their semantic content in the AX tree.
              // They contain no interactive controls; opacity only changes paint.
              if (stage.getBoundingClientRect().height > innerHeight - 48) root.dataset.expertiseMode = "flow";
            }
            if (root.dataset.expertiseMode === "stage") {
              // The stage alone owns panel visibility. Replaceable entrance
              // contexts animate descendants only, never an outgoing panel.
              // Capture original styles once so flow/unmount restores them.
              gsap.set(panels, { opacity: 0, pointerEvents: "none" });
              const setters = panels.map((panel) => ({
                opacity: gsap.quickSetter(panel, "opacity"),
                pointerEvents: gsap.quickSetter(panel, "pointerEvents"),
              }));
              const indexAt = (progress) => Math.max(0, Math.min(panels.length - 1, Math.floor(progress * panels.length)));
              const activate = (index, immediate = false) => {
                if (disposed || !context || root.dataset.expertiseMode !== "stage") return;
                if (index === active && !immediate) return;
                // Reconcile every panel, including on refresh at the same index.
                // All writes happen together before the browser can paint.
                setters.forEach((set, i) => {
                  set.opacity(i === index ? 1 : 0);
                  set.pointerEvents(i === index ? "auto" : "none");
                });
                root.dataset.expertiseActive = String(index);
                counter.textContent = String(index + 1).padStart(2, "0");
                if (index === active) return;
                activeContext?.revert();
                active = index;
                let activationError;
                // This separately cleaned-up context must not accumulate in the
                // parent context each time a ScrollTrigger callback selects it.
                context.ignore(() => {
                  activeContext = gsap.context(() => {
                    try {
                      const incoming = panels[index];
                      const timeline = gsap.timeline();
                      const chars = [...incoming.querySelectorAll("[data-expertise-char]")];
                      const groups = [...new Set(chars.map((char) => char.dataset.expertiseChar))]
                        .sort((a, b) => chars.filter((c) => c.dataset.expertiseChar === b).length - chars.filter((c) => c.dataset.expertiseChar === a).length);
                      timeline.fromTo(chars, { yPercent: 12, opacity: 0.2, color: "var(--accent)" }, {
                        yPercent: 0, opacity: 1, color: "var(--ink)", duration: 0.38,
                        stagger: (i) => groups.indexOf(chars[i].dataset.expertiseChar) * 0.02, ease: "power3.out",
                      }, 0.1);
                      iconEntrance(incoming, timeline);
                      if (immediate) timeline.progress(1);
                    } catch (error) { activationError = error; }
                  }, root);
                });
                if (activationError) {
                  clear();
                  anchored = true;
                  console.warn("Expertise transition unavailable; showing every technology in normal flow.", activationError);
                }
              };
              const track = root.querySelector(".expertise__track");
              const travel = () => Math.max(1, track.getBoundingClientRect().height - stage.getBoundingClientRect().height);
              let entered = false;
              const timeline = gsap.timeline({ scrollTrigger: {
                trigger: track, start: "top 24px", end: () => `+=${travel()}`, scrub: 0.2, invalidateOnRefresh: true,
                onUpdate: (self) => activate(indexAt(self.progress)),
                onRefresh: (self) => activate(indexAt(self.progress), true),
                onEnter: () => {
                  if (!entered && active === 0) context?.ignore(() => activeContext?.add(() => iconEntrance(panels[0], gsap.timeline())));
                  entered = true;
                },
              } });
              triggers.push(timeline.scrollTrigger);
              timeline.fromTo("[data-expertise-progress]", { scaleX: 0 }, { scaleX: 1, duration: 1, ease: "none" }, 0)
                .fromTo("[data-expertise-fragment]", { x: 0 }, { x: 14, duration: 1, ease: "none" }, 0)
                .fromTo("[data-expertise-grid]", { x: -4, y: 4 }, { x: 4, y: -4, duration: 1, ease: "none" }, 0);
              activate(indexAt(timeline.scrollTrigger.progress), true);
              if (!context) return;
            } else if (!anchored) {
              panels.forEach((panel) => {
                const timeline = gsap.timeline({ scrollTrigger: { trigger: panel, start: "top 85%", once: true } });
                triggers.push(timeline.scrollTrigger);
                timeline.fromTo(panel.querySelector(".expertise__name"), { y: 8, opacity: 0.6 }, { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" }, 0);
                iconEntrance(panel, timeline);
              });
            }
            const interactions = [...root.querySelectorAll(".expertise__index-link")].map((link) => {
              const chars = [...link.querySelectorAll("[data-index-char]")];
              const groups = [...new Set(chars.map((char) => char.dataset.indexChar))];
              const timeline = gsap.timeline({ paused: true }).fromTo(chars, { y: 0, color: "var(--ink)" }, {
                y: -2, color: "var(--accent)", duration: 0.14,
                stagger: (i) => groups.indexOf(chars[i].dataset.indexChar) * 0.012, ease: "power2.out",
              }).to(chars, { y: 0, color: "var(--ink)", duration: 0.22, ease: "power2.out" }, ">-0.06");
              const play = () => timeline.restart();
              const leave = () => timeline.play();
              if (fine.matches) link.addEventListener("pointerenter", play);
              link.addEventListener("focus", play);
              link.addEventListener("pointerleave", leave);
              link.addEventListener("blur", leave);
              return () => {
                link.removeEventListener("pointerenter", play); link.removeEventListener("focus", play);
                link.removeEventListener("pointerleave", leave); link.removeEventListener("blur", leave);
              };
            });
            removeInteractions = () => interactions.forEach((remove) => remove());
          } catch (error) { failure = error; }
        });
        if (failure) throw failure;
        refresh();
      } catch (error) {
        clear();
        console.warn("Expertise enhancement failed; showing the readable technology list.", error);
      }
    };
    const rebuildPreservingReading = () => {
      const panels = [...root.querySelectorAll(".expertise__panel")];
      const index = root.dataset.expertiseMode === "stage" ? active : panels.findIndex((panel) => {
        const box = panel.getBoundingClientRect();
        return box.top <= innerHeight / 2 && box.bottom >= innerHeight / 2;
      });
      const panel = panels[index];
      const before = panel?.getBoundingClientRect();
      const reading = before && before.top < innerHeight && before.bottom > 0 && !document.hidden && !root.closest("[inert]");
      if (reading && !plugin) anchored = true;
      build();
      if (!reading) return;
      if (root.dataset.expertiseMode === "stage") {
        const trigger = triggers.find((item) => item.trigger === root.querySelector(".expertise__track"));
        if (trigger) {
          window.scrollTo({ top: trigger.start + (trigger.end - trigger.start) * ((index + 0.5) / panels.length), behavior: "instant" });
          trigger.update();
        }
      } else {
        // A preference/breakpoint change reflows the same content. Preserve its
        // on-screen position rather than sending the current article away.
        window.scrollBy({ top: panel.getBoundingClientRect().top - before.top, behavior: "instant" });
      }
    };
    const queueRebuild = () => {
      if (disposed || !context) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => { frame = 0; rebuildPreservingReading(); });
    };
    const onFocus = (event) => { if (event.target === root) { anchored = true; build(); } };
    const onHash = () => { if (location.hash === "#expertise") { anchored = true; build(); } };
    const onVisibility = () => { if (document.hidden) clear(); else build(); };
    const resize = new ResizeObserver(queueRefresh);
    resize.observe(root);
    const inert = new MutationObserver(build);
    [root.closest("main"), root.closest(".portfolio-page")].filter(Boolean).forEach((node) => inert.observe(node, { attributes: true, attributeFilter: ["inert"] }));
    desktop.addEventListener("change", rebuildPreservingReading); reduced.addEventListener("change", rebuildPreservingReading); fine.addEventListener("change", rebuildPreservingReading);
    window.addEventListener("resize", queueRebuild);
    document.addEventListener("visibilitychange", onVisibility); root.addEventListener("focusin", onFocus);
    root.addEventListener("load", queueRefresh, true); window.addEventListener("hashchange", onHash);
    document.fonts?.addEventListener("loadingdone", queueRebuild); document.fonts?.addEventListener("loadingerror", queueRebuild);
    document.fonts?.ready.then(() => { if (!disposed) queueRebuild(); });
    if (location.hash === "#expertise" && scrollY === 0 && root.getBoundingClientRect().top > 16) {
      root.scrollIntoView({ block: "start", behavior: "instant" }); root.focus({ preventScroll: true });
    }
    build();
    return () => {
      disposed = true; clear(); resize.disconnect(); inert.disconnect();
      desktop.removeEventListener("change", rebuildPreservingReading); reduced.removeEventListener("change", rebuildPreservingReading); fine.removeEventListener("change", rebuildPreservingReading);
      window.removeEventListener("resize", queueRebuild);
      document.removeEventListener("visibilitychange", onVisibility); root.removeEventListener("focusin", onFocus);
      root.removeEventListener("load", queueRefresh, true); window.removeEventListener("hashchange", onHash);
      document.fonts?.removeEventListener("loadingdone", queueRebuild); document.fonts?.removeEventListener("loadingerror", queueRebuild);
      if (previousMode === null) root.removeAttribute("data-expertise-mode"); else root.setAttribute("data-expertise-mode", previousMode);
      if (previousActive === null) root.removeAttribute("data-expertise-active"); else root.setAttribute("data-expertise-active", previousActive);
    };
  }, [rootRef, enabled]);
}
