import { useState } from "react";
import { NavLink } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";

export function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative md:hidden">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="inline-flex h-10 w-10 items-center justify-center rounded text-[var(--color-honey)] transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-honey)]"
        aria-expanded={isOpen}
        aria-controls="mobile-nav-menu"
        aria-label="Toggle navigation menu"
      >
        <RxHamburgerMenu size={30} aria-hidden="true" />
      </button>

      {isOpen && (
        <nav
          id="mobile-nav-menu"
          className="absolute -right-6 z-40 mt-2 min-w-40 bg-[var(--color-ink)] p-2 shadow-2xl"
          aria-label="Mobile"
        >
          <NavLink
            to="/"
            onClick={() => setIsOpen(false)}
            className="block rounded px-3 py-2 text-[var(--color-nav-link)] transition hover:bg-white/10"
          >
            Home
          </NavLink>
          <NavLink
            to="/"
            onClick={() => setIsOpen(false)}
            className="block rounded px-3 py-2 text-[var(--color-nav-link)] transition hover:bg-white/10"
          >
            Venues
          </NavLink>
          <NavLink
            to="/profile"
            onClick={() => setIsOpen(false)}
            className="block rounded px-3 py-2 text-[var(--color-nav-link)] transition hover:bg-white/10"
          >
            Profile
          </NavLink>
        </nav>
      )}
    </div>
  );
}
