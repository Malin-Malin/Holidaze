import React, { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import "./Modal.css";

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
  ariaLabel: string;
}

/**
 * Modal dialog component for displaying overlay content.
 * Handles focus, keyboard, and overlay interactions.
 * @param {ModalProps} props
 * @param {React.ReactNode} props.children - Modal content.
 * @param {() => void} props.onClose - Handler to close the modal.
 * @param {string} props.ariaLabel - Accessible label for the modal.
 * @returns {JSX.Element}
 */
const Modal: React.FC<ModalProps> = ({ children, onClose, ariaLabel }) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    if (contentRef.current) {
      contentRef.current.focus();
    }
    return () => {
      if (previouslyFocused && previouslyFocused.focus)
        previouslyFocused.focus();
    };
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === overlayRef.current) onClose();
    },
    [onClose],
  );

  return (
    <div
      ref={overlayRef}
      className="modalOverlay"
      aria-modal="true"
      role="dialog"
      aria-label={ariaLabel}
      tabIndex={-1}
      onClick={handleOverlayClick}
    >
      <div
        ref={contentRef}
        className="modalContent"
        tabIndex={0}
        style={{ outline: "none" }}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
