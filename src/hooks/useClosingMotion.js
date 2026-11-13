import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";

function contactScene(root, plugin, state, fine) {
  let entrance;
  if (!state.reading && !state.seen) {
    const headings = root.querySelectorAll("[data-contact-heading]");
    const fields = root.querySelectorAll("[data-contact-field]");
    gsap.set("[data-contact-ui]", { y: 6, opacity: 0.5 });
    gsap.set(headings, { clipPath: "inset(0 100% 0 0)", x: 12 });
    gsap.set(fields, { y: 8, opacity: 0.55 });
    entrance = gsap.timeline({ onStart: () => { state.seen = true; }, scrollTrigger: {
      id: "aj-contact", trigger: root, start: "top 80%", end: "bottom top", toggleActions: "play none none reverse",
    } });
    entrance.fromTo("[data-closing-rule]", { scaleX: 0 }, { scaleX: 1, duration: 0.65, ease: "power2.inOut" }, 0)
      .fromTo("[data-contact-ui]", { y: 6, opacity: 0.5 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.055, ease: "power2.out" }, 0.06)
      .fromTo(headings, { clipPath: "inset(0 100% 0 0)", x: 12 }, { clipPath: "inset(0 0% 0 0)", x: 0, duration: 0.65, stagger: 0.12, ease: "power3.out" }, 0.12)
      .fromTo(fields, { y: 8, opacity: 0.55 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.085, ease: "power2.out" }, 0.3);
    if (root.getBoundingClientRect().bottom < 0) entrance.progress(1).pause();
  }
  const button = root.querySelector("[data-contact-magnetic]");
  const inner = button.querySelector("[data-contact-magnet-inner]");
  const x = gsap.quickTo(inner, "x", { duration: 0.28, ease: "power2.out" });
  const y = gsap.quickTo(inner, "y", { duration: 0.28, ease: "power2.out" });
  let bounds;
  const enter = (event) => { if (fine.matches && event.pointerType === "mouse") bounds = button.getBoundingClientRect(); };
  const move = (event) => {
    if (!bounds || !fine.matches || event.pointerType !== "mouse") return;
    x(gsap.utils.clamp(-3, 3, ((event.clientX - bounds.left) / bounds.width - 0.5) * 6));
    y(gsap.utils.clamp(-2, 2, ((event.clientY - bounds.top) / bounds.height - 0.5) * 4));
  };
  const leave = () => { bounds = null; x(0); y(0); };
  button.addEventListener("pointerenter", enter, { passive: true });
  button.addEventListener("pointermove", move, { passive: true });
  button.addEventListener("pointerleave", leave, { passive: true });
  return { cleanup: () => {
    button.removeEventListener("pointerenter", enter); button.removeEventListener("pointermove", move); button.removeEventListener("pointerleave", leave);
  } };
}

function footerScene(root, plugin, state, fine) {
  const base = root.querySelector("[data-footer-name]");
  const slices = root.querySelectorAll("[data-footer-slice]");
  const pixels = root.querySelectorAll("[data-footer-pixel]");
  const button = root.querySelector("[data-footer-trigger]");
  let entrance;
  if (!state.seen && !state.reading) {
    gsap.set(base, { opacity: 0 });
    gsap.set(slices, { opacity: 0, x: (i) => [-18, 14, -10][i], y: (i) => [-3, 2, 3][i] });
    entrance = gsap.timeline({ onStart: () => { state.seen = true; }, scrollTrigger: {
      id: "aj-footer", trigger: root, start: "top 85%", end: "clamp(bottom top)", once: true,
    } });
    entrance.fromTo("[data-closing-rule]", { scaleX: 0 }, { scaleX: 1, duration: 0.55, ease: "power2.inOut" }, 0)
      .to(slices, { x: 0, y: 0, opacity: 1, duration: 0.45, stagger: 0.055, ease: "power3.out" }, 0.08)
      .fromTo(pixels, { x: (i) => i % 2 ? -8 : 8, y: 0, scale: 0.5, opacity: 0 }, { x: 0, y: (i) => i % 2 ? 6 : -6, scale: 1, opacity: 1, duration: 0.14, stagger: 0.018, ease: "power2.out" }, 0.2)
      .to(base, { opacity: 1, duration: 0.08 }, 0.54)
      .to(slices, { opacity: 0, duration: 0.1 }, 0.54)
      .to(pixels, { scale: 0.3, opacity: 0, duration: 0.2, ease: "power2.out" }, 0.48);
    if (root.getBoundingClientRect().bottom < 0) entrance.progress(1).pause();
  }
  // One reusable finite interaction; no tween is constructed on pointer movement.
  const glitch = gsap.timeline({ paused: true });
  glitch.set(base, { opacity: 0, immediateRender: false }, 0)
    .set(slices, { x: 0, y: 0, opacity: 1, immediateRender: false }, 0)
    .to(slices, { x: (i) => [-5, 8, -3][i], duration: 0.07, ease: "power2.out" }, 0)
    .fromTo(pixels, { x: (i) => i % 2 ? 4 : -4, y: 0, opacity: 0, scale: 0.6 }, { x: (i) => i % 2 ? 10 : -10, y: (i) => i % 2 ? -5 : 5, opacity: 1, scale: 1, duration: 0.14, stagger: 0.012, ease: "power2.out", immediateRender: false }, 0.05)
    .to(slices, { x: 0, duration: 0.32, stagger: 0.025, ease: "power3.out" }, 0.13)
    .to(pixels, { opacity: 0, scale: 0.3, duration: 0.18 }, 0.27)
    .set(base, { opacity: 1 }, 0.5)
    .set(slices, { opacity: 0 }, 0.5);
  const replay = () => {
    if (glitch.isActive() || !window.getSelection()?.isCollapsed) return;
    entrance?.progress(1).pause();
    state.seen = true;
    glitch.restart();
  };
  const hover = (event) => { if (fine.matches && event.pointerType === "mouse" && !entrance?.isActive()) replay(); };
  button.addEventListener("pointerenter", hover, { passive: true });
  return { replay, cleanup: () => button.removeEventListener("pointerenter", hover) };
}

// Shared lifecycle for the two closing sections; each owns its own context and
// observes upstream layout without reconfiguring existing section controllers.
export default function useClosingMotion(rootRef, enabled, kind) {
  const controller = useRef(null);
  const [ready, setReady] = useState(false);
  const replay = useCallback(() => controller.current?.replay?.(), []);
  useLayoutEffect(() => {
    if (!enabled) return;
    const root = rootRef.current;
    const page = root.closest(".portfolio-page");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const fine = matchMedia("(hover: hover) and (pointer: fine)");
    const predecessors = [...(page?.querySelectorAll("main > section") || [])].filter((node) => node !== root && Boolean(node.compareDocumentPosition(root) & Node.DOCUMENT_POSITION_FOLLOWING));
    const geometry = () => [innerWidth, innerHeight, root.offsetHeight, Math.round(root.getBoundingClientRect().top + scrollY), ...predecessors.map((node) => node.offsetHeight)].join("|");
    const state = { seen: false, reading: root.contains(document.activeElement) || Boolean(root.id && location.hash === `#${root.id}`) };
    let disposed = false, loading = false, plugin, context, frame = 0, key = "";
    let initialAnchor = kind === "contact" && location.hash === "#contact" && scrollY === 0;
    const inputs = ["wheel", "touchstart", "pointerdown", "keydown", "hashchange"];
    const stopAnchor = () => { initialAnchor = false; inputs.forEach((name) => window.removeEventListener(name, stopAnchor)); };
    const honorAnchor = () => {
      if (initialAnchor && location.hash !== "#contact") stopAnchor();
      if (!initialAnchor || disposed || document.hidden || root.closest("[inert]")) return;
      if (Math.abs(root.getBoundingClientRect().top - 16) > 4) root.scrollIntoView({ block: "start", behavior: "instant" });
      root.focus({ preventScroll: true });
    };
    const clear = () => {
      controller.current?.cleanup?.(); controller.current = null;
      const previous = context; context = null; previous?.revert();
    };
    const build = () => {
      if (disposed) return;
      clear(); key = geometry();
      if (reduced.matches || document.hidden || root.closest("[inert]")) { setReady(false); honorAnchor(); return; }
      if (!plugin && !state.reading && !state.seen) {
        if (!loading) {
          loading = true;
          import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
            if (disposed) return;
            plugin = ScrollTrigger; gsap.registerPlugin(plugin); queue();
          }).catch((error) => { if (!disposed) console.warn("Closing motion unavailable; keeping contact and footer readable.", error); });
        }
        setReady(false); honorAnchor(); return;
      }
      try {
        context = gsap.context(() => {}, root);
        context.add(() => { controller.current = kind === "contact" ? contactScene(root, plugin, state, fine) : footerScene(root, plugin, state, fine); });
        setReady(Boolean(controller.current?.replay));
      } catch (error) {
        clear(); setReady(false);
        console.warn("Closing scene failed; keeping usable static content.", error);
      }
      key = geometry(); honorAnchor();
    };
    const queue = () => { if (!disposed && !frame) frame = requestAnimationFrame(() => { frame = 0; build(); }); };
    const settle = () => { if (state.reading) return; state.reading = true; build(); };
    const focus = (event) => { if (event.target !== root || root.matches(":focus-visible")) settle(); };
    const selection = () => {
      const selected = window.getSelection();
      if (selected && !selected.isCollapsed && (root.contains(selected.anchorNode) || root.contains(selected.focusNode))) settle();
    };
    const visibility = () => { if (document.hidden) { clear(); setReady(false); } else queue(); };
    const observer = new ResizeObserver(() => { if (key !== geometry()) queue(); });
    [root, ...predecessors].forEach((node) => observer.observe(node));
    const inert = new MutationObserver(queue);
    [...new Set([root, root.closest("main"), page].filter(Boolean))].forEach((node) => inert.observe(node, { attributes: true, attributeFilter: ["inert"] }));
    reduced.addEventListener("change", queue); fine.addEventListener("change", queue);
    window.addEventListener("resize", queue); window.addEventListener("pageshow", queue);
    document.addEventListener("visibilitychange", visibility); document.addEventListener("selectionchange", selection);
    root.addEventListener("focusin", focus);
    document.fonts?.addEventListener("loadingdone", queue); document.fonts?.addEventListener("loadingerror", queue);
    document.fonts?.ready.then(() => { if (!disposed) queue(); });
    if (initialAnchor) inputs.forEach((name) => window.addEventListener(name, stopAnchor, { passive: true }));
    build();
    return () => {
      disposed = true; stopAnchor(); cancelAnimationFrame(frame); clear(); observer.disconnect(); inert.disconnect();
      reduced.removeEventListener("change", queue); fine.removeEventListener("change", queue);
      window.removeEventListener("resize", queue); window.removeEventListener("pageshow", queue);
      document.removeEventListener("visibilitychange", visibility); document.removeEventListener("selectionchange", selection);
      root.removeEventListener("focusin", focus);
      document.fonts?.removeEventListener("loadingdone", queue); document.fonts?.removeEventListener("loadingerror", queue);
    };
  }, [rootRef, enabled, kind]);
  return { ready, replay };
}
