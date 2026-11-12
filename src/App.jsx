import { useCallback, useRef, useState } from "react";
import Navbar from "./components/layout/Navbar.jsx";
import Hero from "./components/sections/Hero.jsx";
import AboutSection from "./components/sections/AboutSection.jsx";
import ExpertiseSection from "./components/sections/ExpertiseSection.jsx";
import Preloader from "./components/preloader/Preloader.jsx";
import SignatureCursor from "./components/cursor/SignatureCursor.jsx";

export default function App() {
  const pageRef = useRef(null);
  const heroRef = useRef(null);
  const [opening, setOpening] = useState(true);
  const completeOpening = useCallback(() => setOpening(false), []);

  return (
    <>
      <div ref={pageRef} className="portfolio-page flex min-h-svh flex-col bg-surface text-ink">
        <a
          href="#main-content"
          className="sr-only font-mono text-label focus:not-sr-only focus:fixed focus:top-4 focus:left-gutter focus:z-50 focus:bg-surface focus:px-4 focus:py-3 focus:text-accent"
        >
          Skip to content
        </a>
        <Navbar />
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1"
        >
          <Hero ref={heroRef} autoPlay={false} />
          <AboutSection motionEnabled={!opening} />
          <ExpertiseSection motionEnabled={!opening} />
        </main>
      </div>
      {opening && <Preloader pageRef={pageRef} heroRef={heroRef} onComplete={completeOpening} />}
      <SignatureCursor enabled={!opening} />
    </>
  );
}
