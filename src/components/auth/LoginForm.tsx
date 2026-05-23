import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

import FormField from "../input/FormField";
import AuthFormLayout from "./AuthFormLayout";

import Button from "../ui/Button";

import { login } from "../../api/authService";
import { useAuth } from "../../hooks/useAuth";
import { validateNoroffEmail } from "../../utils/authValidation";

type LoginErrors = {
  email?: string;
  password?: string;
};

const LoginForm = () => {
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginErrors>({});
  const [submitError, setSubmitError] = useState("");

  function validate() {
    const next: LoginErrors = {};
    const emailError = validateNoroffEmail(email);
    if (emailError) next.email = emailError;
    if (!password) next.password = "Password is required.";
    return next;
  }

  const handleLogin = async (e: React.SubmitEvent<HTMLFormElement>) => {
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
      authLogin(accessToken, userInfo);
      const redirectTo = location.state?.from?.pathname || "/profile";
      navigate(redirectTo, { replace: true });
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
      <Button
        type="submit"
        variant="primary"
        size="md"
        width="full"
        aria-label="Log In"
      >
        Log In
      </Button>

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
};

export default LoginForm;
