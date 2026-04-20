import "./banner.css";

// TODO: this bannerinfo should change from side to side
// TODO: The font looks a bit off, check the font-family and make sure it is applied correctly
export const Banner = () => {
  return (
    <section
      className="banner-hero relative flex min-h-[320px] items-end justify-end bg-cover bg-center p-6"
      aria-label="Holidaze banner"
    >
      <div className="absolute inset-0 bg-black/35" aria-hidden="true" />
      <div className="relative z-10 text-right">
        <span className="block uppercase text-4xl font-bold font-[var(--font-display)] text-[var(--color-honey)]">
          Holidaze
        </span>
        <p className="mt-2 text-lg font-[var(--font-display)] text-[var(--color-honey)]">
          Choose us to book your holiday
        </p>
      </div>
    </section>
  );
};
