import { useRef } from "react";
import { featuredTechnologies, supportingTechnologies } from "../../data/expertise.js";
import useExpertiseMotion from "../../hooks/useExpertiseMotion.js";
import ExpertiseIcon from "./ExpertiseIcon.jsx";
import "./Expertise.css";

const supportingToolCount = supportingTechnologies.reduce((total, group) => total + group.items.length, 0);

function Characters({ text, attribute }) {
  return text.split(" ").map((word, wordIndex) => (
    <span className="expertise__word" key={wordIndex} aria-hidden="true">
      {wordIndex > 0 ? "\u00a0" : ""}
      {[...word].map((char, index) => <span key={index} {...{ [attribute]: char.toLowerCase() }}>{char}</span>)}
    </span>
  ));
}

export default function ExpertiseSection({ motionEnabled = true }) {
  const rootRef = useRef(null);
  useExpertiseMotion(rootRef, motionEnabled);

  return (
    <section ref={rootRef} id="expertise" className="expertise" aria-labelledby="expertise-title" tabIndex={-1}>
      <div className="expertise__inner">
        <div className="expertise__track">
          <div className="expertise__stage">
            <div className="expertise__introduction">
              <p className="expertise__edition"><span aria-hidden="true" />03 / EXPERTISE</p>
              <h2 id="expertise-title" className="expertise__headline">TOOLS OF<br />THE TRADE<span>.</span></h2>
              <p className="expertise__intro-copy">Languages, frameworks, and tools for building across the web. From the first request to the final interface.</p>
              <div className="expertise__progress" aria-hidden="true">
                <div className="expertise__progress-label"><span>SCROLL / DISCOVER</span><span><span data-expertise-current>01</span> / 05</span></div>
                <div className="expertise__progress-track"><span data-expertise-progress /></div>
                <p>FIVE TOOLS. ONE CONNECTED STACK.</p>
              </div>
              <svg className="expertise__construction" viewBox="0 0 420 130" fill="none" aria-hidden="true" focusable="false">
                <path d="M1 92H122L182 32H378" /><path d="M1 112H142L202 52H418" />
                <path data-expertise-fragment d="M304 84H330V110H304Z" fill="currentColor" stroke="none" />
                <path data-expertise-grid d="M362 1V19M353 10H371M393 84V102M384 93H402" />
              </svg>
            </div>
            <ol className="expertise__panels" aria-label="Featured technologies">
              {featuredTechnologies.map((technology, index) => (
                <li className="expertise__panel" data-technology={technology.id} key={technology.id}>
                  <article aria-labelledby={`expertise-${technology.id}`}>
                    <div className="expertise__panel-meta"><span>{technology.category}</span><span aria-hidden="true">{String(index + 1).padStart(2, "0")} / 05</span></div>
                    <ExpertiseIcon technology={technology.id} featured />
                    <h3 id={`expertise-${technology.id}`} className="expertise__name" aria-label={technology.name}>
                      <Characters text={technology.name} attribute="data-expertise-char" />
                    </h3>
                    <p className="expertise__description">{technology.description}</p>
                  </article>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="expertise__supporting" aria-labelledby="expertise-index-title">
          <div className="expertise__index-header"><h3 id="expertise-index-title">THE EXTENDED TOOLKIT</h3><p>{supportingToolCount} TOOLS / DOCUMENTATION ↗</p></div>
          <div className="expertise__index-groups">
            {supportingTechnologies.map((group, groupIndex) => (
              <div className="expertise__index-group" data-toolkit-category={group.id} key={group.id}>
                <h4><span aria-hidden="true">{String(groupIndex + 1).padStart(2, "0")} /</span> {group.category}</h4>
                <ul>
                  {group.items.map((technology, itemIndex) => (
                    <li key={technology.id}>
                      <a className="expertise__index-link" data-index-technology={technology.id} href={technology.href} target="_blank" rel="noreferrer" aria-label={`${technology.name} documentation (opens in a new tab)`}>
                        <span className="expertise__index-number" aria-hidden="true">{String(6 + itemIndex + supportingTechnologies.slice(0, groupIndex).reduce((total, entry) => total + entry.items.length, 0)).padStart(2, "0")}</span>
                        <ExpertiseIcon technology={technology.id} />
                        <span className="expertise__index-name"><Characters text={technology.name} attribute="data-index-char" /></span>
                        <span className="expertise__index-arrow" aria-hidden="true">↗</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="expertise__end" aria-hidden="true"><span>{featuredTechnologies.length + supportingToolCount} / IN THE TOOLKIT</span><span>CODE → INTERFACE</span></div>
      </div>
    </section>
  );
}
