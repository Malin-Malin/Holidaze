import { useContext } from "react";
import { ToastContext } from "../context/ToastContext";

/**
 * Custom hook to access the toast notification context.
 * @returns {import("../context/ToastContext").ToastContextType} Toast context value.
 * @throws {Error} If used outside a ToastProvider.
 */
export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
