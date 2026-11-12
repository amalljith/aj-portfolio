import { useRef } from "react";
import AJLogo from "../branding/AJLogo.jsx";
import usePreloader from "../../hooks/usePreloader.js";
import "./Preloader.css";

export default function Preloader({ pageRef, heroRef, onComplete }) {
  const rootRef = useRef(null);
  const skip = usePreloader(rootRef, pageRef, heroRef, onComplete);

  return (
    <div ref={rootRef} className="preloader" data-preloader-phase="draw">
      <div className="preloader__scene" aria-hidden="true">
        <div className="preloader__edition font-mono"><span>AJ / PORTFOLIO</span><span>STRUCTURE — 01</span></div>
        <div className="preloader__artwork">
          <svg className="preloader__construction" viewBox="0 0 480 320" fill="none" preserveAspectRatio="none" focusable="false">
            <path data-intro-line d="M0 76V0H100M380 0H480V76" />
            <path data-intro-line d="M0 244V320H100M380 320H480V244" />
            <path data-intro-line d="M20 24H96M24 20V72M384 296H460M456 248V300" />
            <path data-intro-line d="M212 0H268M240 0V18M212 320H268M240 302V320" />
          </svg>
          <AJLogo decorative className="preloader__logo" />
        </div>
        <div className="preloader__indicator">
          <p className="preloader__label font-mono">INITIALIZING / AJ</p>
          <span className="preloader__track"><span className="preloader__progress" /></span>
        </div>
        <span className="preloader__caption font-mono">PORTFOLIO / 2026</span>
      </div>
      <div className="preloader__curtain" aria-hidden="true" />
      <div className="preloader__actions">
        <button className="preloader__skip font-mono" type="button" onClick={skip}>
          SKIP INTRO <span aria-hidden="true">↗</span>
        </button>
      </div>
    </div>
  );
}
