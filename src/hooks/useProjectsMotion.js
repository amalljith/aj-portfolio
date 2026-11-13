import { useLayoutEffect } from "react";
import { gsap } from "gsap";

// The horizontal transform owns position; all reveals/parallax live below it.
// No wheel handlers, snap, custom scroller or independent ticker are installed.
export default function useProjectsMotion(rootRef, enabled) {
  useLayoutEffect(() => {
    if (!enabled) return;
    const root = rootRef.current;
    const gallery = root.querySelector(".projects__gallery");
    const windowElement = root.querySelector(".projects__window");
    const track = root.querySelector(".projects__track");
    const originalTrackStyle = track.getAttribute("style");
    const panels = [...root.querySelectorAll("[data-project]")];
    const counter = root.querySelector("[data-projects-current]");
    const rail = root.querySelector("[data-projects-progress]");
    const desktop = matchMedia("(min-width: 64rem) and (min-height: 44rem)");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const originalMode = root.getAttribute("data-projects-mode");
    let disposed = false, importing = false, frame = 0, plugin, context, horizontal;
    let active = -1, measurements = [], sizeKey = "", layoutKey = "", introStarted = false;
    let initialAnchor = location.hash === "#projects" && scrollY === 0;
    const anchorInputs = ["wheel", "touchstart", "pointerdown", "keydown", "hashchange"];
    const stopInitialAnchor = () => {
      initialAnchor = false;
      anchorInputs.forEach((name) => window.removeEventListener(name, stopInitialAnchor));
    };
    const honorInitialAnchor = () => {
      if (!initialAnchor || disposed || document.hidden || root.closest("[inert]")) return;
      if (Math.abs(root.getBoundingClientRect().top) > 20) {
        root.scrollIntoView({ block: "start", behavior: "instant" });
        root.focus({ preventScroll: true });
      }
    };
    const predecessors = [...root.parentElement.children].slice(0, [...root.parentElement.children].indexOf(root));
    const layout = () => predecessors.map((section) => section.getBoundingClientRect().height).join("|");
    const distance = () => Math.max(0, track.scrollWidth - windowElement.clientWidth);
    const size = () => `${innerWidth}|${innerHeight}|${root.clientWidth}`;
    const measure = () => {
      const left = track.getBoundingClientRect().left;
      measurements = panels.map((panel) => {
        const box = panel.getBoundingClientRect();
        return { left: box.left - left, width: box.width };
      });
    };
    const select = (index, progress) => {
      if (disposed) return;
      if (index !== active) {
        active = index;
        root.dataset.projectsActive = String(index);
        counter.textContent = String(index + 1).padStart(2, "0");
      }
      rail.style.transform = `scaleX(${Math.max(0, Math.min(1, progress))})`;
    };
    const syncHorizontal = () => {
      if (disposed || root.dataset.projectsMode !== "horizontal" || !measurements.length) return;
      const offset = -Number(gsap.getProperty(track, "x"));
      const width = windowElement.clientWidth;
      let index = 0, largest = -1;
      measurements.forEach((panel, i) => {
        const overlap = Math.max(0, Math.min(panel.left + panel.width, offset + width) - Math.max(panel.left, offset));
        if (overlap > largest) { largest = overlap; index = i; }
      });
      // Read the rendered tween position, not the scrub's ahead-of-paint target.
      select(index, offset / Math.max(1, distance()));
    };
    const clear = () => {
      const previous = context;
      context = horizontal = null;
      previous?.revert();
      // A pre-init getProperty can normalize CSS transforms before the tween
      // captures them. Restore that owned node's actual pre-enhancement style.
      if (originalTrackStyle === null) track.removeAttribute("style"); else track.setAttribute("style", originalTrackStyle);
      root.dataset.projectsMode = "flow";
      root.removeAttribute("data-projects-active");
      counter.textContent = "01"; active = -1;
      rail.style.removeProperty("transform");
      windowElement.scrollLeft = 0;
    };
    const build = () => {
      if (disposed) return;
      clear();
      if (reduced.matches || document.hidden || root.closest("[inert]")) return;
      if (!plugin) {
        if (!importing) {
          importing = true;
          import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
            if (disposed) return;
            plugin = ScrollTrigger;
            gsap.registerPlugin(plugin);
            rebuild();
          }).catch((error) => {
            if (!disposed) console.warn("Projects motion unavailable; keeping the readable vertical gallery.", error);
          });
        }
        return;
      }
      try {
        context = gsap.context(() => {}, root);
        context.add(() => {
          if (desktop.matches) {
            root.dataset.projectsMode = "horizontal";
            const unsafe = gallery.scrollHeight > gallery.clientHeight + 2 || panels.some((panel) => panel.scrollHeight > panel.clientHeight + 2);
            if (unsafe || distance() <= 0) root.dataset.projectsMode = "flow";
          }
          if (!introStarted) {
            const intro = gsap.timeline({ onStart: () => { introStarted = true; }, scrollTrigger: { trigger: ".projects__introduction", start: "top 85%", once: true } });
            intro.fromTo("[data-projects-intro]", { xPercent: (i) => i ? 10 : -10, clipPath: "inset(0 100% 0 0)" }, {
              xPercent: 0, clipPath: "inset(0 0% 0 0)", duration: 0.8, stagger: 0.1, ease: "power3.out",
            }, 0).fromTo("[data-projects-rule]", { scaleX: 0 }, { scaleX: 1, duration: 0.65, ease: "power2.out" }, 0.15);
          }

          if (root.dataset.projectsMode === "horizontal") {
            measure();
            horizontal = gsap.timeline({
              onUpdate: syncHorizontal,
              scrollTrigger: {
                id: "aj-projects-gallery", trigger: gallery, start: "top 16px", end: () => `+=${distance()}`,
                pin: true, pinSpacing: true, scrub: 0.35, anticipatePin: 1, invalidateOnRefresh: true,
                onRefresh: () => { measure(); syncHorizontal(); },
              },
            });
            horizontal.to(track, { x: () => -distance(), duration: 1, ease: "none" }, 0);
            panels.forEach((panel, index) => {
              const reveal = panel.querySelector("[data-project-reveal]");
              const title = panel.querySelector("[data-project-title]");
              if (index === 0) {
                gsap.fromTo(reveal, { clipPath: "inset(0 0 100% 0)" }, {
                  clipPath: "inset(0 0 0% 0)", ease: "none",
                  scrollTrigger: { trigger: gallery, start: "top 90%", end: "top 30%", scrub: true },
                });
              } else {
                const start = Math.max(0, (measurements[index].left - windowElement.clientWidth * 0.9) / distance());
                const end = Math.min(1, (measurements[index].left - windowElement.clientWidth * 0.32) / distance());
                const duration = Math.max(0.01, end - start);
                horizontal.fromTo(reveal, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", ease: "none", duration }, start)
                  .fromTo(title, { yPercent: 100 }, { yPercent: 0, ease: "power2.out", duration: duration * 0.75 }, start + duration * 0.15);
              }
              const start = Math.max(0, (measurements[index].left - windowElement.clientWidth) / distance());
              const end = Math.min(1, (measurements[index].left + measurements[index].width) / distance());
              const duration = Math.max(0.01, end - start);
              horizontal.fromTo(panel.querySelector("[data-project-image]"), { xPercent: 4, scale: 1.1 }, { xPercent: -4, scale: 1.1, duration, ease: "none" }, start)
                .fromTo(panel.querySelector("[data-project-number]"), { y: 8 }, { y: -8, duration, ease: "none" }, start);
            });
            horizontal.scrollTrigger.refresh();
            syncHorizontal();
          } else {
            panels.forEach((panel) => {
              gsap.fromTo(panel.querySelector("[data-project-reveal]"), { y: 14, clipPath: "inset(0 0 12% 0)" }, {
                y: 0, clipPath: "inset(0 0 0% 0)", duration: 0.65, ease: "power2.out",
                scrollTrigger: { trigger: panel, start: "top 88%", once: true },
              });
            });
            plugin.create({ trigger: gallery, start: "top center", end: "bottom center", onUpdate: (self) => {
              let index = 0, closest = Infinity;
              panels.forEach((panel, i) => {
                const box = panel.getBoundingClientRect();
                const proximity = Math.abs((box.top + box.bottom) / 2 - innerHeight / 2);
                if (proximity < closest) { index = i; closest = proximity; }
              });
              select(index, self.progress);
            } });
          }
        });
        sizeKey = size(); layoutKey = layout();
      } catch (error) {
        clear();
        console.warn("Projects enhancement failed; keeping every project readable.", error);
      }
    };
    const rebuild = () => {
      if (disposed) return;
      const introduction = root.querySelector(".projects__introduction");
      const introBefore = introduction.getBoundingClientRect();
      const readingIntro = introBefore.bottom > 0 && introBefore.top < innerHeight && !document.hidden && !root.closest("[inert]");
      const oldMode = root.dataset.projectsMode;
      const index = oldMode === "horizontal" ? Math.max(0, active) : panels.reduce((best, panel, i) => {
        const box = panel.getBoundingClientRect(), previous = panels[best].getBoundingClientRect();
        return Math.abs(box.top - innerHeight / 3) < Math.abs(previous.top - innerHeight / 3) ? i : best;
      }, 0);
      const before = panels[index].getBoundingClientRect();
      const view = gallery.getBoundingClientRect();
      const reading = before.bottom > 0 && before.top < innerHeight && view.top < innerHeight && view.bottom > 0 && !document.hidden && !root.closest("[inert]");
      build();
      // Hold a deferred initial fragment through upstream/font preparation only
      // until the visitor gives navigation input. No timer or scroll loop is used.
      if (initialAnchor) { honorInitialAnchor(); return; }
      // A visible first panel below the introduction must not turn an anchor
      // arrival into a jump straight to the pin when lazy enhancement resolves.
      if (readingIntro) {
        window.scrollBy({ top: introduction.getBoundingClientRect().top - introBefore.top, behavior: "instant" });
        return;
      }
      if (!reading) return;
      if (horizontal) {
        const panel = measurements[index];
        const progress = Math.max(0, Math.min(1, (panel.left + panel.width / 2 - windowElement.clientWidth / 2) / distance()));
        const trigger = horizontal.scrollTrigger;
        window.scrollTo({ top: trigger.start + (trigger.end - trigger.start) * progress, behavior: "instant" });
        trigger.update(); horizontal.progress(progress); syncHorizontal();
      } else {
        window.scrollBy({ top: panels[index].getBoundingClientRect().top - before.top, behavior: "instant" });
      }
    };
    const queue = () => {
      if (disposed || frame) return;
      frame = requestAnimationFrame(() => { frame = 0; rebuild(); });
    };
    const focus = (event) => {
      if (!horizontal) return;
      const index = panels.indexOf(event.target.closest("[data-project]"));
      if (index < 0) return;
      windowElement.scrollLeft = 0;
      const panel = measurements[index];
      const progress = Math.max(0, Math.min(1, (panel.left + panel.width / 2 - windowElement.clientWidth / 2) / distance()));
      const trigger = horizontal.scrollTrigger;
      window.scrollTo({ top: trigger.start + (trigger.end - trigger.start) * progress, behavior: "instant" });
      trigger.update(); horizontal.progress(progress); syncHorizontal();
    };
    const visibility = () => { if (document.hidden) clear(); else queue(); };
    const resize = new ResizeObserver(() => { if (sizeKey !== size() || layoutKey !== layout()) queue(); });
    [root, ...predecessors].forEach((section) => resize.observe(section));
    const inert = new MutationObserver(queue);
    [root.closest("main"), root.closest(".portfolio-page")].filter(Boolean).forEach((node) => inert.observe(node, { attributes: true, attributeFilter: ["inert"] }));
    desktop.addEventListener("change", queue); reduced.addEventListener("change", queue);
    window.addEventListener("resize", queue); window.addEventListener("pageshow", queue);
    document.addEventListener("visibilitychange", visibility); root.addEventListener("focusin", focus);
    root.addEventListener("load", queue, true); root.addEventListener("error", queue, true);
    document.fonts?.addEventListener("loadingdone", queue); document.fonts?.addEventListener("loadingerror", queue);
    document.fonts?.ready.then(() => { if (!disposed) queue(); });
    if (initialAnchor) anchorInputs.forEach((name) => window.addEventListener(name, stopInitialAnchor, { passive: true }));
    build();
    honorInitialAnchor();
    return () => {
      disposed = true; stopInitialAnchor(); cancelAnimationFrame(frame); clear(); resize.disconnect(); inert.disconnect();
      desktop.removeEventListener("change", queue); reduced.removeEventListener("change", queue);
      window.removeEventListener("resize", queue); window.removeEventListener("pageshow", queue);
      document.removeEventListener("visibilitychange", visibility); root.removeEventListener("focusin", focus);
      root.removeEventListener("load", queue, true); root.removeEventListener("error", queue, true);
      document.fonts?.removeEventListener("loadingdone", queue); document.fonts?.removeEventListener("loadingerror", queue);
      if (originalMode === null) root.removeAttribute("data-projects-mode"); else root.setAttribute("data-projects-mode", originalMode);
    };
  }, [rootRef, enabled]);
}
