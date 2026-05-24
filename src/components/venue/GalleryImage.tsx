import placeholderImage from "../../assets/placeholderImage.jpg";
import SafeImage from "../ui/SafeImage";

import type { Media } from "../../types/common.types";

export type GalleryImageProps = {
  image: Media;
  className?: string;
};

/**
 * Component for displaying a single gallery image with fallback support.
 * @param {GalleryImageProps} props
 * @param {Media} props.image - The image to display.
 * @param {string} [props.className] - Additional CSS classes.
 * @returns {JSX.Element}
 */
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
