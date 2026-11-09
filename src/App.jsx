import Navbar from "./components/layout/Navbar.jsx";

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
        className="flex flex-1 items-center justify-center px-gutter py-12"
      >
        <div className="w-full max-w-content text-center">
          <p className="font-mono text-label uppercase">Python Developer</p>
          <h1 className="my-4 font-display text-display font-normal text-balance text-accent uppercase">
            Amal Jith
          </h1>
          <p className="font-body">Portfolio in preparation.</p>
        </div>
      </main>
    </div>
  );
}
