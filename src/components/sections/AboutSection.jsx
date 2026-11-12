import { useRef } from "react";
import AboutPortrait from "./AboutPortrait.jsx";
import AboutGeometry from "./AboutGeometry.jsx";
import useAboutMotion from "../../hooks/useAboutMotion.js";
import "./About.css";

export default function AboutSection({ motionEnabled = true }) {
  const rootRef = useRef(null);
  useAboutMotion(rootRef, motionEnabled);

  return (
    <section ref={rootRef} id="about" className="about" aria-labelledby="about-title" tabIndex={-1}>
      <div className="about__surface-mask" aria-hidden="true">
        <div className="about__surface" />
        <div className="about__curtain" />
      </div>
      <div className="about__inner">
        <div className="about__edition">
          <p><span className="about__registration" aria-hidden="true" /><span className="about__technical-text" data-about-label>02 / ABOUT</span></p>
          <p>ENGINEERING + INTERACTION</p>
        </div>

        <div className="about__spread">
          <div className="about__left">
            <div className="about__title-track">
              <div className="about__heading-lock">
                <h2 id="about-title" className="about__headline">
                  <span className="about__line-mask"><span data-about-title>BEYOND</span></span>{" "}
                  <span className="about__line-mask"><span data-about-title>THE <span className="about__headline-accent">CODE.</span></span></span>
                </h2>
                <p className="about__identity">PYTHON DEVELOPER</p>
              </div>
            </div>
            <AboutGeometry />
          </div>

          <div className="about__right">
            <p className="about__intro">
              <span className="about__intro-line" data-about-intro>Reliable systems.</span>{" "}
              <span className="about__intro-line" data-about-intro>Thoughtful interfaces.</span>
            </p>
            <div className="about__story">
              <AboutPortrait />
              <div className="about__copy">
                <p data-about-copy>I&apos;m a Python Developer focused on building reliable, functional web applications. I enjoy combining backend engineering with thoughtful frontend experiences and exploring how motion and interaction can make the web feel more engaging.</p>
                <dl className="about__facts">
                  <div>
                    <dt><span className="about__fact-index" aria-hidden="true">01 /</span><span data-about-meta-label>FOCUS</span></dt>
                    <dd data-about-meta-value>Web applications</dd>
                  </div>
                  <div>
                    <dt><span className="about__fact-index" aria-hidden="true">02 /</span><span data-about-meta-label>TOOLS</span></dt>
                    <dd data-about-meta-value>Python, Django, FastAPI, React, PostgreSQL</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="about__end-rule" aria-hidden="true"><span /></div>
      </div>
    </section>
  );
}
