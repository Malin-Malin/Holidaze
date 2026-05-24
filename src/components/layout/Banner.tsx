import "./Banner.css";
import type { ReactNode } from "react";

type BannerProps = {
  imageUrl?: string;
  imageAlt?: string;
  ariaLabel?: string;
  title?: string;
  children?: ReactNode;
};

// TODO: The font looks a bit off, check the font-family and make sure it is applied correctly
const Banner = ({
  imageUrl,
  imageAlt,
  ariaLabel = "Holidaze banner",
  title = "Your next escape",
  children,
}: BannerProps) => {
  return (
    <section
      className="banner-hero relative min-h-[320px] bg-cover bg-center"
      aria-label={ariaLabel}
      role="img"
      // only apply background image if imageUrl is provided, otherwise just show the default background from CSS.
      style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined}
    >
      <div className="absolute inset-0 bg-black/35" aria-hidden="true" />
      {imageAlt && <span className="sr-only">{imageAlt}</span>}
      <div className="relative mx-auto flex min-h-[320px] w-full max-w-6xl items-end justify-end p-6">
        <div className="text-right">
          {children ? (
            children
          ) : (
            <span className="block uppercase text-4xl font-display text-[var(--color-honey)]">
              {title}
            </span>
          )}
        </div>
      </div>
    </section>
  );
};

export default Banner;
