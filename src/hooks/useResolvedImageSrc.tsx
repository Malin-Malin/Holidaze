import { useEffect, useState } from "react";

/**
 * Custom hook to resolve an image source, falling back if the image fails to load.
 * @param {string | null | undefined} src - The primary image source URL.
 * @param {string} fallbackSrc - The fallback image source URL if the primary fails.
 * @returns {string} The resolved image source URL.
 */
export function useResolvedImageSrc(
  src: string | null | undefined,
  fallbackSrc: string,
): string {
  const normalizedSrc = src?.trim() || "";
  const [loadedSrc, setLoadedSrc] = useState("");

  useEffect(() => {
    if (!normalizedSrc) {
      return;
    }

    let isCancelled = false;
    const image = new Image();

    image.onload = () => {
      if (!isCancelled) {
        setLoadedSrc(normalizedSrc);
      }
    };

    image.onerror = () => {
      if (!isCancelled) {
        setLoadedSrc("");
      }
    };

    image.src = normalizedSrc;

    return () => {
      isCancelled = true;
    };
  }, [normalizedSrc]);

  return normalizedSrc && loadedSrc === normalizedSrc ? loadedSrc : fallbackSrc;
}
