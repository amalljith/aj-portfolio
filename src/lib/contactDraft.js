import { contact } from "../data/contact.js";

// Kept separate from the view so a future delivery adapter can reuse validation.
export function validateContact(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = "Enter your name.";
  if (!values.email.trim()) errors.email = "Enter your email address.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = "Enter a valid email address.";
  if (!values.message.trim()) errors.message = "Enter a message.";
  return errors;
}

export function createContactDraft(values) {
  const name = values.name.trim().replace(/[\r\n]+/g, " ");
  const email = values.email.trim();
  const message = values.message.trim().replace(/\r\n?/g, "\n");
  const subject = `Portfolio enquiry from ${name}`;
  const body = `Name: ${name}\r\nEmail: ${email}\r\n\r\n${message.replace(/\n/g, "\r\n")}`;
  return `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
