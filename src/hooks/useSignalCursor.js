import { useLayoutEffect } from "react";
import { gsap } from "gsap";
import { resolveCursorMode } from "../components/cursor/cursorModes.js";
import ShatterTrail from "../components/cursor/ShatterTrail.js";

function initializeCursor(root) {
  const html = document.documentElement;
  const position = root.querySelector(".signal-cursor__position");
  const pointer = root.querySelector(".signal-cursor__pointer");
  const label = root.querySelector(".signal-cursor__label");
  const chars = [...root.querySelectorAll("[data-signal-char]")];
  const context = gsap.context(() => {}, root);
  const listeners = [];
  let disposed = false, frame = 0, visible = false, point = null;
  let mode = null, modeKey = "", captured = false, selecting = false;
  let lastFrame = 0, slowFrames = 0, limited = false;
  let x, y, textTimeline, clickTimeline, labelOpacity, trail;

  function hide() {
    html.removeAttribute("data-aj-cursor");
    root.dataset.visible = "false"; visible = false; modeKey = "";
    cancelAnimationFrame(frame); frame = 0; lastFrame = 0;
    trail?.reset(); textTimeline?.pause(); clickTimeline?.progress(1).pause();
  }
  function release() { point = null; captured = selecting = false; hide(); }
  function dispose() {
    if (disposed) return;
    disposed = true;
    listeners.forEach(([node, name, handler, options]) => node.removeEventListener(name, handler, options));
    hide(); context.revert(); trail?.destroy();
    root.removeAttribute("data-mode"); root.removeAttribute("data-budget");
    label.style.removeProperty("inline-size");
    chars.forEach((char) => { char.textContent = ""; char.hidden = false; });
  }
  const safe = (handler) => (...args) => {
    if (disposed) return;
    try { handler(...args); } catch (error) {
      dispose(); console.warn("AJ cursor unavailable; native cursor restored.", error);
    }
  };
  const listen = (node, name, handler, options) => {
    const wrapped = safe(handler);
    node.addEventListener(name, wrapped, options); listeners.push([node, name, wrapped, options]);
  };
  const queue = () => { if (!frame && !disposed) frame = requestAnimationFrame(safe(render)); };

  function showMode(next) {
    const text = next.label, width = text.length * 8 + 12;
    const flipX = point.x + width + 22 > innerWidth, flipY = point.y + 38 > innerHeight;
    const key = `${text}|${next.minimal}|${flipX}|${flipY}`;
    if (key === modeKey && visible) return;
    modeKey = key;
    root.dataset.mode = text ? "label" : next.minimal ? "minimal" : "pointer";
    textTimeline.clear().pause(0);
    if (text) {
      label.style.inlineSize = `${width}px`;
      gsap.set(label, { x: flipX ? -width - 16 : 16, y: flipY ? -30 : 8 });
      chars.forEach((char, i) => {
        char.hidden = i >= text.length; char.textContent = text[i] || "";
        if (i < text.length) textTimeline.fromTo(char, {
          opacity: 0, x: i % 2 ? 2 : -2, y: 3, scale: 0.8,
        }, { opacity: 1, x: 0, y: 0, scale: 1, duration: 0.14, ease: "power3.out" }, i * 0.012);
      });
      labelOpacity(1); textTimeline.play(0);
    } else labelOpacity(0);
  }

  function render(now) {
    frame = 0;
    if (!point || captured || selecting || document.hidden || !document.hasFocus() || !window.getSelection()?.isCollapsed) { hide(); return; }
    const next = resolveCursorMode(document.elementFromPoint(point.x, point.y));
    if (!next) { hide(); return; }
    mode = next;
    showMode(next);
    // The square's center is the exact hotspot; click feedback never offsets it.
    x(point.x); y(point.y);
    const alive = trail.update(now, point, { minimal: mode.minimal, label: mode.label, limited });
    if (!visible) {
      root.dataset.visible = "true"; visible = true;
      html.setAttribute("data-aj-cursor", "active");
    }
    if (lastFrame && now - lastFrame > 34) slowFrames++; else slowFrames = Math.max(0, slowFrames - 1);
    if (slowFrames >= 5 && !limited) { limited = true; root.dataset.budget = "low"; }
    lastFrame = alive ? now : 0;
    if (alive) queue();
  }

  try {
    trail = new ShatterTrail(root.querySelector("canvas"), getComputedStyle(root).getPropertyValue("--signal-ink").trim());
    context.add(() => {
      gsap.set([position, label, ...chars], { x: 0, y: 0 });
      gsap.set(chars, { opacity: 0, scale: 1 });
      x = gsap.quickSetter(position, "x", "px"); y = gsap.quickSetter(position, "y", "px");
      labelOpacity = gsap.quickTo(label, "opacity", { duration: 0.12, ease: "power2.out" });
      textTimeline = gsap.timeline({ paused: true });
      clickTimeline = gsap.timeline({ paused: true })
        .fromTo(pointer, { scale: 1 }, { scale: 0.87, duration: 0.065, ease: "power2.out" })
        .to(pointer, { scale: 1, duration: 0.15, ease: "power3.out" });
    });
    listen(document, "pointermove", (event) => {
      if (event.pointerType !== "mouse") { release(); return; }
      point = { x: event.clientX, y: event.clientY };
      if (!captured && !selecting) {
        const samples = event.getCoalescedEvents?.() || [];
        // Fixed history bounds high-polling mice and coalesced event batches.
        for (const sample of samples.slice(-64)) trail.sample(sample.clientX, sample.clientY, sample.timeStamp);
        if (!samples.length || samples.at(-1).timeStamp !== event.timeStamp) trail.sample(point.x, point.y, event.timeStamp);
      }
      queue();
    }, { passive: true });
    listen(document, "pointerover", (event) => { if (event.pointerType !== "mouse") release(); else queue(); }, { passive: true });
    listen(document, "pointerout", (event) => { if (!event.relatedTarget) release(); }, { passive: true });
    listen(document, "pointerdown", (event) => {
      if (event.pointerType !== "mouse" || event.button !== 0) { release(); return; }
      const next = resolveCursorMode(event.target);
      if (!next) { release(); return; }
      if (!next.control && event.target.closest("p, h1, h2, h3, h4, span, li, dt, dd")) { selecting = true; hide(); }
      else if (visible) {
        clickTimeline.restart();
        trail.burst(event.clientX, event.clientY, performance.now(), next.minimal, limited);
        queue();
      }
    }, { passive: true });
    listen(document, "pointerup", () => { selecting = false; if (window.getSelection()?.isCollapsed) queue(); }, { passive: true });
    listen(document, "selectionchange", () => { if (!window.getSelection()?.isCollapsed) hide(); });
    listen(document, "gotpointercapture", () => { captured = true; hide(); });
    listen(document, "lostpointercapture", () => { captured = false; });
    listen(document, "dragstart", () => { captured = true; point = null; hide(); });
    listen(document, "dragend", () => { captured = false; });
    listen(document, "pointercancel", release);
    listen(document, "keydown", release);
    listen(document, "focusin", (event) => { if (!resolveCursorMode(event.target)) release(); });
    listen(document, "scroll", () => { if (visible) queue(); }, { passive: true, capture: true });
    listen(window, "resize", () => { trail.resize(); if (visible) queue(); }, { passive: true });
    listen(window, "blur", release); listen(window, "pagehide", release); listen(window, "pageshow", release);
    listen(document, "visibilitychange", release);
    return dispose;
  } catch (error) { dispose(); throw error; }
}

export default function useSignalCursor(rootRef, enabled) {
  useLayoutEffect(() => {
    if (!enabled) return;
    const fine = matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let dispose = () => {};
    const update = () => {
      dispose(); dispose = () => {};
      if (!fine.matches || reduced.matches) return;
      try { dispose = initializeCursor(rootRef.current); }
      catch (error) { console.warn("AJ cursor initialization failed; using native cursor.", error); }
    };
    fine.addEventListener("change", update); reduced.addEventListener("change", update);
    update();
    return () => { fine.removeEventListener("change", update); reduced.removeEventListener("change", update); dispose(); };
  }, [rootRef, enabled]);
}
