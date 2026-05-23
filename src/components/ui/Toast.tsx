import "./Toast.css";

import { useToast } from "../../hooks/useToast";
import type { ToastType } from "../../context/ToastContext";

const toastTypeStyles: Record<ToastType, string> = {
  success: "toast-success",
  error: "toast-error",
  info: "toast-info",
};

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast ${toastTypeStyles[toast.type]}`}
          onClick={() => removeToast(toast.id)}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
};
