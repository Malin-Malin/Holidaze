import { useEffect, useRef, useState } from "react";
import { MdOutlineImageNotSupported } from "react-icons/md";

import "./gallery.css";
import GalleryImage from "./GalleryImage";
import GalleryLightbox from "./GalleryLightbox";

import placeholderImage from "../../assets/placeholderImage.jpg";

import type { Media } from "../../types/common.types";

type GalleryProps = {
  media: Media[];
};

export default function Gallery({ media }: GalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [failedUrls, setFailedUrls] = useState<Record<string, boolean>>({});
  const mobileThumbRailRef = useRef<HTMLDivElement>(null);
  const desktopThumbRailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (media.length <= 1) {
      return;
    }

    const desktopActiveButton = desktopThumbRailRef.current?.querySelector(
      `[data-thumb-index="${activeIndex}"]`,
    ) as HTMLButtonElement | null;

    if (desktopActiveButton && desktopThumbRailRef.current) {
      const rail = desktopThumbRailRef.current;
      const targetTop =
        desktopActiveButton.offsetTop -
        rail.clientHeight / 2 +
        desktopActiveButton.clientHeight / 2;

      rail.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
    }

    const mobileActiveButton = mobileThumbRailRef.current?.querySelector(
      `[data-thumb-index="${activeIndex}"]`,
    ) as HTMLButtonElement | null;

    if (mobileActiveButton && mobileThumbRailRef.current) {
      const rail = mobileThumbRailRef.current;
      const targetLeft =
        mobileActiveButton.offsetLeft -
        rail.clientWidth / 2 +
        mobileActiveButton.clientWidth / 2;

      rail.scrollTo({ left: Math.max(0, targetLeft), behavior: "smooth" });
    }
  }, [activeIndex, media.length]);

  if (media.length === 0) {
    return (
      <section className="flex flex-col gap-4 md:flex-row md:items-stretch">
        <div className="order-1 relative flex-1 overflow-hidden md:order-2">
          <img
            src={placeholderImage}
            alt="Venue placeholder image"
            className="h-80 w-full object-cover"
          />
          <div
            className="absolute right-3 top-3 p-2 text-white"
            title="Placeholder image"
            aria-label="Placeholder image"
          >
            <MdOutlineImageNotSupported size={30} aria-hidden="true" />
          </div>
        </div>
      </section>
    );
  }

  const activeMedia = media[activeIndex];
  const showPlaceholder =
    !activeMedia.url || Boolean(failedUrls[activeMedia.url]);

  function showPrevious() {
    setActiveIndex((current) =>
      current === 0 ? media.length - 1 : current - 1,
    );
  }

  function showNext() {
    setActiveIndex((current) =>
      current === media.length - 1 ? 0 : current + 1,
    );
  }

  return (
    <section className="flex flex-col gap-4 md:flex-row md:items-stretch">
      {media.length > 1 && (
        <div className="order-2 flex gap-3 md:order-1 md:h-80 md:w-28 md:flex-col">
          <div
            ref={mobileThumbRailRef}
            className="thumb-rail-x flex gap-3 md:hidden"
          >
            {media.map((image, index) => (
              <button
                key={`${image.url}-${index}`}
                type="button"
                data-thumb-index={index}
                onClick={() => setActiveIndex(index)}
                className={`shrink-0 cursor-pointer overflow-hidden rounded-md border ${
                  index === activeIndex
                    ? "border-[var(--color-honey)]"
                    : "border-transparent"
                }`}
                aria-label={`Show image ${index + 1}`}
              >
                <GalleryImage
                  image={image}
                  className="h-20 w-20 object-cover"
                />
              </button>
            ))}
          </div>

          <div className="hidden h-full flex-col items-center md:flex">
            <div
              ref={desktopThumbRailRef}
              className={`px-1 py-0.5 ${media.length <= 2 ? "flex h-full w-full flex-col gap-3" : "thumb-rail-y h-full w-full space-y-3"}`}
            >
              {media.map((image, index) => (
                <button
                  key={`${image.url}-${index}`}
                  type="button"
                  data-thumb-index={index}
                  onClick={() => setActiveIndex(index)}
                  className={`block cursor-pointer overflow-hidden rounded-md border ${
                    media.length <= 2 ? "min-h-0 flex-1" : "h-24 w-full"
                  } ${
                    index === activeIndex
                      ? "border-[var(--color-honey)]"
                      : "border-transparent"
                  }`}
                  aria-label={`Show image ${index + 1}`}
                >
                  <GalleryImage
                    image={image}
                    className={
                      media.length <= 2
                        ? "h-full w-full object-cover"
                        : "h-24 w-full object-cover"
                    }
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="order-1 relative flex-1 overflow-hidden md:order-2">
        <img
          src={showPlaceholder ? placeholderImage : activeMedia.url}
          alt={activeMedia.alt || "Venue image"}
          onClick={() => setIsLightboxOpen(true)}
          onError={() => {
            if (!activeMedia.url) return;
            setFailedUrls((prev) => ({ ...prev, [activeMedia.url]: true }));
          }}
          className="h-80 w-full cursor-zoom-in object-cover"
        />
        {showPlaceholder && (
          <div
            className="absolute right-3 top-3 p-2 text-white"
            title="Placeholder image"
            aria-label="Placeholder image"
          >
            <MdOutlineImageNotSupported size={30} aria-hidden="true" />
          </div>
        )}
        {media.length > 1 && (
          <>
            <button
              type="button"
              onClick={showPrevious}
              className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-black/55 px-3 py-1 text-white"
              aria-label="Show previous image"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={showNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-black/55 px-3 py-1 text-white"
              aria-label="Show next image"
            >
              ›
            </button>
          </>
        )}
      </div>

      {isLightboxOpen && (
        <GalleryLightbox
          media={media}
          activeIndex={activeIndex}
          failedUrls={failedUrls}
          onImageError={(url) => {
            setFailedUrls((prev) => ({ ...prev, [url]: true }));
          }}
          onActiveIndexChange={setActiveIndex}
          onClose={() => setIsLightboxOpen(false)}
        />
      )}
    </section>
  );
}
