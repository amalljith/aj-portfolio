import { useRef } from "react";
import { contact } from "../../data/contact.js";
import ContactForm from "./ContactForm.jsx";
import useClosingMotion from "../../hooks/useClosingMotion.js";
import "./Contact.css";

export default function ContactSection({ motionEnabled = true }) {
  const rootRef = useRef(null);
  useClosingMotion(rootRef, motionEnabled, "contact");
  return (
    <section className="contact" id="contact" ref={rootRef} tabIndex={-1} aria-labelledby="contact-heading">
      <div className="contact__inner">
        <header className="contact__edition"><p><span aria-hidden="true" />06 / CONTACT</p><p>AJ / OPEN CONNECTION</p></header>
        <div className="contact__rule" aria-hidden="true"><span data-closing-rule /></div>
        <div className="contact__grid">
          <div className="contact__invitation">
            <p className="contact__availability" data-contact-ui><span aria-hidden="true" />{contact.availability}</p>
            <h2 id="contact-heading" className="contact__headline">
              <span className="contact__question" data-contact-ui>HAVE AN IDEA?</span>{" "}
              <span className="contact__line"><span data-contact-heading>LET&apos;S BUILD</span></span>{" "}
              <span className="contact__line contact__line--accent"><span data-contact-heading>SOMETHING.</span></span>
            </h2>
            <p className="contact__introduction" data-contact-ui>{contact.introduction}</p>
            <div className="contact__direct" data-contact-ui>
              <p>OR, A DIRECT CONNECTION</p>
              <a className="contact__email" href={`mailto:${contact.email}`} data-cursor="open"><span>{contact.email}</span><span aria-hidden="true">↗</span></a>
            </div>
            <p className="contact__location" data-contact-ui><span aria-hidden="true">↳</span>{contact.location}</p>
          </div>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
