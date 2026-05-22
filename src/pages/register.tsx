import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { RegisterForm } from "../components/auth/RegisterForm";

import { useAuth } from "../hooks/useAuth";

const RegisterPage = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/profile", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  return (
    <section
      className="banner-hero bg-cover bg-center w-screen ml-[calc(50%-50vw)] p-6 min-h-[max(130px,calc(100dvh-20rem))]"
      role="img"
    >
      <RegisterForm />
    </section>
  );
};

export default RegisterPage;
