import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

const fontGroups = [
  { token: "--font-hero-name", family: "AJ Anybody", queries: ['900 16px "AJ Anybody"'] },
  { token: "--font-hero-role", family: "AJ Anybody Role", queries: ['900 16px "AJ Anybody Role"', '500 16px "AJ Anybody Role"'] },
  { token: "--font-mono", family: "Kode Mono", queries: ['400 16px "Kode Mono"'] },
  { token: "--font-body", family: "Space Grotesk", queries: ['400 16px "Space Grotesk"'] },
];

// Keep fallback metrics for this Hero's lifetime if a face misses the deadline.
// This is local to the Hero; the site's font configuration remains unchanged.
function stabilizeFonts(root) {
  const styles = getComputedStyle(root);
  const faces = document.fonts ? [...document.fonts] : [];
  const saved = [];
  for (const { token, family, queries } of fontGroups) {
    const loaded = faces.some((face) => face.family.replace(/["']/g, "") === family && face.status === "loaded")
      && queries.every((query) => document.fonts.check(query));
    if (loaded) continue;
    const stack = styles.getPropertyValue(token).trim();
    const fallback = stack.slice(stack.indexOf(",") + 1).trim();
    if (!fallback || fallback === stack) continue;
    saved.push([token, root.style.getPropertyValue(token), root.style.getPropertyPriority(token)]);
    root.style.setProperty(token, fallback);
  }
  return () => saved.forEach(([token, value, priority]) => {
    if (value) root.style.setProperty(token, value, priority);
    else root.style.removeProperty(token);
  });
}

// Called inside the owning context. Every moving target has exactly one owner.
function createEntrance(root, onComplete) {
  const find = (selector) => root.querySelector(selector);
  const all = (selector) => [...root.querySelectorAll(selector)];
  // Persistent React cells retain their advances while the inner font varies.
  // Entrance owns outer reveal transforms; fluid typography owns inner axes/scale.
  const names = all(".hero__name").map((name) => [...name.querySelectorAll(".hero__char")]);
  const timeline = gsap.timeline({ paused: true, defaults: { ease: "power3.out" }, onComplete });
  timeline.addLabel("amal", 0).addLabel("jith", 0.22).addLabel("geometry", 0.38)
    .addLabel("identity", 0.62).addLabel("copy", 0.96)
    .addLabel("cta", 1.3).addLabel("footer", 1.66);

  names.forEach((characters, index) => {
    timeline.fromTo(characters, { yPercent: 125 }, {
      yPercent: 0, duration: 0.82, stagger: 0.04,
    }, index === 0 ? "amal" : "jith");
  });

  const graphic = find(".hero__geometry");
  if (graphic.getBoundingClientRect().width > 0) {
    all(".hero__geometry path").forEach((path, index) => {
      // Non-scaling strokes use screen-space dash lengths, including SVG scaling.
      const matrix = path.getScreenCTM();
      const length = path.getTotalLength() * (matrix ? Math.hypot(matrix.a, matrix.b) : 1);
      timeline.fromTo(path, { strokeDasharray: length, strokeDashoffset: length }, {
        strokeDashoffset: 0, duration: 0.6, ease: "power2.inOut",
      }, `geometry+=${index * 0.12}`);
    });
    timeline.fromTo(all(".hero__geometry rect"), { opacity: 0 }, {
      opacity: 1, duration: 0.2, stagger: 0.035,
    }, "geometry+=0.52");
  }

  timeline.fromTo(find(".hero__role-text"), { yPercent: 125 }, {
    yPercent: 0, duration: 0.65,
  }, "identity");
  timeline.fromTo(find(".hero__role-detail"), { y: 10, opacity: 0 }, {
    y: 0, opacity: 1, duration: 0.65,
  }, "identity+=0.18");

  SplitText.create(find(".hero__description"), {
    type: "lines", mask: "lines", tag: "span", linesClass: "hero__line", aria: "auto", autoSplit: true,
    onSplit(split) {
      // Returning the child tween lets SplitText preserve its time if lines reflow.
      const reveal = gsap.fromTo(split.lines, { yPercent: 110 }, {
        yPercent: 0, duration: 0.58, stagger: { amount: 0.12 }, ease: "power3.out", paused: true,
      });
      timeline.add(reveal, "copy");
      reveal.paused(false);
      return reveal;
    },
  });

  timeline.fromTo(find(".hero__cta-label"), { yPercent: 110 }, {
    yPercent: 0, duration: 0.5,
  }, "cta");
  timeline.fromTo(find(".hero__cta-arrow-entrance"), { x: -3, y: 4, opacity: 0 }, {
    x: 0, y: 0, opacity: 1, duration: 0.45,
  }, "cta+=0.09");
  timeline.fromTo(find(".hero__cta-rule"), { scaleX: 0, transformOrigin: "left center" }, {
    scaleX: 1, duration: 0.55,
  }, "cta+=0.02");
  timeline.fromTo(find(".hero__divider"), { scaleX: 0, transformOrigin: "left center" }, {
    scaleX: 1, duration: 0.5, ease: "power2.out",
  }, "footer");
  timeline.fromTo(all(".hero__footer > p"), { y: 6, opacity: 0 }, {
    y: 0, opacity: 1, duration: 0.4, stagger: 0.08,
  }, "footer+=0.14");
  return timeline;
}

export default function useHeroEntrance(rootRef, autoPlay, resetTypography) {
  const controllerRef = useRef(null);
  const initialAutoPlay = useRef(autoPlay);
  const play = useCallback(() => controllerRef.current?.play(), []);
  const restart = useCallback(() => controllerRef.current?.restart(), []);
  const finish = useCallback(() => controllerRef.current?.finish(), []);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const previousState = root.getAttribute("data-hero-motion");
    let disposed = false;
    let played = false;
    let requested = false;
    let generation = 0;
    let context;
    let timeline;
    let fontPromise;
    let fontTimer;
    let cancelFontWait;
    let watchdog;
    let restoreFonts;
    let width = root.getBoundingClientRect().width;

    const release = () => {
      const owned = context;
      context = timeline = null;
      // SplitText participates in context reversion, restoring text and observers.
      owned?.revert();
    };
    const settle = () => {
      resetTypography();
      generation += 1;
      played = true;
      requested = false;
      clearTimeout(watchdog);
      release();
      root.dataset.heroMotion = motion.matches ? "reduced" : "settled";
    };
    const fontsReady = () => {
      if (!fontPromise) {
        const timeout = new Promise((resolve) => {
          cancelFontWait = resolve;
          fontTimer = setTimeout(resolve, 800);
        });
        const loaded = document.fonts
          ? Promise.allSettled(fontGroups.flatMap(({ queries }) => queries.map((query) => document.fonts.load(query))))
            .then(() => document.fonts.ready)
          : Promise.resolve();
        fontPromise = Promise.race([loaded, timeout]).finally(() => clearTimeout(fontTimer));
      }
      return fontPromise;
    };
    const start = async () => {
      if (disposed || played || requested) return;
      if (motion.matches || root.contains(document.activeElement)) { settle(); return; }
      requested = true;
      resetTypography();
      const run = ++generation;
      // Default markup is readable; only this bounded preparation state hides it.
      clearTimeout(watchdog);
      watchdog = setTimeout(settle, 3600);
      root.dataset.heroMotion = "preparing";
      try {
        await fontsReady();
        if (disposed || run !== generation) return;
        if (motion.matches) { settle(); return; }
        restoreFonts ??= stabilizeFonts(root);
        context = gsap.context(() => {}, root);
        let failure;
        context.add(() => {
          // Catch inside add so GSAP can restore its current context on return.
          try { timeline = createEntrance(root, settle); }
          catch (error) { failure = error; }
        });
        if (failure) throw failure;
        played = true;
        root.dataset.heroMotion = "playing";
        timeline.play(0);
      } catch (error) {
        if (disposed || run !== generation) return;
        settle();
        console.warn("Hero entrance unavailable; displaying static content.", error);
      }
    };
    const controller = {
      play: start,
      restart() { settle(); played = false; return start(); },
      finish: settle,
    };
    controllerRef.current = controller;
    // Prepare before paint, but play from the passive effect below. StrictMode's
    // effect rehearsal then finishes before asynchronous font work can play.
    if (initialAutoPlay.current && !motion.matches) {
      watchdog = setTimeout(settle, 3600);
      root.dataset.heroMotion = "preparing";
    }
    const onMotionChange = () => { if (motion.matches) settle(); };
    const onFocus = () => { if (!played || context) settle(); };
    const observer = new ResizeObserver(() => {
      const nextWidth = root.getBoundingClientRect().width;
      // A viewport change settles immediately into native, unsplit wrapping.
      if (Math.abs(nextWidth - width) > 1 && context) settle();
      width = nextWidth;
    });
    observer.observe(root);
    motion.addEventListener("change", onMotionChange);
    root.addEventListener("focusin", onFocus);

    return () => {
      disposed = true;
      generation += 1;
      clearTimeout(watchdog);
      clearTimeout(fontTimer);
      cancelFontWait?.();
      observer.disconnect();
      motion.removeEventListener("change", onMotionChange);
      root.removeEventListener("focusin", onFocus);
      release();
      restoreFonts?.();
      if (previousState === null) root.removeAttribute("data-hero-motion");
      else root.setAttribute("data-hero-motion", previousState);
      if (controllerRef.current === controller) controllerRef.current = null;
    };
  }, [rootRef, resetTypography]);

  useEffect(() => { if (autoPlay) play(); }, [autoPlay, play]);
  return { play, restart, finish };
}
