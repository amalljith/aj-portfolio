import { useCallback, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

export const fluidTypeRange = {
  resting: { weight: 900, width: 62 },
  active: { weight: 100, width: 76 },
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

    const attach = () => {
      const characters = [...root.querySelectorAll(".hero__glyph")].map((node) => ({
        node, ...resting, target: { ...resting },
        original: node.style.getPropertyValue("font-variation-settings"),
        priority: node.style.getPropertyPriority("font-variation-settings"),
      }));
      let point;
      let dirty = false;
      let ticking = false;
      let returning = false;
      let activeTouch = null;
      let horizontalReach;

      const write = (character) => {
        character.node.style.fontVariationSettings = `"wght" ${character.weight.toFixed(2)}, "wdth" ${character.width.toFixed(3)}`;
      };
      const restore = () => characters.forEach((character) => {
        if (character.original) character.node.style.setProperty("font-variation-settings", character.original, character.priority);
        else character.node.style.removeProperty("font-variation-settings");
        if (!character.node.getAttribute("style")) character.node.removeAttribute("style");
      });
      const stop = () => { gsap.ticker.remove(tick); ticking = false; };
      function tick(_time, deltaMs) {
        if (dirty && point) {
          const bounds = root.getBoundingClientRect();
          characters.forEach((character) => {
            // A thin core covers the glyph, with a shorter falloff across neighbors.
            // The shallow vertical band keeps the other word at its resting weight.
            const dx = Math.max(0, Math.abs(point.x - bounds.left - character.x) - character.cellWidth * 0.3);
            const dy = Math.max(0, Math.abs(point.y - bounds.top - character.y) - character.cellHeight * 0.42);
            const distance = Math.hypot(dx / horizontalReach, dy / (character.cellHeight * 0.18));
            const proximity = Math.max(0, 1 - distance);
            const influence = proximity * proximity * (3 - 2 * proximity);
            character.target = {
              weight: resting.weight + (active.weight - resting.weight) * influence,
              width: resting.width + (active.width - resting.width) * influence,
            };
          });
          dirty = false;
        }
        // About 195ms response / 360ms return to 95%, without overshooting the axes.
        const blend = 1 - Math.exp(-Math.min(deltaMs, 64) / (returning ? 120 : 65));
        let settled = true;
        characters.forEach((character) => {
          character.weight += (character.target.weight - character.weight) * blend;
          character.width += (character.target.width - character.width) * blend;
          if (Math.abs(character.target.weight - character.weight) > 0.08
            || Math.abs(character.target.width - character.width) > 0.004) settled = false;
          else { character.weight = character.target.weight; character.width = character.target.width; }
          write(character);
        });
        if (settled) { stop(); if (returning) restore(); }
      }
      const start = () => { if (!ticking) { ticking = true; gsap.ticker.add(tick); } };
      const reset = (immediate = false) => {
        point = null;
        dirty = false;
        activeTouch = null;
        returning = true;
        characters.forEach((character) => {
          character.target = { ...resting };
          if (immediate) Object.assign(character, resting);
        });
        if (immediate) { stop(); restore(); }
        else start();
      };
      const measure = () => {
        reset(true);
        const bounds = root.getBoundingClientRect();
        horizontalReach = Math.max(90, Math.min(280, parseFloat(getComputedStyle(root).fontSize) * 1.05));
        characters.forEach((character) => {
          const box = character.node.parentElement.getBoundingClientRect();
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
        if (event.pointerType === "mouse") { reset(true); return; }
        if (activeTouch !== null) return;
        activeTouch = event.pointerId;
        track(event);
      };
      const onMove = (event) => {
        if (event.pointerType !== "mouse") {
          if (event.pointerId === activeTouch) track(event);
          return;
        }
        const selection = window.getSelection();
        // An actual mouse can hover even when a hybrid/emulated primary input is coarse.
        if (event.buttons || (!selection?.isCollapsed && selection?.containsNode(root, true))) {
          reset(true);
          return;
        }
        track(event);
      };
      const onEnd = (event) => { if (event.pointerId === activeTouch) reset(); };
      const onLeave = (event) => { if (event.pointerType === "mouse") reset(); };
      const onBlur = () => reset(true);
      const onVisibility = () => { if (document.hidden) reset(true); };
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
        reset(true);
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
      const usingArchivo = getComputedStyle(root).fontFamily.includes("AJ Archivo");
      if (!disposed && fontReady && usingArchivo && settled && !reduced.matches) {
        detachRef.current = attach();
      }
    };
    const observer = new MutationObserver(reconcile);
    observer.observe(hero, { attributes: true, attributeFilter: ["data-hero-motion"] });
    reduced.addEventListener("change", reconcile);
    // Reuse the CSS face and browser request cache; never register duplicate faces.
    document.fonts?.load('900 16px "AJ Archivo"', "AMAL JITH.").then((faces) => {
      if (disposed) return;
      fontReady = faces.some((face) => face.status === "loaded");
      reconcile();
    }).catch(() => { /* A failed local font leaves static, readable fallback type. */ });
    return () => {
      disposed = true;
      observer.disconnect();
      reduced.removeEventListener("change", reconcile);
      reset();
    };
  }, [rootRef, reset]);
  return reset;
}
