import Navbar from "./components/layout/Navbar.jsx";
import Hero from "./components/sections/Hero.jsx";

export default function App() {
  return (
    <div className="flex min-h-svh flex-col bg-surface text-ink">
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
        <Hero />
      </main>
    </div>
  );
}
