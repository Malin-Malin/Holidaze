import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../../api/authService";
import { useAuth } from "../../hooks/useAuth.tsx";
import { FormField } from "../input/formField";
import { validateNoroffEmail } from "../../utils/authValidation";
import { AuthFormLayout } from "./authFormLayout";

export function LoginForm() {
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [submitError, setSubmitError] = useState("");

  function validate() {
    const next: typeof errors = {};
    const emailError = validateNoroffEmail(email);
    if (emailError) next.email = emailError;
    if (!password) next.password = "Password is required.";
    return next;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    const next = validate();
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }

    try {
      const response = await login(email, password);
      const { accessToken, ...userInfo } = response;
      authLogin(accessToken, "", userInfo);
      navigate("/profile");
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Login failed. Please try again.",
      );
    }
  };

  return (
    <AuthFormLayout title="Login" onSubmit={handleLogin}>
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
          placeholder="Password"
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
      {submitError && (
        <p role="alert" className="text-sm text-[var(--color-danger)]">
          {submitError}
        </p>
      )}
      <button
        type="submit"
        className="w-full rounded bg-[var(--color-ink)] px-3 py-2 text-[var(--color-honey)] transition hover:opacity-90"
      >
        Log In
      </button>

      <p className="text-sm text-[var(--text)]">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="font-semibold text-[var(--color-honey)] underline-offset-2 hover:underline"
        >
          Register
        </Link>
      </p>
    </AuthFormLayout>
  );
}
