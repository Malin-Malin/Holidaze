import { useState } from "react";
import { NavLink } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useRef } from "react";
import { useAuth } from "../../hooks/useAuth";

export function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
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
  }, [location.pathname]);

  return (
    <div className="relative md:hidden" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="inline-flex h-10 w-10 items-center justify-center rounded text-[var(--color-honey)] transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-honey)]]"
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
          {isLoggedIn && (
            <>
              {isVenueManager && (
                <NavLink
                  to="/create-venue"
                  onClick={() => setIsOpen(false)}
                  className="block rounded px-3 py-2 text-[var(--color-nav-link)] transition hover:bg-white/10"
                >
                  Create venues
                </NavLink>
              )}
              <NavLink
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="block rounded px-3 py-2 text-[var(--color-nav-link)] transition hover:bg-white/10"
              >
                Profile
              </NavLink>
              <button
                type="button"
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="block w-full rounded px-3 py-2 text-center text-[var(--color-nav-link)] transition hover:bg-white/10"
              >
                Logout
              </button>
            </>
          )}
          {!isLoggedIn && (
            <NavLink
              to="/login"
              onClick={() => setIsOpen(false)}
              className="block rounded px-3 py-2 text-[var(--color-honey)] transition hover:bg-white/10"
            >
              Login
            </NavLink>
          )}
        </nav>
      )}
    </div>
  );
}
