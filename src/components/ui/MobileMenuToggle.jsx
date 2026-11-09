import "./MobileMenuToggle.css";

export default function MobileMenuToggle({ open, onToggle, controls, buttonRef }) {
  return (
    <button
      type="button"
      ref={buttonRef}
      className="mobile-menu-toggle min-h-11 min-w-11 cursor-pointer items-center gap-3 font-mono text-label uppercase lg:hidden"
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      aria-controls={controls}
      data-open={open}
      onClick={onToggle}
    >
      <svg
        className="mobile-menu-toggle__symbol"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        width="32"
        height="32"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
      >
        {[1, 2, 3, 4, 5].map((pixel) => (
          <rect
            key={pixel}
            className={`mobile-menu-toggle__pixel mobile-menu-toggle__pixel--${pixel}`}
            x="-3"
            y="-3"
            width="6"
            height="6"
          />
        ))}
      </svg>
      <span className="mobile-menu-toggle__labels" aria-hidden="true">
        <span className="mobile-menu-toggle__label--menu">Menu</span>
        <span className="mobile-menu-toggle__label--close">Close</span>
      </span>
    </button>
  );
}
