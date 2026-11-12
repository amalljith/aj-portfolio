import { useState } from "react";

// Supply a real src/alt and adjust objectPosition without changing the frame.
export default function AboutPortrait({ src, alt = "Amal Jith", objectPosition = "50% 42%" }) {
  const [failedSource, setFailedSource] = useState(null);
  const hasImage = Boolean(src && failedSource !== src);

  return (
    <figure className="about__portrait" style={{ "--about-portrait-position": objectPosition }}>
      <div className="about__portrait-frame" data-about-portrait>
        <div className="about__portrait-content" data-about-crop>
          {hasImage ? (
            <img src={src} alt={alt} width="900" height="1200" loading="lazy" decoding="async" onError={() => setFailedSource(src)} />
          ) : (
            <div className="about__portrait-placeholder" role="img" aria-label="Portrait placeholder. Amal Jith’s photograph will be added later.">
              <svg viewBox="0 0 300 400" fill="none" aria-hidden="true" focusable="false" preserveAspectRatio="none">
                <path d="M0 0H300V400H0Z" fill="currentColor" fillOpacity=".06" />
                <path d="M190 0H300V400H64Z" fill="currentColor" fillOpacity=".035" />
                <path d="M20 70V20H70M230 20H280V70M20 330V380H70M230 380H280V330" stroke="currentColor" strokeOpacity=".3" />
                <path d="M32 200H268" stroke="currentColor" strokeOpacity=".12" />
              </svg>
              <span className="about__portrait-note" aria-hidden="true">PORTRAIT<br />TO FOLLOW</span>
            </div>
          )}
        </div>
        <svg className="about__portrait-corners" viewBox="0 0 300 400" fill="none" aria-hidden="true" focusable="false" preserveAspectRatio="none">
          <path data-about-corner d="M1 37V1H37M263 1H299V37" />
          <path data-about-corner d="M1 363V399H37M263 399H299V363" />
        </svg>
        <span className="about__portrait-index" aria-hidden="true">AJ / 01</span>
      </div>
      <figcaption><span>01 / AMAL JITH</span><span>DEVELOPER</span></figcaption>
    </figure>
  );
}
