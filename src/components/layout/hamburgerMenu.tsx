import { useState } from "react";
import { NavLink } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import { useEffect } from "react";
import { useRef } from "react";

import { useAuth } from "../../hooks/useAuth";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/venues", label: "Venues" },
  { href: "/venues/new", label: "Create Venue", managerOnly: true },
  { href: "/profile", label: "Profile", authOnly: true },
  { href: "/login", label: "Login", notAuthOnly: true },
];

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { isLoggedIn, user, logout } = useAuth();
  const isVenueManager = Boolean(user?.venueManager);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative md:hidden" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="inline-flex h-10 w-10 items-center justify-center rounded text-[var(--shell-accent)] transition hover:bg-white/10 hover:ring-1 hover:ring-[var(--shell-accent)]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--shell-accent)]"
        aria-expanded={isOpen}
        aria-controls="mobile-nav-menu"
        aria-label="Toggle navigation menu"
      >
        <RxHamburgerMenu size={30} aria-hidden="true" />
      </button>

      {isOpen && (
        <nav
          id="mobile-nav-menu"
          className="absolute -right-6 z-40 mt-2 min-w-40 rounded border border-[var(--color-nav-link)]/20 [background:var(--surface-shell)] p-2 shadow-2xl"
          aria-label="Mobile"
        >
          {NAV_LINKS.map(
            ({ href, label, authOnly, notAuthOnly, managerOnly }) => {
              if (
                (authOnly && !isLoggedIn) ||
                (notAuthOnly && isLoggedIn) ||
                (managerOnly && !isVenueManager)
              )
                return null;
              return (
                <NavLink
                  key={href}
                  to={href}
                  onClick={() => setIsOpen(false)}
                  end
                  className={({ isActive }) =>
                    `block rounded px-3 py-2 text-[var(--color-nav-link)] transition hover:underline hover:decoration-[var(--shell-underline)] hover:underline-offset-4 ${isActive ? "underline decoration-[var(--shell-underline)] underline-offset-4" : ""}`
                  }
                >
                  {label}
                </NavLink>
              );
            },
          )}
          {isLoggedIn && (
            <NavLink
              to="/"
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="block rounded px-3 py-2 text-[var(--color-nav-link)] transition hover:underline hover:decoration-[var(--shell-underline)] hover:underline-offset-4"
            >
              Logout
            </NavLink>
          )}
        </nav>
      )}
    </div>
  );
};

export default HamburgerMenu;
