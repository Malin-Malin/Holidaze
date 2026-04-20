export const Header = () => {
  return (
    <header className="flex items-center justify-between bg-[var(--color-ink)] px-6 py-4 font-[var(--font-brand)]">
      <a href="/" className="px-2 py-1">
        <span className="text-2xl tracking-wide text-[var(--color-honey)]">
          Holidaze
        </span>
      </a>
      <nav className="flex items-center gap-2">
        <a
          className="rounded px-3 py-2 text-[var(--color-nav-link)] transition hover:bg-white/10"
          href="/"
        >
          Home
        </a>
        <a
          className="rounded px-3 py-2 text-[var(--color-nav-link)] transition hover:bg-white/10"
          href="/venues"
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
    </header>
  );
};
