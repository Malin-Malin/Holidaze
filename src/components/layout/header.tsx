import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { HamburgerMenu } from "./hamburgerMenu";

export const Header = () => {
  const { isLoggedIn, user } = useAuth();
  const isVenueManager = Boolean(user?.venueManager);
  return (
    <header className="sticky top-0 z-50 ml-[calc(50%-50vw)] w-screen bg-[var(--color-ink)] font-[var(--font-brand)]">
      <div className="mx-auto flex w-full max-w-[1126px] items-center justify-between px-6 py-4">
        <a href="/" className="px-2 py-1">
          <span className="font-[var(--font-brand)] text-4xl text-[var(--color-honey)]">
            Holidaze
          </span>
        </a>
        <nav className="hidden items-center gap-2 md:flex">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `rounded px-3 py-2 text-[var(--color-nav-link)] transition hover:underline hover:decoration-[var(--color-honey)] hover:underline-offset-4 ${isActive ? "underline decoration-[var(--color-honey)] underline-offset-4" : ""}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/venues"
            end
            className={({ isActive }) =>
              `rounded px-3 py-2 text-[var(--color-nav-link)] transition hover:underline hover:decoration-[var(--color-honey)] hover:underline-offset-4 ${isActive ? "underline decoration-[var(--color-honey)] underline-offset-4" : ""}`
            }
          >
            Venue
          </NavLink>
          {isLoggedIn && (
            <>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `rounded px-3 py-2 text-[var(--color-nav-link)] transition hover:underline hover:decoration-[var(--color-honey)] hover:underline-offset-4 ${isActive ? "underline decoration-[var(--color-honey)] underline-offset-4" : ""}`
                }
              >
                Profile
              </NavLink>
            </>
          )}
          {!isLoggedIn && (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `rounded px-3 py-2 text-[var(--color-honey)] transition hover:underline hover:decoration-[var(--color-honey)] hover:underline-offset-4 ${isActive ? "underline decoration-[var(--color-honey)] underline-offset-4" : ""}`
              }
            >
              Login
            </NavLink>
          )}
        </nav>
        <HamburgerMenu />
      </div>
    </header>
  );
};
