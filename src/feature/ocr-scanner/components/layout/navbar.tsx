
import { useState } from "react";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur">
      <nav
        className="mx-auto flex max-w-6xl flex-wrap items-center justify-between px-5 py-4 sm:px-8"
        aria-label="Main navigation"
      >
        <a href="/" className="group flex items-center gap-3">
          <div className="flex items-center justify-center rounded-xl bg-white px-2.5 py-1.5 shadow-sm ring-1 ring-white/20 transition group-hover:scale-[1.02]">
            <img
              src="/ocr-logo.png"
              alt="OcrTextFinder Logo"
              className="h-7 w-auto object-contain"
            />
          </div>

          <span>
            <span className="block text-lg font-bold tracking-tight text-white transition group-hover:text-violet-300">
              OcrTextFinder
            </span>
            <span className="block text-[10px] font-semibold tracking-wider uppercase text-zinc-400">
              Document OCR
            </span>
          </span>
        </a>

        <button
          type="button"
          className="rounded-lg border border-zinc-700 p-2 text-zinc-300 hover:bg-zinc-800 md:hidden"
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            {isMenuOpen ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>

      </nav>
    </header>
  );
}

export default Navbar;
