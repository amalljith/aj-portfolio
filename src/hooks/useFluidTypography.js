import { useCallback, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

export const fluidTypeRange = {
  resting: { weight: 900, width: 55, scale: 1 },
  active: { weight: 300, width: 68, scale: 0.95 },
};
const { resting, active } = fluidTypeRange;

export default function useFluidTypography(rootRef) {
  const detachRef = useRef(null);
  // Entrance controls reset synchronously, before any reveal is rebuilt or settled.
  const reset = useCallback(() => {
    detachRef.current?.();
    detachRef.current = null;
  }, []);

  useLayoutEffect(() => {
    const hero = rootRef.current;
    const root = hero.querySelector(".hero__title");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let disposed = false;
    let fontReady = false;
    let fontFailed = false;
    const previousFont = hero.getAttribute("data-hero-font");
    hero.dataset.heroFont = "loading";

    const attach = () => {
      const characters = [...root.querySelectorAll(".hero__glyph")].map((node) => ({
        node, ...resting, target: { ...resting }, original: node.getAttribute("style"),
      }));
      let point;
      let dirty = false;
      let ticking = false;
      let returning = false;
      let activeTouch = null;
      let reach;

      const restore = () => characters.forEach(({ node, original }) => {
        if (!original) node.removeAttribute("style");
        else node.setAttribute("style", original);
      });
      const stop = () => { gsap.ticker.remove(tick); ticking = false; };
      function tick(_time, deltaMs) {
        if (dirty && point) {
          const bounds = root.getBoundingClientRect();
          characters.forEach((character) => {
            const dx = Math.max(0, Math.abs(point.x - bounds.left - character.x) - character.cellWidth * 0.3);
            const dy = Math.max(0, Math.abs(point.y - bounds.top - character.y) - character.cellHeight * 0.42);
            const proximity = Math.max(0, 1 - Math.hypot(dx / reach, dy / (character.cellHeight * 0.18)));
            const influence = proximity * proximity * (3 - 2 * proximity);
            for (const axis of ["weight", "width", "scale"]) {
              character.target[axis] = resting[axis] + (active[axis] - resting[axis]) * influence;
            }
          });
          dirty = false;
        }
        // Frame-rate independent damping: ~255ms approach / ~450ms return to 95%.
        const blend = 1 - Math.exp(-Math.min(deltaMs, 64) / (returning ? 150 : 85));
        let settled = true;
        characters.forEach((character) => {
          for (const axis of ["weight", "width", "scale"]) {
            character[axis] += (character.target[axis] - character[axis]) * blend;
            const tolerance = axis === "weight" ? 0.08 : axis === "width" ? 0.004 : 0.00002;
            if (Math.abs(character.target[axis] - character[axis]) > tolerance) settled = false;
            else character[axis] = character.target[axis];
          }
          character.node.style.fontVariationSettings = `"wght" ${character.weight.toFixed(2)}, "wdth" ${character.width.toFixed(3)}`;
          // Only this inner glyph owns scale; the reveal transforms its parent.
          character.node.style.transform = `scale(${character.scale.toFixed(5)})`;
        });
        if (settled) { stop(); if (returning) restore(); }
      }
      const start = () => { if (!ticking) { ticking = true; gsap.ticker.add(tick); } };
      const resetCharacters = (immediate = false) => {
        point = null;
        dirty = false;
        activeTouch = null;
        returning = true;
        characters.forEach((character) => {
          character.target = { ...resting };
          if (immediate) Object.assign(character, resting);
        });
        if (immediate) { stop(); restore(); } else start();
      };
      const measure = () => {
        resetCharacters(true);
        const bounds = root.getBoundingClientRect();
        reach = Math.max(85, Math.min(280, parseFloat(getComputedStyle(root).fontSize) * 0.9));
        characters.forEach((character) => {
          const box = character.node.closest(".hero__char-mask").getBoundingClientRect();
          character.x = box.left - bounds.left + box.width / 2;
          character.y = box.top - bounds.top + box.height / 2;
          character.cellWidth = box.width;
          character.cellHeight = box.height;
        });
      };
      const track = (event) => {
        point = { x: event.clientX, y: event.clientY };
        returning = false;
        dirty = true;
        start();
      };
      const onDown = (event) => {
        if (event.pointerType === "mouse") { resetCharacters(true); return; }
        if (activeTouch !== null) return;
        activeTouch = event.pointerId;
        track(event);
      };
      const onMove = (event) => {
        if (event.pointerType !== "mouse") {
          if (activeTouch === event.pointerId) track(event);
          return;
        }
        const selection = getSelection();
        if (event.buttons || (!selection?.isCollapsed && selection?.containsNode(root, true))) {
          resetCharacters(true);
          return;
        }
        track(event);
      };
      const onLeave = (event) => { if (event.pointerType === "mouse") resetCharacters(); };
      const onEnd = (event) => { if (event.pointerId === activeTouch) resetCharacters(); };
      const onBlur = () => resetCharacters(true);
      const onVisibility = () => { if (document.hidden) resetCharacters(true); };
      measure();
      const resize = new ResizeObserver(measure);
      resize.observe(root);
      root.addEventListener("pointerdown", onDown, { passive: true });
      root.addEventListener("pointermove", onMove, { passive: true });
      root.addEventListener("pointerleave", onLeave, { passive: true });
      window.addEventListener("pointerup", onEnd, { passive: true });
      window.addEventListener("pointercancel", onEnd, { passive: true });
      window.addEventListener("blur", onBlur);
      document.addEventListener("visibilitychange", onVisibility);
      return () => {
        resetCharacters(true);
        resize.disconnect();
        root.removeEventListener("pointerdown", onDown);
        root.removeEventListener("pointermove", onMove);
        root.removeEventListener("pointerleave", onLeave);
        window.removeEventListener("pointerup", onEnd);
        window.removeEventListener("pointercancel", onEnd);
        window.removeEventListener("blur", onBlur);
        document.removeEventListener("visibilitychange", onVisibility);
      };
    };
    const reconcile = () => {
      reset();
      const settled = ["settled", "reduced"].includes(hero.dataset.heroMotion);
      const usingAnybody = getComputedStyle(root).fontFamily.includes("AJ Anybody");
      hero.dataset.heroFont = fontReady && usingAnybody ? "ready"
        : fontFailed || !usingAnybody ? "fallback" : "loading";
      if (!disposed && fontReady && usingAnybody && settled && !reduced.matches) {
        detachRef.current = attach();
      }
    };
    const observer = new MutationObserver(reconcile);
    observer.observe(hero, { attributes: true, attributeFilter: ["data-hero-motion"] });
    reduced.addEventListener("change", reconcile);
    // Reuse the CSS face and browser request cache; never register duplicate faces.
    document.fonts?.load('900 16px "AJ Anybody"', "AMAL JITH.").then((faces) => {
      if (disposed) return;
      fontReady = faces.some((face) => face.status === "loaded");
      reconcile();
    }).catch(() => {
      if (disposed) return;
      fontFailed = true;
      reconcile();
    });
    return () => {
      disposed = true;
      observer.disconnect();
      reduced.removeEventListener("change", reconcile);
      reset();
      if (previousFont === null) hero.removeAttribute("data-hero-font");
      else hero.setAttribute("data-hero-font", previousFont);
    };
  }, [rootRef, reset]);
  return reset;
}
