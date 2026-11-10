import { useImperativeHandle, useRef, useState } from "react";
import useHeroEntrance from "../../hooks/useHeroEntrance.js";
import useFluidTypography from "../../hooks/useFluidTypography.js";
import HeroAmbient from "./HeroAmbient.jsx";
import "./Hero.css";

// Fixed advances cover the approved coupled axis path, keeping each glyph clear
// of its neighbors. Entrance transforms and variable-font styles have separate owners.
const advances = { A: 0.446, M: 0.67, L: 0.31, J: 0.43, I: 0.229, T: 0.374, H: 0.435, ".": 0.225 };

function NameWord({ children }) {
  return (
    <span className="hero__name">
      {Array.from(children, (character, index) => (
        <span className="hero__char-mask" style={{ "--advance": `${advances[character]}em` }} key={index}>
          <span className="hero__char"><span className="hero__glyph">{character}</span></span>
        </span>
      ))}
    </span>
  );
}

export default function Hero({ ref, autoPlay = true }) {
  const [workNotice, setWorkNotice] = useState("");
  const heroRef = useRef(null);
  const resetTypography = useFluidTypography(heroRef);
  const { play, restart, finish } = useHeroEntrance(heroRef, autoPlay, resetTypography);
  useImperativeHandle(ref, () => ({ play, restart, finish }), [play, restart, finish]);

  return (
    <section ref={heroRef} id="hero" aria-labelledby="hero-title" className="hero bg-surface px-gutter">
      <div className="hero__inner mx-auto max-w-content">
        <p className="hero__edition font-mono text-label">[PORTFOLIO / 2026]</p>

        <h1 id="hero-title" aria-label="AMAL JITH." className="hero__title text-accent">
          <NameWord>AMAL</NameWord>{" "}
          <svg
            className="hero__geometry"
            viewBox="0 0 200 184"
            width="200"
            height="184"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M8 132H48L112 36H192" vectorEffect="non-scaling-stroke" />
            <path d="M8 156H64L128 60H192" vectorEffect="non-scaling-stroke" />
            <path d="M8 84H88L136 132H192" vectorEffect="non-scaling-stroke" />
            <g fill="currentColor" stroke="none">
              <rect x="6" y="82" width="4" height="4" />
              <rect x="6" y="154" width="4" height="4" />
              <rect x="190" y="34" width="4" height="4" />
              <rect x="190" y="130" width="4" height="4" />
            </g>
          </svg>
          <NameWord>JITH.</NameWord>
        </h1>

        <div className="hero__details">
          <div className="hero__identity">
            <p className="hero__role">
              <span className="hero__role-primary font-body"><span className="hero__role-text">PYTHON</span></span>{" "}
              <span className="hero__role-editorial font-editorial"><span className="hero__role-italic">developer.</span></span>
            </p>
            <HeroAmbient />
          </div>
          <div className="hero__copy">
            <p className="hero__description font-body">
              Building modern web experiences with Python, Django, FastAPI, and React.
            </p>
            {/* Use an anchor to #work once the real Work section is available. */}
            <button
              type="button"
              className="hero__cta font-mono text-accent"
              onClick={() => setWorkNotice("Selected work is coming soon.")}
            >
              <span className="hero__cta-label-mask"><span className="hero__cta-label">EXPLORE WORK</span></span>
              <span className="hero__cta-arrow-entrance" aria-hidden="true"><span className="hero__cta-arrow">↗</span></span>
              <span className="hero__cta-rule" aria-hidden="true" />
            </button>
            <p className="hero__notice font-body" role="status">{workNotice}</p>
          </div>
        </div>

        <div className="hero__footer font-mono text-label">
          <span className="hero__divider" aria-hidden="true" />
          <p>SCROLL TO EXPLORE <span aria-hidden="true">↓</span></p>
          <p className="hero__progress"><span className="sr-only">Section </span>01 / 06</p>
        </div>
      </div>
    </section>
  );
}
