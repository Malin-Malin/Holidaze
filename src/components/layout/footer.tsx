export const Footer = () => {
  return (
    <footer className="relative left-1/2 right-1/2 mt-auto w-screen -translate-x-1/2 bg-[var(--color-ink)] text-[var(--color-nav-link)]">
      <div className="mx-auto w-full max-w-[1126px] px-6 py-6 text-left">
        <p className="mb-3 font-[var(--font-brand)] text-[var(--color-honey)]">
          footerlogo
        </p>
        <nav className="mb-4 flex flex-wrap gap-4">
          <a className="transition hover:text-[var(--color-honey)]" href="/">
            Home
          </a>
          <a
            className="transition hover:text-[var(--color-honey)]"
            href="/venues"
          >
            Venues
          </a>
          <a
            className="transition hover:text-[var(--color-honey)]"
            href="/profile"
          >
            Profile
          </a>
        </nav>
        <p>Popular travels</p>
        <p>list of popular travels</p>
        <div>footersearch</div>
        <p>Suggested fill: info about us contact info</p>
        <p>social media links</p>
        <p>copyright notice</p>
      </div>
    </footer>
  );
};
