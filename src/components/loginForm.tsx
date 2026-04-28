import { useNavigate } from "react-router-dom";
import { login } from "../api/authService.tsx";
import { useAuth } from "../hooks/useAuth.tsx";

export function LoginForm() {
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();
  //define login function
  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await login(email, password);
      const { accessToken, ...userInfo } = response;
      authLogin(accessToken, "", userInfo);
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };
  return (
    <section>
      <h1 className="mx-auto w-full max-w-6xl px-4 py-10 text-left text-2xl">
        Login
      </h1>
      <form
        action=""
        onSubmit={(e) => {
          e.preventDefault();
          const target = e.target as HTMLFormElement;
          const email = (target.elements.namedItem("email") as HTMLInputElement)
            .value;
          const password = (
            target.elements.namedItem("password") as HTMLInputElement
          ).value;

          handleLogin(email, password);
        }}
      >
        <div className="mx-auto w-full max-w-6xl space-y-5 px-4 py-10 text-left">
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full rounded border shadow-md px-3 py-2"
          />
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full rounded border shadow-md px-3 py-2"
          />
          <button
            type="button"
            className="w-full rounded bg-gray-600 text-white px-3 py-2 hover:bg-gray-700 transition"
          >
            Register
          </button>
          <button
            type="submit"
            className="w-full rounded bg-blue-600 text-white px-3 py-2 hover:bg-blue-700 transition"
          >
            Log In
          </button>
        </div>
      </form>
    </section>
  );
}
