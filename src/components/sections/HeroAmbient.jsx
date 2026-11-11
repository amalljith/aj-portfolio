import { useEffect, useRef } from "react";
import "./HeroAmbient.css";

const desktopSignalPath = "M8 124H144L216 52H360L392 84H492L560 16H712";
const mobileSignalPath = "M14 8V56L44 86V132L22 154V216";

export default function HeroAmbient() {
  const ambientRef = useRef(null);

  useEffect(() => {
    const element = ambientRef.current;
    const updateVisibility = () => {
      element.dataset.pageVisible = String(!document.hidden);
    };
    const observer = new IntersectionObserver(([entry]) => {
      element.dataset.inView = String(entry.isIntersecting);
    });
    updateVisibility();
    observer.observe(element);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  return (
    <div ref={ambientRef} className="hero-ambient" aria-hidden="true">
      <svg
        className="hero-ambient__art hero-ambient__art--desktop"
        viewBox="0 0 720 160"
        width="720"
        height="160"
        preserveAspectRatio="none"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        aria-hidden="true"
        focusable="false"
      >
        <path className="hero-ambient__contour" d={desktopSignalPath} vectorEffect="non-scaling-stroke" />
        <path className="hero-ambient__secondary" d="M8 148H160L232 76H344L376 108H508L576 40H712" vectorEffect="non-scaling-stroke" />
        <path className="hero-ambient__secondary" d="M328 52L360 20H448" vectorEffect="non-scaling-stroke" />
        <path className="hero-ambient__signal" d={desktopSignalPath} pathLength="100" vectorEffect="non-scaling-stroke" />
        <g className="hero-ambient__nodes" fill="currentColor" stroke="none">
          <rect x="5.5" y="121.5" width="5" height="5" />
          <rect x="709.5" y="13.5" width="5" height="5" />
          <rect x="446" y="18" width="4" height="4" />
        </g>
      </svg>
      <svg
        className="hero-ambient__art hero-ambient__art--mobile"
        viewBox="0 0 64 224"
        width="64"
        height="224"
        preserveAspectRatio="none"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        aria-hidden="true"
        focusable="false"
      >
        <path className="hero-ambient__contour" d={mobileSignalPath} vectorEffect="non-scaling-stroke" />
        <path className="hero-ambient__secondary" d="M44 114L56 126V168" vectorEffect="non-scaling-stroke" />
        <path className="hero-ambient__signal" d={mobileSignalPath} pathLength="100" vectorEffect="non-scaling-stroke" />
        <g className="hero-ambient__nodes" fill="currentColor" stroke="none">
          <rect x="12" y="6" width="4" height="4" />
          <rect x="20" y="214" width="4" height="4" />
          <rect x="54.5" y="166.5" width="3" height="3" />
        </g>
      </svg>
    </div>
  );
}
