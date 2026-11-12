import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

function preserveStyles(element, properties) {
  const saved = properties.map((property) => [property, element.style.getPropertyValue(property), element.style.getPropertyPriority(property)]);
  return () => saved.forEach(([property, value, priority]) => {
    if (value) element.style.setProperty(property, value, priority);
    else element.style.removeProperty(property);
  });
}

export default function usePreloader(rootRef, pageRef, heroRef, onComplete) {
  const controllerRef = useRef(null);
  const skip = useCallback(() => controllerRef.current?.finish(true), []);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const page = pageRef.current;
    const curtain = root.querySelector(".preloader__curtain");
    const body = document.body;
    const html = document.documentElement;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const x = window.scrollX;
    const y = window.scrollY;
    const previousInert = page.inert;
    const previousCover = page.getAttribute("data-intro-covered");
    const restoreBody = preserveStyles(body, ["position", "top", "left", "width", "overflow", "padding-right"]);
    const restoreHtml = preserveStyles(html, ["overflow", "scroll-behavior"]);
    let disposed = false;
    let completed = false;
    let handedOff = false;
    let unlocked = false;
    let context;
    let timeline;
    let watchdog;
    let setupError;
    let panelHeight;
    let panelBottom;
    let headingTop;

    const restoreCover = () => {
      if (previousCover === null) page.removeAttribute("data-intro-covered");
      else page.setAttribute("data-intro-covered", previousCover);
    };
    const unlock = () => {
      if (unlocked) return;
      unlocked = true;
      page.inert = previousInert;
      restoreCover();
      restoreBody();
      html.style.scrollBehavior = "auto";
      html.style.removeProperty("overflow");
      window.scrollTo(x, y);
      restoreHtml();
    };
    const handoff = () => {
      if (disposed || completed || handedOff) return;
      handedOff = true;
      restoreCover();
      // The existing Hero owns all of its animation and bounded font preparation.
      // Nothing in this timeline targets Hero, Navbar, or typography transforms.
      heroRef.current?.play();
      root.dataset.preloaderPhase = "handoff";
    };
    const measureClearance = () => {
      panelHeight = curtain.offsetHeight;
      // The rightmost step is the final edge to clear the heading. Use the full
      // panel bounds, plus 2px for fractional-size/offset rounding.
      panelBottom = curtain.offsetTop + panelHeight + 2;
      headingTop = Math.max(0, Math.min(root.clientHeight,
        page.querySelector("[data-hero-heading]")?.getBoundingClientRect().top ?? 0));
    };
    const checkHandoff = () => {
      if (disposed || completed || handedOff) return;
      // Cached geometry + GSAP's cached transform avoid per-frame layout reads.
      const bottom = panelBottom + panelHeight * gsap.getProperty(curtain, "yPercent") / 100;
      if (bottom <= headingTop) handoff();
    };
    const finish = (immediate = false) => {
      if (disposed || completed) return;
      const restoreFocus = root.contains(document.activeElement);
      if (immediate) {
        handedOff = true;
        heroRef.current?.finish();
      } else handoff();
      completed = true;
      clearTimeout(watchdog);
      timeline?.pause();
      root.style.visibility = "hidden";
      root.style.pointerEvents = "none";
      unlock();
      if (restoreFocus) page.querySelector("main")?.focus({ preventScroll: true });
      onComplete();
    };
    const onMotion = () => { if (motion.matches) finish(true); };
    const onKey = (event) => { if (event.key === "Escape") finish(true); };
    const onVisibility = () => { if (document.hidden) finish(true); };
    // BFCache may freeze before visibilitychange; restore a usable page either way.
    const onPageHide = () => finish(true);
    const onPageShow = (event) => { if (event.persisted) finish(true); };
    const controller = { finish, play: () => {
      if (disposed || completed) return;
      if (setupError) {
        console.warn("Opening sequence unavailable; displaying the portfolio.", setupError);
        finish(true);
      } else if (motion.matches || document.hidden) finish(true);
      else timeline?.play(0);
    } };
    controllerRef.current = controller;

    try {
      page.inert = true;
      page.setAttribute("data-intro-covered", "");
      const scrollbar = window.innerWidth - html.clientWidth;
      body.style.paddingRight = `${parseFloat(getComputedStyle(body).paddingRight) + scrollbar}px`;
      Object.assign(body.style, { position: "fixed", top: `${-y}px`, left: `${-x}px`, width: "100%", overflow: "hidden" });
      html.style.overflow = "hidden";
      watchdog = setTimeout(() => finish(true), 4200);
      motion.addEventListener("change", onMotion);
      document.addEventListener("keydown", onKey);
      document.addEventListener("visibilitychange", onVisibility);
      window.addEventListener("pagehide", onPageHide);
      window.addEventListener("pageshow", onPageShow);
      window.addEventListener("resize", measureClearance);
      measureClearance();
      if (!motion.matches && !document.hidden) {
        context = gsap.context(() => {}, root);
        let failure;
        context.add(() => {
          // Catch inside add, allowing GSAP to restore its current context even if
          // an SVG measurement fails partway through setup.
          try {
            const logo = root.querySelectorAll(".preloader__logo path");
            const construction = [...root.querySelectorAll("[data-intro-line]")];
            const lengths = construction.map((path) => path.getTotalLength());
            logo.forEach((path) => {
              const length = path.getTotalLength();
              gsap.set(path, { fillOpacity: 0, strokeDasharray: length, strokeDashoffset: length });
            });
            // Own percentage translation explicitly; the stepped silhouette is
            // static, so its only full-screen animation is this one transform.
            gsap.set(curtain, { y: 0, yPercent: 100 });
            timeline = gsap.timeline({ paused: true, onComplete: () => finish() })
              .addLabel("draw", 0)
              .addLabel("hold", 1.08)
              .addLabel("curtain", 1.28)
              .addLabel("exit", 1.86)
              .fromTo(construction, { strokeDasharray: (index) => lengths[index], strokeDashoffset: (index) => lengths[index] }, { strokeDashoffset: 0, duration: 0.38, stagger: 0.045, ease: "power2.inOut" }, 0)
              .to(logo, { strokeDashoffset: 0, duration: 0.78, stagger: 0.085, ease: "power2.inOut" }, 0.12)
              .to(logo, { fillOpacity: 1, strokeOpacity: 0, duration: 0.28, ease: "power2.out" }, 0.8)
              .to(".preloader__progress", { scaleX: 1, duration: 0.95, ease: "power2.inOut" }, 0.1)
              .call(() => { root.dataset.preloaderPhase = "hold"; }, [], "hold")
              .to(".preloader__progress", { opacity: 0.65, duration: 0.16 }, "hold")
              .call(() => { root.dataset.preloaderPhase = "cover"; }, [], "curtain")
              .to(".preloader__scene", { opacity: 0, y: -12, duration: 0.22 }, "curtain")
              .to(curtain, { yPercent: 0, duration: 0.58, ease: "power3.inOut" }, "curtain")
              // Clear the base only after the solid orange shape covers all
              // viewport corners. Hero remains covered until the geometric handoff.
              .set(root, { backgroundColor: "transparent" }, "exit")
              .call(() => { root.dataset.preloaderPhase = "reveal"; }, [], "exit")
              .to(curtain, { yPercent: -100, duration: 0.78, ease: "sine.inOut", onUpdate: checkHandoff }, "exit")
              .to(".preloader__actions", { yPercent: -100, duration: 0.78, ease: "sine.inOut" }, "exit");
          } catch (error) { failure = error; }
        });
        if (failure) throw failure;
      }
    } catch (error) {
      // The passive start commits fallback only after StrictMode's rehearsal.
      setupError = error;
    }

    return () => {
      disposed = true;
      clearTimeout(watchdog);
      motion.removeEventListener("change", onMotion);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onPageHide);
      window.removeEventListener("pageshow", onPageShow);
      window.removeEventListener("resize", measureClearance);
      context?.revert();
      unlock();
      // finish() hides immediately; StrictMode's rehearsal must restore visibility.
      root.style.removeProperty("visibility");
      root.style.removeProperty("pointer-events");
      if (controllerRef.current === controller) controllerRef.current = null;
    };
  }, [rootRef, pageRef, heroRef, onComplete]);

  // Defer beyond StrictMode's effect rehearsal, including the immediate fallback.
  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => { if (!cancelled) controllerRef.current?.play(); });
    return () => { cancelled = true; };
  }, []);
  return skip;
}
