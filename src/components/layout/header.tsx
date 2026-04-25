import { HamburgerMenu } from "./hamburgerMenu";

export const Header = () => {
  return (
    <header className="relative z-50 left-1/2 right-1/2 w-screen -translate-x-1/2 bg-[var(--color-ink)] font-[var(--font-brand)]">
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
            href="/"
          >
            Venues
          </a>
          <a
            className="rounded px-3 py-2 text-[var(--color-nav-link)] transition hover:bg-white/10"
            href="/profile"
          >
            Profile
          </a>
        </nav>
        <HamburgerMenu />
      </div>
    </header>
  );
};
