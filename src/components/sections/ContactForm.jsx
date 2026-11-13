import { useEffect, useRef, useState } from "react";
import { createContactDraft, validateContact } from "../../lib/contactDraft.js";

const fields = [
  { name: "name", label: "Name", type: "text", autoComplete: "name", placeholder: "Your name" },
  { name: "email", label: "Email", type: "email", autoComplete: "email", placeholder: "you@example.com" },
  { name: "message", label: "Message", placeholder: "Tell me what you have in mind." },
];

const openEmailDraft = (url) => window.location.assign(url);

export default function ContactForm({ openDraft = openEmailDraft }) {
  const formRef = useRef(null);
  const pendingFocus = useRef(null);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");
  useEffect(() => {
    if (pendingFocus.current) formRef.current.elements.namedItem(pendingFocus.current).focus();
    pendingFocus.current = null;
  }, [errors]);

  const submit = (event) => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    const nextErrors = validateContact(values);
    pendingFocus.current = Object.keys(nextErrors)[0] || null;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setStatus("Please check the highlighted fields.");
      return;
    }
    setStatus("Email draft prepared. Review and send it in your email app.");
    // The visitor explicitly submits before any external application is requested.
    // No network delivery, success claim, storage, or third-party request occurs.
    openDraft(createContactDraft(values));
  };

  const change = (event) => {
    const name = event.target.name;
    if (errors[name]) setErrors((current) => {
      const next = { ...current };
      delete next[name];
      return next;
    });
    if (status) setStatus("");
  };

  return (
    <form ref={formRef} className="contact-form" onSubmit={submit} onChange={change} noValidate aria-label="Prepare an email to Amal Jith" aria-describedby="contact-form-note">
      <p className="contact-form__edition">YOUR NEXT CONVERSATION / START HERE</p>
      {fields.map((field, index) => {
        const id = `contact-${field.name}`;
        const shared = { id, name: field.name, required: true, placeholder: field.placeholder, "aria-invalid": errors[field.name] ? true : undefined, "aria-describedby": `${id}-error` };
        return (
          <div className="contact-form__field" key={field.name} data-contact-field>
            <label htmlFor={id}><span><span aria-hidden="true">0{index + 1} / </span>{field.label}</span><span className="contact-form__required">REQUIRED</span></label>
            <div className="contact-form__control">
              {field.name === "message" ? <textarea {...shared} rows="3" /> : <input {...shared} type={field.type} autoComplete={field.autoComplete} />}
              <span className="contact-form__focus-rule" aria-hidden="true" />
            </div>
            <p className="contact-form__error" id={`${id}-error`}>{errors[field.name] || ""}</p>
          </div>
        );
      })}
      <button className="contact-form__submit" type="submit" data-contact-magnetic data-cursor="open" data-cursor-label="EMAIL DRAFT">
        <span data-contact-magnet-inner><span>OPEN EMAIL DRAFT</span><span className="contact-form__arrow" aria-hidden="true">↗</span></span>
      </button>
      <p className="contact-form__note" id="contact-form-note">Opens your email app. You review and send the message there; this form does not send it directly.</p>
      <p className="contact-form__status" role="status" aria-live="polite" aria-atomic="true">{status}</p>
    </form>
  );
}
