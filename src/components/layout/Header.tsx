import { NavLink } from "react-router-dom";

import HamburgerMenu from "./HamburgerMenu";

import { useAuth } from "../../hooks/useAuth";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/venues", label: "Venues" },
  { href: "/profile", label: "Profile", authOnly: true },
  { href: "/login", label: "Login", notAuthOnly: true },
];

const Header = () => {
  const { isLoggedIn } = useAuth();
  return (
    <header className="sticky top-0 z-50 ml-[calc(50%-50vw)] w-screen border-b border-[var(--color-nav-link)]/15 [background:var(--surface-shell)] font-brand">
      <section className="mx-auto flex w-full max-w-[1126px] items-center justify-between px-6 py-4">
        <a href="/" className="px-2 py-1">
          <span className="font-brand text-4xl text-[var(--shell-accent)]">
            Holidaze
          </span>
        </a>
        <nav className="hidden items-center gap-2 md:flex">
          {NAV_LINKS.map(({ href, label, authOnly, notAuthOnly }) => {
            if ((authOnly && !isLoggedIn) || (notAuthOnly && isLoggedIn))
              return null;
            return (
              <NavLink
                key={href}
                to={href}
                end
                className={({ isActive }) =>
                  `rounded px-3 py-2 text-[var(--color-nav-link)] transition hover:underline hover:decoration-[var(--shell-underline)] hover:underline-offset-4 ${isActive ? "underline decoration-[var(--shell-underline)] underline-offset-4" : ""}`
                }
              >
                {label}
              </NavLink>
            );
          })}
        </nav>
        <HamburgerMenu />
      </section>
    </header>
  );
};

export default Header;
