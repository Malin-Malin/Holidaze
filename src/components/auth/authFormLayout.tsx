import type { ReactNode } from "react";

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
    <section>
      <h1 className="mx-auto w-full max-w-6xl px-4 py-10 text-left text-2xl">
        {title}
      </h1>
      <form onSubmit={onSubmit} noValidate>
        <div className="mx-auto w-full max-w-6xl space-y-5 px-4 py-10 text-left">
          {children}
        </div>
      </form>
    </section>
  );
}
