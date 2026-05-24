import { useState, useMemo } from "react";
import { isFormDirty } from "../../utils/form";
import ConfirmModal from "../ui/ConfirmModal";
import { useDirtyFormBlocker } from "../../hooks/useDirtyFormBlocker";
import Button from "../ui/Button";
import { useNavigate, Link } from "react-router-dom";

import FormField from "../input/FormField";
import AuthFormLayout from "./AuthFormLayout";

import { register } from "../../api/authService";
import {
  validateNoroffEmail,
  validateUsername,
} from "../../utils/authValidation";

type RegisterErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

export function RegisterForm() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [venueManager, setVenueManager] = useState(false);
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Dirty check: any field is non-empty or venueManager is checked
  const dirty = useMemo(() => {
    return isFormDirty(
      { name, email, password, confirmPassword, venueManager },
      {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        venueManager: false,
      },
    );
  }, [name, email, password, confirmPassword, venueManager]);

  const {
    showModal: showNavModal,
    handleConfirm: handleNavConfirm,
    handleCancel: handleNavCancel,
  } = useDirtyFormBlocker(dirty);

  function validate(): RegisterErrors {
    const next: RegisterErrors = {};
    const nameError = validateUsername(name);
    if (nameError) next.name = nameError;
    const emailError = validateNoroffEmail(
      email,
      "Please enter a valid @noroff.no or @stud.noroff.no email.",
    );
    if (emailError) next.email = emailError;
    if (password.length < 8)
      next.password = "Password must be at least 8 characters.";
    if (confirmPassword !== password)
      next.confirmPassword = "Passwords do not match.";
    return next;
  }

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError("");

    const next = validate();
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }

    try {
      setIsLoading(true);
      await register(name, email, password, venueManager);
      navigate("/profile");
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <AuthFormLayout title="Register" onSubmit={handleSubmit}>
        <FormField label="Username" htmlFor="name" error={errors.name}>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Username"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name)
                setErrors((prev) => ({ ...prev, name: undefined }));
            }}
            aria-invalid={!!errors.name}
            className="form-input"
          />
        </FormField>

        <FormField label="Email" htmlFor="email" error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email)
                setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            aria-invalid={!!errors.email}
            className="form-input"
          />
        </FormField>

        <FormField label="Password" htmlFor="password" error={errors.password}>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Password (min. 8 characters)"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password)
                setErrors((prev) => ({ ...prev, password: undefined }));
            }}
            aria-invalid={!!errors.password}
            className="form-input"
          />
        </FormField>

        <FormField
          label="Confirm Password"
          htmlFor="confirmPassword"
          error={errors.confirmPassword}
        >
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Repeat password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errors.confirmPassword)
                setErrors((prev) => ({
                  ...prev,
                  confirmPassword: undefined,
                }));
            }}
            aria-invalid={!!errors.confirmPassword}
            className="form-input"
          />
        </FormField>

        <div className="flex items-center gap-3 py-1">
          <input
            id="venueManager"
            name="venueManager"
            type="checkbox"
            checked={venueManager}
            onChange={(e) => setVenueManager(e.target.checked)}
            className="amenity-checkbox h-4 w-4 cursor-pointer accent-[var(--color-honey)]"
          />
          <label
            htmlFor="venueManager"
            className="cursor-pointer text-sm text-[var(--text-h)]"
          >
            Register as a Venue Manager
          </label>
        </div>

        {submitError && (
          <p role="alert" className="text-sm text-[var(--color-danger)]">
            {submitError}
          </p>
        )}

        <Button
          type="submit"
          disabled={isLoading || !dirty}
          variant="primary"
          size="md"
          width="full"
        >
          {isLoading ? "Registering..." : "Create Account"}
        </Button>

        <p className="text-sm text-[var(--text)]">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-[var(--color-honey)] underline-offset-2 hover:underline"
          >
            Log in
          </Link>
        </p>
      </AuthFormLayout>
      <ConfirmModal
        open={showNavModal}
        title="Unsaved Changes"
        message="You have unsaved changes. Are you sure you want to leave this page?"
        confirmText="Leave Page"
        cancelText="Stay"
        onConfirm={handleNavConfirm}
        onCancel={handleNavCancel}
      />
    </>
  );
}
export default RegisterForm;
