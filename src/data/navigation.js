import { contactSocialLinks } from "./contact.js";

export const navigationLinks = [
  { label: "About", href: "#about" },
  { label: "Expertise", href: "#expertise" },
  { label: "Experience", href: "#experience" },
  { label: "Work", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

// Preserve the approved two-link mobile footer; URLs are now confirmed.
export const socialLinks = contactSocialLinks.filter(({ label }) => label !== "Instagram");

