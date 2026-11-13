import { useRef } from "react";
import { experiences } from "../../data/experience.js";
import useExperienceMotion from "../../hooks/useExperienceMotion.js";
import "./Experience.css";

function CompanyIdentity({ experience }) {
  return (
    <div className="experience__identity" data-experience-brand>
      <svg className="experience__identity-frame" viewBox="0 0 320 320" preserveAspectRatio="none" fill="none" aria-hidden="true" focusable="false" data-experience-frame>
        <g data-experience-frame-response>
          <path data-experience-frame-line pathLength="1" d="M0 64V0h144M320 256v64H176" />
          <path className="experience__frame-extension" data-experience-frame-line data-experience-frame-extension pathLength="1" d="M0 320h40" />
          <path className="experience__frame-corner" data-experience-frame-corner d="M310 0h10v10" />
        </g>
      </svg>
      <p className="experience__identity-label" data-experience-identity-copy>COMPANY / IDENTITY</p>
      <figure className="experience__brand-reveal" data-experience-brand-reveal>
        <div className="experience__brand-window">
          <img src={experience.logo.src} alt={experience.logo.alt} width={experience.logo.width} height={experience.logo.height} loading="lazy" decoding="async" />
        </div>
      </figure>
      <div className="experience__company-detail" data-experience-identity-copy>
        <h3>{experience.company}</h3>
        <p className="experience__city">{experience.shortLocation}</p>
      </div>
      <div className="experience__location" data-experience-identity-copy>
        <address>{experience.address}</address>
        <a className="experience__location-link" href={experience.mapsUrl} target="_blank" rel="noopener noreferrer" data-cursor="visit" aria-label={`${experience.company} location on Google Maps (opens in a new tab)`}>
          LOCATION <span aria-hidden="true">{"\u2197"}</span>
        </a>
      </div>
    </div>
  );
}

function Experience({ experience, index }) {
  const headingId = index === 0 ? "experience-heading" : `experience-role-${experience.id}`;
  return (
    <article className="experience__record" data-experience={experience.id} aria-labelledby={headingId}>
      <div className="experience__role-block">
        <p className="experience__record-label" data-experience-label>INTERNSHIP / {String(index + 1).padStart(2, "0")}</p>
        <h2 className="experience__role" id={headingId} aria-label={experience.role}>
          {experience.role.split(" ").map((phrase, phraseIndex) => (
            <span className="experience__phrase-mask" key={`${phrase}-${phraseIndex}`} aria-hidden="true"><span data-experience-phrase>{phrase}</span>{" "}</span>
          ))}
        </h2>
      </div>
      <CompanyIdentity experience={experience} />
      <div className="experience__details">
        <dl className="experience__duration" data-experience-duration>
          <dt>DURATION</dt>
          <dd aria-label={`${experience.durationMonths} months`}>
            <span aria-hidden="true">{String(experience.durationMonths).padStart(2, "0")}</span>
            <span className="experience__months" aria-hidden="true">MONTHS</span>
          </dd>
        </dl>
        <p className="experience__description" data-experience-copy>{experience.description}</p>
      </div>
      <div className="experience__toolkit">
        <p className="experience__toolkit-label" data-experience-label>TECHNOLOGY / STACK</p>
        <ul className="experience__technologies" aria-label={`${experience.company} internship technologies`}>
          {experience.technologies.map((technology, technologyIndex) => (
            <li className="experience__technology" key={technology.id} data-experience-technology>
              <span className="experience__technology-index" aria-hidden="true">{String(technologyIndex + 1).padStart(2, "0")}</span>
              <img src={technology.icon} width="26" height="26" alt="" loading="lazy" decoding="async" />
              <span>{technology.name}</span><span className="experience__technology-line" aria-hidden="true" />
            </li>
          ))}
        </ul>
        <div className="experience__closing-rule" aria-hidden="true"><span data-experience-closing /></div>
      </div>
    </article>
  );
}

export default function ExperienceSection({ motionEnabled = true }) {
  const rootRef = useRef(null);
  useExperienceMotion(rootRef, motionEnabled);
  return (
    <section ref={rootRef} className="experience" id="experience" tabIndex={-1} aria-labelledby="experience-heading" data-experience-motion="static">
      <div className="experience__inner">
        <header className="experience__header">
          <div className="experience__edition">
            <p data-experience-marker><span aria-hidden="true" />05 / EXPERIENCE</p>
            <p className="experience__signature" data-experience-label>AJ / CAREER SIGNAL</p>
          </div>
          <div className="experience__signal" aria-hidden="true"><span data-experience-rule /><i data-experience-signal /></div>
        </header>
        {experiences.map((experience, index) => <Experience key={experience.id} experience={experience} index={index} />)}
      </div>
    </section>
  );
}
