import type { ReactNode } from "react";

type FormFieldProps = {
  label?: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
  className?: string;
};

/**
 * Form field wrapper component for labels, errors, and input layout.
 * @param {FormFieldProps} props
 * @param {string} [props.label] - The label for the input.
 * @param {string} props.htmlFor - The id of the input element.
 * @param {string} [props.error] - Error message to display.
 * @param {ReactNode} props.children - The input element(s).
 * @param {string} [props.className] - Additional CSS classes.
 * @returns {JSX.Element}
 */
const FormField = ({
  label,
  htmlFor,
  error,
  children,
  className = "",
}: FormFieldProps) => {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="block text-sm font-medium text-[var(--text-h)]"
        >
          {label}
        </label>
      )}
      {children}
      {error && (
        <p role="alert" className="text-sm text-[var(--color-danger)]">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;
