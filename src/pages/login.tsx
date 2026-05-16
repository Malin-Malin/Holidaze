import LoginForm from "../components/auth/LoginForm";

const LoginPage = () => {
  return (
    <section
      className="banner-hero bg-cover bg-center w-screen ml-[calc(50%-50vw)] p-6 min-h-[max(130px,calc(100dvh-20rem))]"
      role="img"
    >
      <LoginForm />
    </section>
  );
};

export default LoginPage;
