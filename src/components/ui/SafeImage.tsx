import { useEffect, useState } from "react";
import type { ComponentPropsWithoutRef, SyntheticEvent } from "react";

type SafeImageProps = Omit<ComponentPropsWithoutRef<"img">, "src" | "alt"> & {
  src?: string | null;
  alt?: string;
  fallbackSrc: string;
  fallbackAlt?: string;
};

/**
 * Image component with fallback support for broken or missing images.
 * @param {SafeImageProps} props
 * @param {string} [props.src] - Primary image source URL.
 * @param {string} [props.alt] - Alt text for the image.
 * @param {string} props.fallbackSrc - Fallback image source URL.
 * @param {string} [props.fallbackAlt] - Fallback alt text.
 * @returns {JSX.Element}
 */
function SafeImage({
  src,
  alt,
  fallbackSrc,
  fallbackAlt = "Image",
  onError,
  ...imgProps
}: SafeImageProps) {
  const normalizedSrc = src?.trim() ? src : fallbackSrc;
  const normalizedAlt = alt?.trim() ? alt : fallbackAlt;
  const [currentSrc, setCurrentSrc] = useState(normalizedSrc);

  useEffect(() => {
    setCurrentSrc(normalizedSrc);
  }, [normalizedSrc]);

  function handleError(event: SyntheticEvent<HTMLImageElement, Event>) {
    if (currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    }

    onError?.(event);
  }

  return (
    <img
      {...imgProps}
      src={currentSrc}
      alt={normalizedAlt}
      onError={handleError}
    />
  );
}

export default SafeImage;
