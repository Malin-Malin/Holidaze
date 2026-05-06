import type { ReactNode } from "react";
import cityViewBanner from "../../assets/city_view_banner.jpg";

type AuthFormLayoutProps = {
  title: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
  children: ReactNode;
};

export function AuthFormLayout({
  title,
  onSubmit,
  children,
}: AuthFormLayoutProps) {
  return (
    <section
      className="auth-page-theme relative ml-[calc(50%-50vw)] min-h-screen w-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${cityViewBanner})` }}
    >
      <div className="absolute inset-0 bg-black/50" aria-hidden="true" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center px-4 py-10">
        <h1 className="text-center text-2xl text-white">{title}</h1>
        <form onSubmit={onSubmit} noValidate className="mt-6 w-full max-w-2xl">
          <div className="space-y-5 rounded p-6 text-left">{children}</div>
        </form>
      </div>
    </section>
  );
}
