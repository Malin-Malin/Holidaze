import ButtonLink from "../components/ui/ButtonLink";

const NotFoundPage = () => {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(70%_45%_at_50%_0%,rgba(246,177,116,0.16),transparent_65%)]" />

      <div className="mx-auto flex min-h-[70vh] w-full max-w-4xl flex-col items-center justify-center px-6 py-20 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-honey)]">
          Error 404
        </p>

        <h1 className="mt-4 text-4xl font-bold tracking-tight text-[var(--text-h)] dark:text-white sm:text-5xl md:text-6xl">
          Page not found
        </h1>

        <p className="mt-5 max-w-2xl text-base text-[var(--text)]/90 dark:text-white/80 md:text-lg">
          The page you are looking for does not exist or has been moved.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <ButtonLink to="/" size="lg" aria-label="Go to home page">
            Back to home
          </ButtonLink>
          <ButtonLink to="/venues" size="lg" variant="secondary" aria-label="Browse venues">
            Browse venues
          </ButtonLink>
        </div>
      </div>
    </section>
  );
};

export default NotFoundPage;
