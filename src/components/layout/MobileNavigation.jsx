import "./MobileNavigation.css";
import { socialLinks } from "../../data/navigation.js";

const availableSocialLinks = socialLinks.filter(({ href }) => (
  typeof href === "string" && /^https?:\/\//.test(href)
));

export default function MobileNavigation({ id, panelRef, active, open, links, onNavigate }) {
  return (
    <div
      id={id}
      ref={panelRef}
      className="mobile-navigation"
      hidden={!active}
      aria-hidden={!open}
      inert={!open}
    >
      <div className="mobile-navigation__content">
        <nav aria-label="Mobile navigation">
          <ol className="mobile-navigation__list">
            {links.map((link, index) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="mobile-navigation__link"
                  data-menu-link
                  onClick={(event) => onNavigate(event, link.href)}
                >
                  <span className="mobile-navigation__number" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="mobile-navigation__label">
                    <span className="mobile-navigation__label-text">{link.label}</span>
                    <span className="mobile-navigation__arrow" aria-hidden="true">→</span>
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <footer
          className="mobile-navigation__footer"
          hidden={availableSocialLinks.length === 0}
          data-menu-footer
        >
          {availableSocialLinks.map((link) => (
            <a key={link.label} href={link.href} className="mobile-navigation__social">
              {link.label}
              <span aria-hidden="true">↗</span>
            </a>
          ))}
        </footer>
      </div>
    </div>
  );
}
