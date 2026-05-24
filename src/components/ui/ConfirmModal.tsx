import React from "react";
import Modal from "./Modal";
import Button from "./Button";

interface ConfirmModalProps {
  open: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Modal dialog for confirming user actions (e.g., delete, submit).
 * @param {ConfirmModalProps} props
 * @param {boolean} props.open - Whether the modal is open.
 * @param {string} [props.title] - Title of the modal.
 * @param {string} props.message - Confirmation message.
 * @param {string} [props.confirmText] - Confirm button text.
 * @param {string} [props.cancelText] - Cancel button text.
 * @param {() => void} props.onConfirm - Handler for confirm action.
 * @param {() => void} props.onCancel - Handler for cancel action.
 * @returns {JSX.Element | null}
 */
const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  title = "Are you sure?",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;
  return (
    <Modal onClose={onCancel} ariaLabel={title}>
      <div className="p-2 md:p-4">
        <h2 className="mb-4 text-lg font-semibold text-[var(--color-honey)] text-center">
          {title}
        </h2>
        <p className="mb-6 text-base text-center text-[var(--text)]">
          {message}
        </p>
        <div className="flex justify-center gap-4 pt-2 pb-2 md:pt-4 md:pb-4">
          <Button
            type="button"
            variant="outline"
            size="md"
            aria-label={cancelText}
            onClick={onCancel}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant="danger"
            size="md"
            aria-label={confirmText}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
