import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";

// Entrance, glyph response, and artwork motion own separate nested layers.
function attachInteraction(root, fontReady, finePointer) {
  const heading = root.querySelector(".hero-v2__headline");
  const style = getComputedStyle(root);
  const paper = style.getPropertyValue("--color-ivory").trim();
  const orange = style.getPropertyValue("--color-orange").trim();
  const glyphs = [...root.querySelectorAll(".hero-v2__glyph")].map((node) => ({
    node, mix: 0, target: 0, original: node.getAttribute("style"),
    weight: Number(node.dataset.weight), width: Number(node.dataset.width),
    color: gsap.utils.interpolate(node.textContent === "." ? orange : paper, node.textContent === "." ? paper : orange),
  }));
  let frame = 0;
  let point = null;
  let scrollDirty = true;
  let documentTop;
  let scrollRange;
  let reach;
  let moveX, moveY, scrollY, rule, gridX, gridY;
  let fragments = [];
  let failure;
  const restore = (glyph) => {
    if (glyph.original === null) glyph.node.removeAttribute("style");
    else glyph.node.setAttribute("style", glyph.original);
  };
  const context = gsap.context(() => {}, root);
  context.add(() => {
    try {
      for (const glyph of glyphs) {
        glyph.to = gsap.quickTo(glyph, "mix", {
          duration: 0.32, ease: "power3.out",
          onUpdate: () => {
            const influence = glyph.mix;
            if (fontReady) glyph.node.style.fontVariationSettings = `"wght" ${glyph.weight + (glyph.weight === 500 ? 300 : -300) * influence}, "wdth" ${glyph.width}`;
            glyph.node.style.transform = `translateY(${-6 * influence}px)`;
            glyph.node.style.color = glyph.color(influence);
          },
          onComplete: () => { if (glyph.target === 0) restore(glyph); },
        });
      }
      const artwork = root.querySelector(".hero-v2__art-pointer");
      const svg = [...artwork.querySelectorAll("svg")].find((node) => getComputedStyle(node).display !== "none");
      if (finePointer) fragments = [...svg.querySelectorAll("[data-art-fragment]")].map((node) => ({
        x: gsap.quickTo(node, "x", { duration: 0.6, ease: "power3.out" }),
        y: gsap.quickTo(node, "y", { duration: 0.6, ease: "power3.out" }),
        factor: node.dataset.artFragment === "corner" ? 3 : node.dataset.artFragment === "grid" ? -3 : -2,
      }));
      const grid = svg.querySelector("[data-art-scroll]");
      if (grid) {
        gridX = gsap.quickTo(grid, "x", { duration: 0.4, ease: "power2.out" });
        gridY = gsap.quickTo(grid, "y", { duration: 0.4, ease: "power2.out" });
      }
      moveX = gsap.quickTo(artwork, "x", { duration: 0.5, ease: "power3.out" });
      moveY = gsap.quickTo(artwork, "y", { duration: 0.5, ease: "power3.out" });
      scrollY = gsap.quickTo(".hero-v2__art-scroll", "y", { duration: 0.3, ease: "power2.out" });
      rule = gsap.quickTo(".hero-v2__scroll-rule", "scaleX", { duration: 0.3, ease: "power2.out" });
    } catch (error) { failure = error; }
  });
  if (failure) { context.revert(); throw failure; }

  const reset = (immediate = false) => {
    point = null;
    for (const glyph of glyphs) {
      glyph.target = 0;
      if (immediate) { glyph.to.tween.pause(); glyph.mix = 0; restore(glyph); }
      else { glyph.to.tween.duration(0.52); glyph.to(0); }
    }
    moveX(0); moveY(0);
    fragments.forEach((fragment) => { fragment.x(0); fragment.y(0); });
  };
  const measure = () => {
    reset(true);
    const box = heading.getBoundingClientRect();
    const hero = root.getBoundingClientRect();
    documentTop = hero.top + window.scrollY;
    scrollRange = Math.max(120, hero.height * 0.35);
    reach = Math.max(110, Math.min(380, parseFloat(getComputedStyle(heading).fontSize) * 1.25));
    for (const glyph of glyphs) {
      const cell = glyph.node.closest(".hero-v2__cell").getBoundingClientRect();
      Object.assign(glyph, { x: cell.left - box.left + cell.width / 2, y: cell.top - box.top + cell.height / 2, cellWidth: cell.width, cellHeight: cell.height });
    }
  };
  const flush = () => {
    frame = 0;
    if (root.closest("[inert]")) return;
    if (point) {
      const box = heading.getBoundingClientRect();
      for (const glyph of glyphs) {
        const dx = Math.max(0, Math.abs(point.x - box.left - glyph.x) - glyph.cellWidth * 0.22);
        const dy = Math.max(0, Math.abs(point.y - box.top - glyph.y) - glyph.cellHeight * 0.35);
        const proximity = Math.max(0, 1 - Math.hypot(dx / reach, dy / (glyph.cellHeight * 0.35)));
        const target = proximity * proximity * (3 - 2 * proximity);
        if (Math.abs(target - glyph.target) < 0.004) continue;
        glyph.target = target;
        glyph.to.tween.duration(target === 0 ? 0.52 : 0.32);
        glyph.to(target);
      }
      const horizontal = gsap.utils.clamp(-1, 1, (point.x - box.left - box.width / 2) / box.width * 2);
      const vertical = gsap.utils.clamp(-1, 1, (point.y - box.top - box.height / 2) / box.height * 2);
      moveX(horizontal * 5);
      moveY(vertical * 3);
      fragments.forEach((fragment) => { fragment.x(horizontal * fragment.factor); fragment.y(vertical * fragment.factor * 0.75); });
      point = null;
    }
    if (scrollDirty) {
      const progress = gsap.utils.clamp(0, 1, (window.scrollY - Math.max(0, documentTop - innerHeight * 0.12)) / scrollRange);
      scrollY(-14 * progress);
      gridX?.(8 * progress);
      gridY?.(-4 * progress);
      rule(0.35 + 0.65 * progress);
      scrollDirty = false;
    }
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(flush); };
  const onPointer = (event) => {
    if (event.pointerType !== "mouse" || event.buttons || !window.getSelection()?.isCollapsed) return;
    point = { x: event.clientX, y: event.clientY };
    schedule();
  };
  const onLeave = () => reset();
  const onDown = () => reset(true);
  const onScroll = () => { scrollDirty = true; schedule(); };
  const onResize = () => { measure(); onScroll(); };
  const cleanup = () => {
    cancelAnimationFrame(frame);
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onResize);
    root.removeEventListener("pointermove", onPointer);
    root.removeEventListener("pointerleave", onLeave);
    root.removeEventListener("pointerdown", onDown);
    context.revert();
    glyphs.forEach(restore);
  };
  try {
    measure();
    schedule();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    if (finePointer) {
      root.addEventListener("pointermove", onPointer, { passive: true });
      root.addEventListener("pointerleave", onLeave);
      root.addEventListener("pointerdown", onDown, { passive: true });
    }
    return cleanup;
  } catch (error) { cleanup(); throw error; }
}

export default function useHeroMotion(rootRef, autoPlay = true) {
  const controllerRef = useRef(null);
  const play = useCallback(() => controllerRef.current?.play(), []);
  const restart = useCallback(() => controllerRef.current?.restart(), []);
  const finish = useCallback(() => controllerRef.current?.finish(), []);
  const controls = useMemo(() => ({ play, restart, finish }), [play, restart, finish]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const main = root.closest("main");
    const page = root.closest(".portfolio-page");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const artworkLayout = window.matchMedia("(min-width: 48rem)");
    const previousState = root.getAttribute("data-v2-motion");
    const previousFont = root.getAttribute("data-type-font");
    let disposed = false;
    let started = false;
    let settled = false;
    let fontReady = false;
    let generation = 0;
    let entrance;
    let detach;
    let preparation;
    let timer;
    let cancelFontWait;
    let watchdog;
    let inView = true;
    let width = root.clientWidth;

    const detachInteraction = () => { detach?.(); detach = null; };
    const activate = () => {
      detachInteraction();
      if (disposed || !settled || !inView || reduced.matches || document.hidden || root.closest("[inert]")) return;
      try { detach = attachInteraction(root, fontReady, pointer.matches); }
      catch (error) { console.warn("Hero interaction unavailable; keeping the static composition.", error); }
    };
    const prepare = () => {
      if (preparation) return preparation;
      preparation = (async () => {
        const deadline = new Promise((resolve) => { cancelFontWait = resolve; timer = setTimeout(resolve, 600); });
        try {
          const fonts = document.fonts
            ? Promise.allSettled([document.fonts.load('500 16px "AJ Anybody"', "AMAL JITH."), document.fonts.load('800 16px "AJ Anybody"', "AMAL JITH.")])
            : Promise.resolve();
          await Promise.race([fonts, deadline]);
          if (disposed) return;
          fontReady = !!document.fonts && [...document.fonts].some((face) => face.family.replace(/["']/g, "") === "AJ Anybody" && face.status === "loaded");
        } catch { fontReady = false; }
        finally { clearTimeout(timer); }
        if (!disposed) root.dataset.typeFont = fontReady ? "ready" : "fallback";
      })();
      return preparation;
    };
    const settle = () => {
      if (disposed) return;
      generation += 1;
      started = true;
      settled = true;
      clearTimeout(watchdog);
      entrance?.revert(); entrance = null;
      root.dataset.v2Motion = reduced.matches ? "reduced" : "ready";
      activate();
    };
    const start = async () => {
      if (disposed || started || settled) return;
      if (reduced.matches || main.inert || document.hidden || !inView) { settle(); return; }
      started = true;
      // Synchronous preparation masks prevent a flash when the preloader uncovers us.
      root.dataset.v2Motion = "preparing";
      watchdog = setTimeout(settle, 3500);
      const run = ++generation;
      try {
        await prepare();
        if (disposed || run !== generation) return;
        if (reduced.matches || main.inert || document.hidden || !inView) { settle(); return; }
        entrance = gsap.context(() => {}, root);
        let failure;
        entrance.add(() => {
          try {
            const timeline = gsap.timeline({ paused: true, onComplete: settle, defaults: { ease: "power3.out" } });
            const words = root.querySelectorAll(".hero-v2__word");
            words.forEach((word, index) => {
              timeline.fromTo(word.querySelectorAll(".hero-v2__reveal"), { yPercent: index ? -112 : 112 }, {
                yPercent: 0, duration: index ? 0.9 : 0.85, stagger: 0.045, ease: "expo.out",
              }, index ? 0.38 : 0.12);
            });
            const lines = [...root.querySelectorAll("[data-art-draw]")];
            const lengths = lines.map((line) => line.getTotalLength());
            timeline.fromTo(root.querySelectorAll('[data-v2-fragment="plane"]'), { x: -48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.75 }, 0.05)
              .fromTo(root.querySelectorAll('[data-v2-fragment="cut"]'), { x: 36, y: -20, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 0.7 }, 0.3)
              .fromTo(root.querySelectorAll('[data-v2-fragment="bridge"]'), { x: -24, y: 24, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 0.75 }, 0.48)
              .fromTo(lines, { strokeDasharray: (index) => lengths[index], strokeDashoffset: (index) => lengths[index] }, { strokeDashoffset: 0, duration: 0.8, stagger: 0.025, ease: "power2.inOut" }, 0.18)
              .fromTo(root.querySelectorAll("[data-v2-ui]"), { x: 14, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, stagger: 0.08 }, 0.72);
            root.dataset.v2Motion = "playing";
            timeline.play(0);
          } catch (error) { failure = error; }
        });
        if (failure) throw failure;
      } catch (error) {
        if (!disposed) { settle(); console.warn("Hero entrance unavailable; displaying the composition.", error); }
      }
    };
    const replay = () => {
      if (disposed) return;
      generation += 1;
      clearTimeout(watchdog);
      detachInteraction(); entrance?.revert(); entrance = null;
      started = false; settled = false;
      void start();
    };
    const onMotion = () => { if (reduced.matches) settle(); else activate(); };
    const onFocus = () => { if (!settled) settle(); };
    const onVisibility = () => { if (document.hidden) settle(); else activate(); };
    const onResize = () => { if (Math.abs(root.clientWidth - width) > 1 && entrance) settle(); width = root.clientWidth; };
    const observer = new MutationObserver(() => {
      // Main is isolated by the mobile menu; page inertness belongs to the
      // preloader and must permit its controlled entrance handoff before unlock.
      if (main.inert && started && !settled) settle();
      else activate();
    });
    observer.observe(main, { attributes: true, attributeFilter: ["inert"] });
    if (page) observer.observe(page, { attributes: true, attributeFilter: ["inert"] });
    const viewObserver = new IntersectionObserver(([entry]) => {
      if (disposed || !entry) return;
      inView = entry.isIntersecting;
      if (!inView && started && !settled) settle();
      else activate();
    });
    viewObserver.observe(root);
    root.dataset.typeFont = "pending";
    root.dataset.v2Motion = reduced.matches ? "reduced" : "waiting";
    const controller = { play: start, restart: replay, finish: settle, prepare };
    controllerRef.current = controller;
    reduced.addEventListener("change", onMotion);
    pointer.addEventListener("change", activate);
    artworkLayout.addEventListener("change", activate);
    document.addEventListener("visibilitychange", onVisibility);
    root.addEventListener("focusin", onFocus);
    window.addEventListener("resize", onResize);

    return () => {
      disposed = true;
      generation += 1;
      clearTimeout(timer); clearTimeout(watchdog); cancelFontWait?.();
      detachInteraction(); entrance?.revert();
      observer.disconnect();
      viewObserver.disconnect();
      reduced.removeEventListener("change", onMotion);
      pointer.removeEventListener("change", activate);
      artworkLayout.removeEventListener("change", activate);
      document.removeEventListener("visibilitychange", onVisibility);
      root.removeEventListener("focusin", onFocus);
      window.removeEventListener("resize", onResize);
      if (previousState === null) root.removeAttribute("data-v2-motion"); else root.setAttribute("data-v2-motion", previousState);
      if (previousFont === null) root.removeAttribute("data-type-font"); else root.setAttribute("data-type-font", previousFont);
      if (controllerRef.current === controller) controllerRef.current = null;
    };
  }, [rootRef]);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      // Warm fonts under the preloader without playing or masking the entrance.
      void controllerRef.current?.prepare();
      if (autoPlay) void controllerRef.current?.play();
    });
    return () => { cancelled = true; };
  }, [autoPlay]);
  return controls;
}

