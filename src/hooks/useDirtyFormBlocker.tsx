import { useState, useRef, useCallback } from "react";
import { useBlocker, useNavigate } from "react-router-dom";

/**
 * useDirtyFormBlocker - Custom hook to block navigation when there are unsaved changes in a form.
 * Returns: { showModal, handleConfirm, handleCancel }
 */
export function useDirtyFormBlocker(dirty: boolean) {
  const [showModal, setShowModal] = useState(false);
  const nextLocation = useRef<string | null>(null);
  const isBypassingBlocker = useRef(false);
  const navigate = useNavigate();

  useBlocker(
    useCallback(
      (args) => {
        if (isBypassingBlocker.current) {
          isBypassingBlocker.current = false;
          return false; // allow navigation
        }
        if (dirty) {
          nextLocation.current =
            args.nextLocation.pathname +
            args.nextLocation.search +
            args.nextLocation.hash;
          setShowModal(true);
          return true;
        }
        return false;
      },
      [dirty],
    ),
  );

  const handleConfirm = useCallback(() => {
    setShowModal(false);
    if (nextLocation.current) {
      isBypassingBlocker.current = true;
      navigate(nextLocation.current, { replace: true });
      nextLocation.current = null;
    }
  }, [navigate]);

  const handleCancel = useCallback(() => {
    setShowModal(false);
    nextLocation.current = null;
  }, []);

  return { showModal, handleConfirm, handleCancel };
}
