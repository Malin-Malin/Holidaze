import { useEffect } from "react";

import CircleIconButton from "../ui/CircleIconButton";

import placeholderImage from "../../assets/placeholderImage.jpg";

import type { Media } from "../../types/common.types";

type GalleryLightboxProps = {
  media: Media[];
  activeIndex: number;
  failedUrls: Record<string, boolean>;
  onImageError: (url: string) => void;
  onActiveIndexChange: (nextIndex: number) => void;
  onClose: () => void;
};

/**
 * Lightbox component for displaying images in a modal with navigation.
 * @param {GalleryLightboxProps} props
 * @param {Media[]} props.media - Array of media objects.
 * @param {number} props.activeIndex - Index of the active image.
 * @param {Record<string, boolean>} props.failedUrls - Map of failed image URLs.
 * @param {(url: string) => void} props.onImageError - Handler for image load errors.
 * @param {(nextIndex: number) => void} props.onActiveIndexChange - Handler for changing active image.
 * @param {() => void} props.onClose - Handler to close the lightbox.
 * @returns {JSX.Element}
 */
export default function GalleryLightbox({
  media,
  activeIndex,
  failedUrls,
  onImageError,
  onActiveIndexChange,
  onClose,
}: GalleryLightboxProps) {
  const totalImages = media.length;
  const activeMedia = media[activeIndex];

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (totalImages <= 1) return;

      if (event.key === "ArrowLeft") {
        onActiveIndexChange(
          activeIndex === 0 ? totalImages - 1 : activeIndex - 1,
        );
      }

      if (event.key === "ArrowRight") {
        onActiveIndexChange(
          activeIndex === totalImages - 1 ? 0 : activeIndex + 1,
        );
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, onActiveIndexChange, onClose, totalImages]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  if (!activeMedia) {
    return null;
  }

  const showPlaceholder =
    !activeMedia.url || Boolean(failedUrls[activeMedia.url]);

  return (
    <section
      role="dialog"
      aria-modal="true"
      aria-label="Fullscreen image viewer"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl"
        onClick={(event) => event.stopPropagation()}
      >
        <CircleIconButton
          onClick={onClose}
          className="absolute right-2 top-2 z-10"
          aria-label="Close fullscreen gallery"
          size="md"
        >
          ×
        </CircleIconButton>

        <img
          src={showPlaceholder ? placeholderImage : activeMedia.url}
          alt={activeMedia.alt || "Venue image"}
          onError={() => {
            if (!activeMedia.url) return;
            onImageError(activeMedia.url);
          }}
          className="max-h-[85vh] w-full rounded-md object-contain"
        />

        {totalImages > 1 && (
          <>
            <CircleIconButton
              onClick={() =>
                onActiveIndexChange(
                  activeIndex === 0 ? totalImages - 1 : activeIndex - 1,
                )
              }
              className="absolute left-2 top-1/2 -translate-y-1/2"
              aria-label="Show previous image"
              size="lg"
            >
              ‹
            </CircleIconButton>
            <CircleIconButton
              onClick={() =>
                onActiveIndexChange(
                  activeIndex === totalImages - 1 ? 0 : activeIndex + 1,
                )
              }
              className="absolute right-2 top-1/2 -translate-y-1/2"
              aria-label="Show next image"
              size="lg"
            >
              ›
            </CircleIconButton>
          </>
        )}
      </div>
    </section>
  );
}
