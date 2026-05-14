import { useState } from "react";

import placeholderImage from "../../assets/placeholderImage.jpg";

import type { Media } from "../../types/common.types";

export type GalleryImageProps = {
  image: Media;
  className?: string;
};

export default function GalleryImage({ image, className }: GalleryImageProps) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const hasErrorForCurrentUrl = failedUrl === image.url;
  const src =
    hasErrorForCurrentUrl || !image.url ? placeholderImage : image.url;

  return (
    <img
      src={src}
      alt={image.alt || "Venue image"}
      onError={() => setFailedUrl(image.url)}
      className={className}
    />
  );
}
