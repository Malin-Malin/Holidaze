import ButtonLink from "./ButtonLink";

type WideCardProps = {
  title: string;
  children: React.ReactNode;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
};

const WideCard = ({
  title,
  children,
  primaryButtonText,
  primaryButtonLink,
  secondaryButtonText,
  secondaryButtonLink,
}: WideCardProps) => {
  return (
    <div className="py-4">
      <section className="relative overflow-hidden rounded-lg border border-[var(--border)] bg-[linear-gradient(125deg,#f9f3ec_0%,#f4e5d3_48%,#ecd0b0_100%)] px-6 py-14 text-center shadow-lg dark:bg-[linear-gradient(125deg,var(--color-ink)_0%,#1a2f2f_45%,#2a3a2f_100%)] md:px-10 md:py-20">
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[var(--color-honey)]/30 blur-3xl dark:bg-[var(--color-honey)]/20"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-[var(--color-clay)]/20 blur-3xl dark:bg-white/10"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto max-w-2xl">
          <h2 className="mt-5 font-[var(--font-display)] text-4xl font-bold leading-tight text-[var(--text-h)] dark:text-white md:text-6xl">
            {title}
          </h2>
          {children}

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            {primaryButtonText && primaryButtonLink && (
              <ButtonLink to={primaryButtonLink} variant="primary" size="lg" aria-label="{primaryButtonText}">
                {primaryButtonText}
              </ButtonLink>
            )}
            {secondaryButtonText && secondaryButtonLink && (
              <ButtonLink
                to={secondaryButtonLink}
                variant="secondary"
                size="lg"
              >
                {secondaryButtonText}
              </ButtonLink>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default WideCard;
