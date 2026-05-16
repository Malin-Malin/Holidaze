import placeholderImage from "../../assets/placeholderImage.jpg";
import SafeImage from "../ui/SafeImage";

import type { Media } from "../../types/common.types";

export type GalleryImageProps = {
  image: Media;
  className?: string;
};

export default function GalleryImage({ image, className }: GalleryImageProps) {
  return (
    <SafeImage
      src={image.url}
      alt={image.alt}
      fallbackSrc={placeholderImage}
      fallbackAlt="Venue image"
      className={className}
    />
  );
}
