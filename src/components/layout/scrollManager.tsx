import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

type ScrollPositions = Record<string, number>;

const STORAGE_KEY = "holidaze:scroll-positions";

function readPositions(): ScrollPositions {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as ScrollPositions;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writePositions(positions: ScrollPositions) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
  } catch {
    // Ignore write errors (e.g. quota exceeded)
  }
}

function applyScrollY(y: number) {
  window.scrollTo(0, y);
  requestAnimationFrame(() => {
    window.scrollTo(0, y);
  });
}

const ScrollManager = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const positionsRef = useRef<ScrollPositions>(readPositions());

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    const key = location.key;
    const positions = positionsRef.current;

    return () => {
      positions[key] = window.scrollY;
      writePositions(positions);
    };
  }, [location.key]);

  useLayoutEffect(() => {
    if (navigationType === "POP") {
      const savedY = positionsRef.current[location.key] ?? 0;
      applyScrollY(savedY);
      return;
    }

    applyScrollY(0);
  }, [location.key, navigationType]);

  return null;
};

export default ScrollManager;
