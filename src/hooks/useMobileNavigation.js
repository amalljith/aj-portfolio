import { useCallback, useId, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const desktopQuery = "(min-width: 64rem)";
const focusableSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

function preserveStyles(element, properties) {
  const saved = properties.map((property) => [
    property,
    element.style.getPropertyValue(property),
    element.style.getPropertyPriority(property),
  ]);
  return () => saved.forEach(([property, value, priority]) => {
    if (value) element.style.setProperty(property, value, priority);
    else element.style.removeProperty(property);
  });
}

function isolateBackground(shell) {
  const saved = [];
  let current = shell;
  while (current.parentElement) {
    for (const sibling of current.parentElement.children) {
      if (sibling === current || !(sibling instanceof HTMLElement) || sibling.matches("script, style, link")) continue;
      saved.push([sibling, sibling.inert]);
      sibling.inert = true;
    }
    current = current.parentElement;
    if (current === document.body) break;
  }
  return () => saved.forEach(([element, inert]) => { element.inert = inert; });
}

export default function useMobileNavigation() {
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(false);
  const shellRef = useRef(null);
  const panelRef = useRef(null);
  const toggleRef = useRef(null);
  const homeRef = useRef(null);
  const timelineRef = useRef(null);
  const openRef = useRef(false);
  const activeRef = useRef(false);
  const reducedRef = useRef(false);
  const closeActionRef = useRef(null);

  const finishClose = useCallback(() => {
    if (openRef.current) return;
    activeRef.current = false;
    setActive(false);
  }, []);

  const close = useCallback((action = { type: "toggle" }) => {
    if (!activeRef.current) return;
    closeActionRef.current = action;
    openRef.current = false;
    setOpen(false);
    // Never hide a focused menu link from the accessibility tree.
    if (panelRef.current?.contains(document.activeElement)) {
      toggleRef.current?.focus({ preventScroll: true });
    }
  }, []);

  const toggle = useCallback(() => {
    if (openRef.current) {
      close();
      return;
    }
    if (window.matchMedia(desktopQuery).matches) return;
    closeActionRef.current = null;
    openRef.current = true;
    activeRef.current = true;
    setOpen(true);
    setActive(true);
  }, [close]);

  const navigate = useCallback((event, href) => {
    event.preventDefault();
    close({ type: "link", href });
  }, [close]);

  const navigateHome = useCallback((event) => {
    if (!activeRef.current) return;
    event.preventDefault();
    close({ type: "home" });
  }, [close]);

  // Resources belong to the entire visible interval, including the closing curtain.
  // StrictMode can safely set up, revert, and set up this same DOM again.
  useLayoutEffect(() => {
    if (!active) return;
    const shell = shellRef.current;
    const panel = panelRef.current;
    const body = document.body;
    const root = document.documentElement;
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    const scrollbarGap = window.innerWidth - root.clientWidth;
    const restoreBody = preserveStyles(body, ["position", "top", "left", "width", "overflow", "padding-right"]);
    const restoreRoot = preserveStyles(root, ["overflow", "scroll-behavior"]);
    const restoreShell = preserveStyles(shell, ["--menu-scrollbar-gap"]);
    const restoreBackground = isolateBackground(shell);

    shell.style.setProperty("--menu-scrollbar-gap", `${scrollbarGap}px`);
    body.style.paddingRight = `${parseFloat(getComputedStyle(body).paddingRight) + scrollbarGap}px`;
    Object.assign(body.style, {
      position: "fixed", top: `${-scrollY}px`, left: `${-scrollX}px`, width: "100%", overflow: "hidden",
    });
    root.style.overflow = "hidden";

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia(desktopQuery);
    reducedRef.current = motion.matches;
    const context = gsap.context(() => {
      const links = panel.querySelectorAll("[data-menu-link]");
      const footer = panel.querySelector("[data-menu-footer]");
      timelineRef.current = gsap.timeline({
        paused: true,
        defaults: { ease: "power3.out" },
        onReverseComplete: finishClose,
      })
        .fromTo(panel, { clipPath: "inset(0% 0% 100% 0%)" }, {
          clipPath: "inset(0% 0% 0% 0%)", duration: 0.36,
        }, 0)
        .fromTo(links, { y: 18, autoAlpha: 0 }, {
          y: 0, autoAlpha: 1, duration: 0.24, stagger: 0.035,
        }, 0.18)
        .fromTo(footer, { y: 6, autoAlpha: 0 }, {
          y: 0, autoAlpha: 1, duration: 0.15,
        }, 0.53);
    }, shell);

    const getFocusable = () => [...shell.querySelectorAll(focusableSelector)].filter((element) => (
      !element.closest('[hidden], [inert], [aria-hidden="true"]')
      && element.getClientRects().length > 0
      && getComputedStyle(element).visibility !== "hidden"
    ));
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close({ type: "escape" });
      } else if (event.key === "Tab") {
        const elements = getFocusable();
        const first = elements[0];
        const last = elements.at(-1);
        if ((event.shiftKey && document.activeElement === first)
          || (!event.shiftKey && document.activeElement === last)
          || !elements.includes(document.activeElement)) {
          event.preventDefault();
          (event.shiftKey ? last : first)?.focus({ preventScroll: true });
        }
      }
    };
    const onFocusIn = (event) => {
      if (!shell.contains(event.target)) toggleRef.current?.focus({ preventScroll: true });
    };
    const onMotionChange = () => {
      reducedRef.current = motion.matches;
      if (!motion.matches) return;
      timelineRef.current.pause().progress(openRef.current ? 1 : 0, true);
      if (!openRef.current) finishClose();
    };
    const onDesktopChange = () => {
      if (!desktop.matches) return;
      close({ type: "desktop" });
      timelineRef.current.pause().progress(0, true);
      finishClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("focusin", onFocusIn);
    motion.addEventListener("change", onMotionChange);
    desktop.addEventListener("change", onDesktopChange);
    toggleRef.current?.focus({ preventScroll: true });

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("focusin", onFocusIn);
      motion.removeEventListener("change", onMotionChange);
      desktop.removeEventListener("change", onDesktopChange);
      context.revert();
      timelineRef.current = null;
      restoreBody();
      restoreBackground();
      restoreShell();
      root.style.scrollBehavior = "auto";
      root.style.removeProperty("overflow");
      window.scrollTo(scrollX, scrollY);
      restoreRoot();
    };
  }, [active, close, finishClose]);

  useLayoutEffect(() => {
    const timeline = timelineRef.current;
    if (!active || !timeline) return;
    if (reducedRef.current) {
      timeline.pause().progress(open ? 1 : 0, true);
      if (!open) finishClose();
    } else if (open) {
      timeline.timeScale(1).play();
    } else if (timeline.progress() === 0) {
      finishClose();
    } else {
      timeline.timeScale(1.25).reverse();
    }
  }, [open, active, finishClose]);

  // Run navigation only after the curtain has closed and scrolling/inert are restored.
  useLayoutEffect(() => {
    if (active || !closeActionRef.current) return;
    const action = closeActionRef.current;
    closeActionRef.current = null;
    if (action.type === "desktop") {
      homeRef.current?.focus({ preventScroll: true });
      return;
    }
    if (action.type === "home") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      history.pushState(null, "", window.location.pathname + window.location.search);
      homeRef.current?.focus({ preventScroll: true });
      return;
    }
    const target = action.href ? document.getElementById(action.href.slice(1)) : null;
    if (target instanceof HTMLElement && target.getClientRects().length > 0
      && getComputedStyle(target).visibility !== "hidden" && !target.closest("[inert], [hidden]")) {
      if (window.location.hash !== action.href) history.pushState(null, "", action.href);
      target.scrollIntoView({ block: "start", behavior: "instant" });
      if (!target.hasAttribute("tabindex")) target.tabIndex = -1;
      target.focus({ preventScroll: true });
    } else {
      toggleRef.current?.focus({ preventScroll: true });
    }
  }, [active]);

  return { open, active, panelId, shellRef, panelRef, toggleRef, homeRef, toggle, navigate, navigateHome };
}
