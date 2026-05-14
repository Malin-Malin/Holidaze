import "./banner.css";
import type { ReactNode } from "react";

type BannerProps = {
  imageUrl?: string;
  imageAlt?: string;
  ariaLabel?: string;
  children?: ReactNode;
};

// TODO: this bannerinfo should change from side to side
// TODO: The font looks a bit off, check the font-family and make sure it is applied correctly
const Banner = ({
  imageUrl,
  imageAlt,
  ariaLabel = "Holidaze banner",
  children,
}: BannerProps) => {
  return (
    <section
      className="banner-hero relative flex min-h-[320px] items-end justify-end bg-cover bg-center p-6"
      aria-label={ariaLabel}
      role="img"
      // only apply background image if imageUrl is provided, otherwise just show the default background from CSS.
      style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined}
    >
      <div className="absolute inset-0 bg-black/35" aria-hidden="true" />
      {imageAlt && <span className="sr-only">{imageAlt}</span>}
      {children ? (
        <div className="relative z-10">{children}</div>
      ) : (
        <div className="relative z-10 text-right">
          <span className="block uppercase text-4xl font-[var(--font-display)] text-[var(--color-honey)]">
            Your next escape
          </span>
        </div>
      )}
    </section>
  );
};

export default Banner;
