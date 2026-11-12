const nativeControls = 'input, textarea, select, option, iframe, video[controls], audio[controls], [contenteditable]:not([contenteditable="false"]), [data-cursor="native"]';
const actions = 'a[href], button, [role="button"], [role="slider"], [draggable="true"]';
const labels = { view: "VIEW", explore: "EXPLORE", open: "OPEN", visit: "VISIT" };

// Declarative API: data-cursor="minimal|native|view|explore|open|visit|drag"
// and optional data-cursor-label. Action labels require a real enabled control.
export function resolveCursorMode(target) {
  if (!(target instanceof Element) || target.closest(nativeControls) || target.closest('[inert], [hidden]')) return null;
  const section = target.closest("section, header, nav") || document.body;
  const annotation = target.closest("[data-cursor]");
  const control = target.closest(actions);
  let label = "";
  let action = false;
  if (control && !control.matches(':disabled, [aria-disabled="true"]') && !control.closest('[aria-disabled="true"]')) {
    if (control.matches("a")) {
      const href = control.getAttribute("href");
      action = Boolean(href && href !== "#");
      if (href?.startsWith("#")) {
        try { action = Boolean(document.getElementById(decodeURIComponent(href.slice(1)))); } catch { action = false; }
      }
      if (action) label = /^https?:\/\//i.test(href) && new URL(href, location.href).origin !== location.origin ? "VISIT" : "OPEN";
    } else {
      action = true;
      label = control.hasAttribute("aria-expanded") ? control.getAttribute("aria-expanded") === "true" ? "CLOSE" : "OPEN" : "ACTIVATE";
    }
    if (action && annotation) {
      const mode = annotation.dataset.cursor;
      if (mode === "drag" && control.matches('[draggable="true"], [role="slider"]')) label = "DRAG";
      else if (labels[mode]) label = labels[mode];
      if (annotation.dataset.cursorLabel) label = annotation.dataset.cursorLabel.toUpperCase().replace(/[^A-Z0-9 /-]/g, "").trim().slice(0, 16);
    }
  }
  const minimal = annotation?.dataset.cursor === "minimal" || Boolean(target.closest("#about"));
  if (annotation?.dataset.cursor === "minimal") label = "";
  return { key: action ? control : section, section, control: action ? control : null, label, minimal };
}

