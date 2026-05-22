import { useEffect, useState } from "react";
import type { ComponentPropsWithoutRef, SyntheticEvent } from "react";

type SafeImageProps = Omit<ComponentPropsWithoutRef<"img">, "src" | "alt"> & {
  src?: string | null;
  alt?: string;
  fallbackSrc: string;
  fallbackAlt?: string;
};

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
