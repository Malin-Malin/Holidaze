import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/authService";
import { useAuth } from "../../hooks/useAuth.tsx";
import { FormField } from "../input/formField";

function validateEmail(value: string) {
  return /^[^\s@]+@(stud\.)?noroff\.no$/.test(value)
    ? ""
    : "Please enter a valid email address.";
}

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
    const emailError = validateEmail(email);
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
      navigate("/");
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Login failed. Please try again.",
      );
    }
  };

  return (
    <section>
      <h1 className="mx-auto w-full max-w-6xl px-4 py-10 text-left text-2xl">
        Login
      </h1>
      <form onSubmit={handleLogin} noValidate>
        <div className="mx-auto w-full max-w-6xl space-y-5 px-4 py-10 text-left">
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
          <FormField
            label="Password"
            htmlFor="password"
            error={errors.password}
          >
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
            <p role="alert" className="text-sm text-red-600">
              {submitError}
            </p>
          )}
          <button
            type="submit"
            className="w-full rounded bg-[var(--color-ink)] text-[var(--color-honey)] px-3 py-2 hover:opacity-90 transition"
          >
            Log In
          </button>
        </div>
      </form>
    </section>
  );
}
