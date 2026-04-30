import { useAuth } from "../../hooks/useAuth";
import { HamburgerMenu } from "./hamburgerMenu";

export const Header = () => {
  const { isLoggedIn } = useAuth();
  return (
    <header className="sticky top-0 z-50 ml-[calc(50%-50vw)] w-screen bg-[var(--color-ink)] font-[var(--font-brand)]">
      <div className="mx-auto flex w-full max-w-[1126px] items-center justify-between px-6 py-4">
        <a href="/" className="px-2 py-1">
          <span className="font-[var(--font-brand)] text-4xl text-[var(--color-honey)]">
            Holidaze
          </span>
        </a>
        <nav className="hidden items-center gap-2 md:flex">
          <a
            className="rounded px-3 py-2 text-[var(--color-nav-link)] transition hover:bg-white/10"
            href="/"
          >
            Home
          </a>
          <a
            className="rounded px-3 py-2 text-[var(--color-nav-link)] transition hover:bg-white/10"
            href="/create-venue"
          >
            Create venues
          </a>
          <a
            className="rounded px-3 py-2 text-[var(--color-nav-link)] transition hover:bg-white/10"
            href="/profile"
          >
            Profile
          </a>
          {!isLoggedIn && (
            <a
              className="rounded px-3 py-2 text-[var(--color-nav-link)] transition hover:bg-white/10"
              href="/login"
            >
              Login
            </a>
          )}
        </nav>
        <HamburgerMenu />
      </div>
    </header>
  );
};
