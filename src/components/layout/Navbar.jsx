import AJLogo from "../branding/AJLogo.jsx";
import CharacterRoll from "../ui/CharacterRoll.jsx";
import MobileMenuToggle from "../ui/MobileMenuToggle.jsx";
import MobileNavigation from "./MobileNavigation.jsx";
import useMobileNavigation from "../../hooks/useMobileNavigation.js";
import { navigationLinks } from "../../data/navigation.js";

export default function Navbar() {
  const {
    open, active, panelId, shellRef, panelRef, toggleRef, homeRef,
    toggle, navigate, navigateHome,
  } = useMobileNavigation();

  return (
    <div
      ref={shellRef}
      className="navbar-shell"
      data-menu-active={active}
      role={active ? "dialog" : undefined}
      aria-modal={active ? true : undefined}
      aria-label={active ? "Mobile navigation" : undefined}
    >
      <header className="site-navbar border-b border-accent/30 bg-surface px-gutter text-accent">
        <nav
          aria-label="Primary navigation"
          className="mx-auto flex min-h-[calc(var(--navbar-height)-var(--border-width-thin))] max-w-content items-center justify-between gap-8 py-4"
        >
          <a
            ref={homeRef}
            href="/"
            aria-label="Amal Jith — home"
            onClick={navigateHome}
            className="inline-flex min-h-11 shrink-0 items-center"
          >
            <AJLogo decorative className="h-12 w-auto" />
          </a>

          <ul className="hidden items-center gap-8 font-mono text-nav uppercase lg:flex">
            {navigationLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={`character-roll-trigger inline-flex min-h-11 items-center whitespace-nowrap ${
                    link.href === "#contact"
                      ? "border border-accent px-4 hover:bg-accent hover:text-surface focus-visible:bg-accent focus-visible:text-surface"
                      : ""
                  }`}
                >
                  <CharacterRoll text={link.label} />
                </a>
              </li>
            ))}
          </ul>

          <MobileMenuToggle
            open={open}
            onToggle={toggle}
            controls={panelId}
            buttonRef={toggleRef}
          />
        </nav>
      </header>
      <MobileNavigation
        id={panelId}
        panelRef={panelRef}
        active={active}
        open={open}
        links={navigationLinks}
        onNavigate={navigate}
      />
    </div>
  );
}
