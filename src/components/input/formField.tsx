import type { ReactNode } from "react";

type FormFieldProps = {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
  className?: string;
};

const FormField = ({
  label,
  htmlFor,
  error,
  children,
  className = "",
}: FormFieldProps) => {
  return (
    <div className={`space-y-1 ${className}`}>
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-[var(--text-h)]"
      >
        {label}
      </label>
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
