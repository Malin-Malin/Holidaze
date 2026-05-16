import { useEffect, useState } from "react";

type UseResolvedImageSrcOptions = {
  src?: string | null;
  fallbackSrc: string;
};

export function useResolvedImageSrc({
  src,
  fallbackSrc,
}: UseResolvedImageSrcOptions) {
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
