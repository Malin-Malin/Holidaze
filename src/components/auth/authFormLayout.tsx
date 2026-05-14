import type { ReactNode } from "react";

type AuthFormLayoutProps = {
  title: string;
  onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void | Promise<void>;
  children: ReactNode;
};

const AuthFormLayout = ({ title, onSubmit, children }: AuthFormLayoutProps) => {
  return (
    <section className="auth-page-theme relative h-full min-h-0 w-full overflow-hidden">
      <div className="relative mx-auto flex h-full w-full max-w-6xl flex-col items-center justify-center px-4 py-4 md:py-6">
        <h1 className="text-center text-2xl text-white">{title}</h1>
        <form onSubmit={onSubmit} noValidate className="mt-6 w-full max-w-2xl">
          <div className="space-y-5 rounded p-6 text-left">{children}</div>
        </form>
      </div>
    </section>
  );
};

export default AuthFormLayout;
