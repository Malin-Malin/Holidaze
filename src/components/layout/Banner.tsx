import "./Banner.css";
import type { ReactNode } from "react";

type BannerProps = {
  imageUrl?: string;
  imageAlt?: string;
  ariaLabel?: string;
  title?: string;
  children?: ReactNode;
};

/**
 * Banner component for displaying a hero image, title, and optional children.
 * @param {BannerProps} props
 * @param {string} [props.imageUrl] - URL of the banner image.
 * @param {string} [props.imageAlt] - Alt text for the image.
 * @param {string} [props.ariaLabel] - Accessible label for the banner.
 * @param {string} [props.title] - Title text to display.
 * @param {ReactNode} [props.children] - Optional children to render instead of the title.
 * @returns {JSX.Element}
 */
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
