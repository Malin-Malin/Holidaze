import { useEffect } from "react";

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
    <div
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
        <button
          type="button"
          onClick={onClose}
          className="absolute right-2 top-2 z-10 cursor-pointer rounded-full bg-black/60 px-3 py-1 text-2xl leading-none text-white hover:bg-black/80"
          aria-label="Close fullscreen gallery"
        >
          x
        </button>

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
            <button
              type="button"
              onClick={() =>
                onActiveIndexChange(
                  activeIndex === 0 ? totalImages - 1 : activeIndex - 1,
                )
              }
              className="absolute left-2 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-black/60 px-3 py-1 text-2xl text-white hover:bg-black/80"
              aria-label="Show previous image"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() =>
                onActiveIndexChange(
                  activeIndex === totalImages - 1 ? 0 : activeIndex + 1,
                )
              }
              className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-black/60 px-3 py-1 text-2xl text-white hover:bg-black/80"
              aria-label="Show next image"
            >
              ›
            </button>
          </>
        )}
      </div>
    </div>
  );
}
