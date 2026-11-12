import { useImperativeHandle, useRef } from "react";
import HeroArtwork from "./HeroArtwork.jsx";
import useHeroMotion from "../../hooks/useHeroMotion.js";
import "./Hero.css";

// Real browser measurements of the existing WOFF2 at 21 points from wght
// 500–800, plus .008em. These cells cover both resting and hover advances.
const words = [
  { text: "AMAL", weight: 500, width: 125, cells: { A: 0.978, M: 1.178, L: 0.701 } },
  { text: "JITH.", weight: 800, width: 110, cells: { J: 0.781, I: 0.372, T: 0.754, H: 0.807, ".": 0.287 } },
];

export default function Hero({ ref, autoPlay = true, workHref = null }) {
  const rootRef = useRef(null);
  const controls = useHeroMotion(rootRef, autoPlay);
  useImperativeHandle(ref, () => controls, [controls]);
  // Supply #work from App only when the real Work section is rendered there.
  const workAvailable = Boolean(workHref);

  return (
    <section ref={rootRef} className="hero-v2" id="hero" data-hero aria-labelledby="hero-v2-title">
      <div className="hero-v2__inner">
        <div className="hero-v2__meta" data-v2-ui>
          <p><span className="hero-v2__square" aria-hidden="true" /> PORTFOLIO — 2026</p>
          <p>CODE / FORM / FUNCTION</p>
        </div>

        <h1 className="hero-v2__headline" data-hero-heading id="hero-v2-title" aria-label="AMAL JITH.">
          {words.map(({ text, weight, width, cells }, index) => (
            <span className={`hero-v2__word hero-v2__word--${index + 1}`} key={text} aria-hidden="true" style={{ "--type-weight": weight, "--type-width": width }}>
              {[...text].map((char, characterIndex) => (
                <span className={`hero-v2__cell${char === "." ? " hero-v2__cell--period" : ""}`} key={characterIndex} style={{ "--cell-width": `${cells[char]}em` }}>
                  <span className="hero-v2__reveal"><span className="hero-v2__glyph" data-weight={weight} data-width={width}>{char}</span></span>
                </span>
              ))}
              {index === 0 ? " " : null}
            </span>
          ))}
        </h1>

        <HeroArtwork />
        <p className="hero-v2__annotation" aria-hidden="true" data-v2-ui>AJ — SYSTEM STUDY<br />BUILD / BREAK / REBUILD <span>↙</span></p>

        <p className="hero-v2__role" data-v2-ui>Python Developer <span>/</span><span className="hero-v2__role-second">Full-Stack Developer</span></p>
        <div className="hero-v2__intro" data-v2-ui>
          <p className="hero-v2__description">Building modern, functional web experiences. From Python systems to thoughtful interfaces.</p>
          {workAvailable ? (
            <a className="hero-v2__cta" href={workHref}><span>Explore Work</span><span aria-hidden="true">↗</span></a>
          ) : (
            <button className="hero-v2__cta" type="button" aria-disabled="true" aria-describedby="work-availability">
              <span>Explore Work</span><span aria-hidden="true">↗</span>
            </button>
          )}
          <p className="hero-v2__notice" id="work-availability">{workAvailable ? "" : "Selected work — coming soon."}</p>
        </div>

        <footer className="hero-v2__footer" data-v2-ui>
          <ul className="hero-v2__stack" aria-label="Technology stack">
            {["Python", "Django", "FastAPI", "React", "PostgreSQL"].map((technology) => <li key={technology}>{technology}</li>)}
          </ul>
          <p className="hero-v2__scroll"><span className="hero-v2__scroll-track" aria-hidden="true"><span className="hero-v2__scroll-rule" /></span>SCROLL FOR ANOTHER ANGLE <span aria-hidden="true">↓</span></p>
        </footer>
      </div>
    </section>
  );
}
