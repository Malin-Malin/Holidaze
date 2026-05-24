import { useState } from "react";
import type { ReactNode } from "react";
import { ToastContext } from "./ToastContext";
import type { Toast, ToastType } from "./ToastContext";

let toastId = 0;

/**
 * Provides toast notification context to the app, managing toast state and actions.
 * @param {object} props
 * @param {ReactNode} props.children - The child components.
 * @returns {JSX.Element}
 */
const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  /**
   * Shows a toast notification with a message and type.
   * @param {string} message - The message to display in the toast.
   * @param {ToastType} [type="info"] - The type of toast (info, success, error, etc.).
   */
  const showToast = (message: string, type: ToastType = "info") => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 4000);
  };

  /**
   * Removes a toast notification by its ID.
   * @param {number} id - The ID of the toast to remove.
   */
  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export default ToastProvider;
