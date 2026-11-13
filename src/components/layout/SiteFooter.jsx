import { useRef, useState } from "react";
import { contact, contactSocialLinks } from "../../data/contact.js";
import useClosingMotion from "../../hooks/useClosingMotion.js";
import "./SiteFooter.css";

const signature = `${contact.name}.`;

export default function SiteFooter({ motionEnabled = true }) {
  const rootRef = useRef(null);
  const [year] = useState(() => new Date().getFullYear());
  const { ready, replay } = useClosingMotion(rootRef, motionEnabled, "footer");
  const top = (event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (location.hash !== "#hero") history.pushState(null, "", "#hero");
    document.querySelector('.site-navbar a[href="/"]')?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };
  return (
    <footer className="site-footer" ref={rootRef} aria-label="Amal Jith portfolio footer">
      <div className="site-footer__inner">
        <div className="site-footer__edition"><p>AJ / DIGITAL AFTERIMAGE</p><a href="#hero" onClick={top} data-cursor="explore">BACK TO TOP <span aria-hidden="true">↑</span></a></div>
        <div className="site-footer__rule" aria-hidden="true"><span data-closing-rule /></div>
        <h2 className="site-footer__signature" aria-label={signature}>
          <button type="button" className="site-footer__signature-trigger" onClick={replay} disabled={!ready || !motionEnabled} aria-label={`Replay ${signature} signature animation`} data-footer-trigger data-cursor="minimal">
            <span className="site-footer__name" data-footer-name>{signature}</span>
            {[0, 1, 2].map((slice) => <span className={`site-footer__slice site-footer__slice--${slice}`} key={slice} data-footer-slice aria-hidden="true">{signature}</span>)}
            <span className="site-footer__pixels" aria-hidden="true">{[0, 1, 2, 3, 4, 5].map((pixel) => <i key={pixel} data-footer-pixel style={{ "--pixel": pixel }} />)}</span>
          </button>
        </h2>
        <div className="site-footer__connections">
          <nav aria-label="Social and email links"><ul>
            {contactSocialLinks.map((link) => <li key={link.label}><a href={link.href} target="_blank" rel="noopener noreferrer" aria-label={`${link.label} (opens in a new tab)`} data-cursor="visit">{link.label === "GitHub" && <span className="site-footer__github" aria-hidden="true" />}{link.label}<span aria-hidden="true">↗</span></a></li>)}
            <li><a href={`mailto:${contact.email}`} data-cursor="open">Email <span aria-hidden="true">↗</span></a></li>
          </ul></nav>
          <p>{contact.location}</p>
        </div>
        <div className="site-footer__colophon"><p>© {year} Amal Jith</p><p>CODE / FORM / CONNECTION</p></div>
      </div>
    </footer>
  );
}
