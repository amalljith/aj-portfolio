import { useLayoutEffect } from "react";
import { gsap } from "gsap";

// One reversible scene on the natural section height. No pin or scroll lock.
export default function useExperienceMotion(rootRef, enabled) {
  useLayoutEffect(() => {
    if (!enabled) return;
    const root = rootRef.current;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = matchMedia("(min-width: 64rem) and (min-height: 44rem)");
    const fine = matchMedia("(hover: hover) and (pointer: fine)");
    const originalState = root.getAttribute("data-experience-motion");
    const siblings = [...root.parentElement.children];
    const predecessors = siblings.slice(0, siblings.indexOf(root));
    const geometry = () => [innerWidth, innerHeight, root.offsetHeight, ...predecessors.map((section) => section.getBoundingClientRect().height)].join("|");
    let disposed = false, loading = false, plugin, context, timeline, frame = 0, geometryKey = "";
    let brandCleanups = [];
    let settled = root.contains(document.activeElement) || location.hash === "#experience";
    let initialAnchor = location.hash === "#experience" && scrollY === 0;
    const anchorInputs = ["wheel", "touchstart", "pointerdown", "keydown", "hashchange"];
    const stopAnchor = () => {
      initialAnchor = false;
      anchorInputs.forEach((event) => window.removeEventListener(event, stopAnchor));
    };
    const honorAnchor = () => {
      if (!initialAnchor || disposed || document.hidden || root.closest("[inert]")) return;
      if (Math.abs(root.getBoundingClientRect().top) > 20) {
        root.scrollIntoView({ block: "start", behavior: "instant" });
        root.focus({ preventScroll: true });
      }
    };
    const clear = () => {
      brandCleanups.forEach((cleanup) => cleanup());
      brandCleanups = [];
      const previous = context;
      context = timeline = null;
      previous?.revert();
      root.dataset.experienceMotion = "static";
    };
    const build = () => {
      if (disposed) return;
      clear();
      geometryKey = geometry();
      if (reduced.matches || document.hidden || root.closest("[inert]")) { honorAnchor(); return; }
      if (!plugin && !settled) {
        if (!loading) {
          loading = true;
          import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
            if (disposed) return;
            plugin = ScrollTrigger; gsap.registerPlugin(plugin); queue();
          }).catch((error) => {
            if (!disposed) console.warn("Experience motion unavailable; keeping the internship details visible.", error);
          });
        }
        honorAnchor();
        return;
      }
      try {
        context = gsap.context(() => {}, root);
        context.add(() => {
          const amplitude = desktop.matches ? 1 : 0.5;
          if (!settled) {
            // Capture explicit start poses before ScrollTrigger's initial refresh.
            // Delayed stagger children must not revert to visible CSS positions.
            gsap.set("[data-experience-label]", { y: 5 * amplitude, opacity: 0.4 });
            timeline = gsap.timeline({ scrollTrigger: {
              id: "aj-experience", trigger: root, start: "top 85%",
              end: desktop.matches ? "clamp(top 10%)" : "clamp(bottom 95%)",
              scrub: 0.2, invalidateOnRefresh: true,
              onRefresh: (self) => self.animation?.progress(self.progress),
            } });
            timeline.fromTo("[data-experience-marker]", { x: -8 * amplitude, opacity: 0.35 }, { x: 0, opacity: 1, duration: 0.4, ease: "power2.out" }, 0)
              .fromTo("[data-experience-rule]", { scaleX: 0 }, { scaleX: 1, duration: 0.65, ease: "power2.inOut" }, 0)
              .fromTo("[data-experience-label]", { y: 5 * amplitude, opacity: 0.4 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.08, ease: "power2.out" }, 0.08)
              .fromTo("[data-experience-signal]", { x: 0 }, { x: () => root.querySelector(".experience__signal").clientWidth - 5, duration: 2.4, ease: "none" }, 0);
          }
          [...root.querySelectorAll("[data-experience]")].forEach((article, index) => {
            const start = index * 2.4;
            if (timeline) {
              gsap.set(article.querySelectorAll("[data-experience-phrase]"), { yPercent: 105, x: (i) => (i % 2 ? -10 : 10) * amplitude });
              gsap.set(article.querySelectorAll("[data-experience-frame-line]"), { strokeDasharray: "1 1", strokeDashoffset: 1 });
              gsap.set(article.querySelectorAll("[data-experience-identity-copy]"), { x: 8 * amplitude, opacity: 0.35 });
              gsap.set(article.querySelectorAll("[data-experience-technology]"), { y: 8 * amplitude, opacity: 0.4 });
              timeline.fromTo(article.querySelectorAll("[data-experience-phrase]"), {
                yPercent: 105, x: (i) => (i % 2 ? -10 : 10) * amplitude,
              }, { yPercent: 0, x: 0, duration: 0.6, stagger: 0.13, ease: "power3.out" }, start + 0.1)
                .fromTo(article.querySelectorAll("[data-experience-frame-line]"), { strokeDasharray: "1 1", strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.55, stagger: 0.06, ease: "power2.inOut" }, start + 0.48)
                .fromTo(article.querySelector("[data-experience-frame]"), { x: -6 * amplitude, y: 4 * amplitude }, { x: 0, y: 0, duration: 0.65, ease: "power2.out" }, start + 0.6)
                .fromTo(article.querySelector("[data-experience-brand-reveal]"), { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.6, ease: "power3.inOut" }, start + 0.64)
                .fromTo(article.querySelectorAll("[data-experience-identity-copy]"), { x: 8 * amplitude, opacity: 0.35 }, { x: 0, opacity: 1, duration: 0.5, stagger: 0.09, ease: "power2.out" }, start + 0.72)
                .fromTo(article.querySelector("[data-experience-duration]"), { y: 8 * amplitude, opacity: 0.5 }, { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }, start + 1.1)
                .fromTo(article.querySelector("[data-experience-copy]"), { y: 8 * amplitude, opacity: 0.5 }, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, start + 1.22)
                .fromTo(article.querySelectorAll("[data-experience-technology]"), { y: 8 * amplitude, opacity: 0.4 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.08, ease: "power2.out" }, start + 1.65)
                .fromTo(article.querySelector("[data-experience-closing]"), { scaleX: 0 }, { scaleX: 1, duration: 0.55, ease: "power2.inOut" }, start + 1.7);
            }

            // Scroll owns the outer frame and mask. Pointer/tap responses own
            // its inner decoration only; the brand image never transforms.
            const brand = article.querySelector("[data-experience-brand]");
            const frameResponse = brand.querySelector("[data-experience-frame-response]");
            const moveX = gsap.quickTo(frameResponse, "x", { duration: 0.32, ease: "power2.out" });
            const moveY = gsap.quickTo(frameResponse, "y", { duration: 0.32, ease: "power2.out" });
            let press = null, tap = false, bounds = null;
            const response = gsap.timeline({ paused: true, defaults: { duration: 0.28, ease: "power2.out" }, onComplete: () => { if (tap) response.reverse(); } })
              .to(brand.querySelector("[data-experience-frame-extension]"), { scaleX: 1.6, svgOrigin: "0 320" }, 0)
              .to(brand.querySelector("[data-experience-frame-corner]"), { x: 2, opacity: 1 }, 0);
            const move = (event) => {
              if (!bounds || event.pointerType !== "mouse" || !fine.matches) return;
              moveX(gsap.utils.clamp(-3, 3, ((event.clientX - bounds.left) / bounds.width - 0.5) * 6));
              moveY(gsap.utils.clamp(-2, 2, ((event.clientY - bounds.top) / bounds.height - 0.5) * 4));
            };
            const enter = (event) => {
              if (event.pointerType === "mouse" && fine.matches) {
                bounds = brand.getBoundingClientRect(); tap = false; response.play(); move(event);
              }
            };
            const leave = (event) => {
              if (event.pointerType === "mouse") { bounds = null; moveX(0); moveY(0); response.reverse(); }
              press = null;
            };
            const down = (event) => {
              if (event.pointerType !== "mouse" && event.isPrimary && !event.target.closest("a")) press = { id: event.pointerId, x: event.clientX, y: event.clientY, time: performance.now() };
            };
            const up = (event) => {
              if (press?.id === event.pointerId && Math.hypot(event.clientX - press.x, event.clientY - press.y) < 12 && performance.now() - press.time < 500) {
                tap = true; response.restart();
              }
              press = null;
            };
            const cancel = () => { press = null; response.reverse(); };
            const events = { pointerenter: enter, pointermove: move, pointerleave: leave, pointerdown: down, pointerup: up, pointercancel: cancel };
            Object.entries(events).forEach(([event, listener]) => brand.addEventListener(event, listener, { passive: true }));
            brandCleanups.push(() => {
              press = bounds = null;
              Object.entries(events).forEach(([event, listener]) => brand.removeEventListener(event, listener));
            });
          });
          if (timeline) {
            timeline.scrollTrigger.refresh();
            timeline.progress(timeline.scrollTrigger.progress);
          }
        });
        root.dataset.experienceMotion = timeline ? "scroll" : "static";
      } catch (error) {
        clear();
        console.warn("Experience enhancement failed; showing the complete internship record.", error);
      }
      geometryKey = geometry();
      honorAnchor();
    };
    const queue = () => {
      if (!disposed && !frame) frame = requestAnimationFrame(() => { frame = 0; build(); });
    };
    const settle = () => {
      if (settled) return;
      settled = true; clear(); queue();
    };
    const focus = (event) => {
      // A native tap can focus the section's anchor target. Keep its decorative
      // response alive; keyboard focus and actual controls still settle text.
      if (event.target === root && !root.matches(":focus-visible")) return;
      settle();
    };
    const selection = () => {
      const selected = window.getSelection();
      if (selected && !selected.isCollapsed && (root.contains(selected.anchorNode) || root.contains(selected.focusNode))) settle();
    };
    const visibility = () => { if (document.hidden) clear(); else queue(); };
    const resize = new ResizeObserver(() => { if (geometryKey !== geometry()) queue(); });
    [root, ...predecessors].forEach((section) => resize.observe(section));
    const inert = new MutationObserver(queue);
    [root.closest("main"), root.closest(".portfolio-page")].filter(Boolean).forEach((node) => inert.observe(node, { attributes: true, attributeFilter: ["inert"] }));
    reduced.addEventListener("change", queue); desktop.addEventListener("change", queue); fine.addEventListener("change", queue);
    window.addEventListener("resize", queue); window.addEventListener("pageshow", queue);
    document.addEventListener("visibilitychange", visibility); document.addEventListener("selectionchange", selection);
    root.addEventListener("focusin", focus); root.addEventListener("load", queue, true); root.addEventListener("error", queue, true);
    document.fonts?.addEventListener("loadingdone", queue); document.fonts?.addEventListener("loadingerror", queue);
    document.fonts?.ready.then(() => { if (!disposed) queue(); });
    if (initialAnchor) anchorInputs.forEach((event) => window.addEventListener(event, stopAnchor, { passive: true }));
    build();
    return () => {
      disposed = true; stopAnchor(); cancelAnimationFrame(frame); clear(); resize.disconnect(); inert.disconnect();
      reduced.removeEventListener("change", queue); desktop.removeEventListener("change", queue); fine.removeEventListener("change", queue);
      window.removeEventListener("resize", queue); window.removeEventListener("pageshow", queue);
      document.removeEventListener("visibilitychange", visibility); document.removeEventListener("selectionchange", selection);
      root.removeEventListener("focusin", focus); root.removeEventListener("load", queue, true); root.removeEventListener("error", queue, true);
      document.fonts?.removeEventListener("loadingdone", queue); document.fonts?.removeEventListener("loadingerror", queue);
      if (originalState === null) root.removeAttribute("data-experience-motion"); else root.setAttribute("data-experience-motion", originalState);
    };
  }, [rootRef, enabled]);
}
