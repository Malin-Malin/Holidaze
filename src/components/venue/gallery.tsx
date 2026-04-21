import { useState } from "react";
import type { Media } from "../../types/common.types";

type GalleryProps = {
  media: Media[];
};

export default function Gallery({ media }: GalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (media.length === 0) {
    return <p>No images available.</p>;
  }

  const activeMedia = media[activeIndex];

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
        <div className="flex gap-3 overflow-x-auto md:h-80 md:w-24 md:flex-col md:overflow-x-visible">
          {media.map((image, index) => (
            <button
              key={`${image.url}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`shrink-0 overflow-hidden rounded-md border md:flex-1 ${
                index === activeIndex
                  ? "border-[var(--color-honey)]"
                  : "border-transparent"
              }`}
              aria-label={`Show image ${index + 1}`}
            >
              <img
                src={image.url}
                alt={image.alt || `Venue image ${index + 1}`}
                className="h-20 w-20 object-cover md:h-full md:w-full"
              />
            </button>
          ))}
        </div>
      )}

      <div className="relative flex-1 overflow-hidden rounded-lg">
        <img
          src={activeMedia.url}
          alt={activeMedia.alt || "Venue image"}
          className="h-80 w-full object-cover"
        />
        {media.length > 1 && (
          <>
            <button
              type="button"
              onClick={showPrevious}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/55 px-3 py-2 text-white"
              aria-label="Show previous image"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={showNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/55 px-3 py-2 text-white"
              aria-label="Show next image"
            >
              ›
            </button>
          </>
        )}
      </div>
    </section>
  );
}
