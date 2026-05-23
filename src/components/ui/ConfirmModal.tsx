import React from "react";
import Modal from "./Modal";

interface ConfirmModalProps {
  open: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

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
          <button
            type="button"
            className="rounded-md border border-[var(--color-honey)] bg-[var(--color-honey)]/10 px-6 py-2 font-semibold text-[var(--color-honey)] hover:bg-[var(--color-honey)]/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-honey)]"
            onClick={onCancel}
            aria-label={cancelText}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className="rounded-md border border-[var(--color-danger)] bg-[var(--color-danger)]/10 px-6 py-2 font-semibold text-[var(--color-danger)] hover:bg-[var(--color-danger)]/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-danger)]"
            onClick={onConfirm}
            aria-label={confirmText}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
