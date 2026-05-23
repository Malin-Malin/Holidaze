import { FaInstagram, FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import { useAuth } from "../../hooks/useAuth";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/venues", label: "Venues" },
  { href: "/profile", label: "Profile", authOnly: true },
  { href: "/venues/new", label: "Create Venue", authOnly: true },
  { href: "/login", label: "Login", notAuthOnly: true },
];

const SOCIAL_LINKS = [
  { href: "https://instagram.com", label: "Instagram", Icon: FaInstagram },
  { href: "https://facebook.com", label: "Facebook", Icon: FaFacebook },
  { href: "https://x.com", label: "X (Twitter)", Icon: FaXTwitter },
];

const Footer = () => {
  const { isLoggedIn } = useAuth();
  const year = new Date().getFullYear();

  return (
    <footer className="relative left-1/2 right-1/2 mt-auto w-screen -translate-x-1/2 [background:var(--surface-shell)] text-[var(--color-nav-link)]">
      <div className="mx-auto w-full max-w-[1126px] px-6 py-12">
        <div className="grid grid-cols-1 gap-12 text-center lg:grid-cols-16 lg:gap-8 lg:text-left">
          {/* Brand */}
          <div className="flex flex-col items-center gap-3 lg:col-span-8 lg:items-start lg:pl-8">
            <a href="/" className="w-fit">
              <span className="font-[var(--font-brand)] text-4xl text-[var(--shell-accent)] transition hover:opacity-80">
                Holidaze
              </span>
            </a>
            <p className="max-w-xs text-sm leading-relaxed">
              Find and book unique venues across the world! Everything from cozy
              mountain cabins to coastal villas. Your next escape starts here.
            </p>
            <div className="mt-2 flex items-center justify-center gap-4 lg:justify-start">
              {SOCIAL_LINKS.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="transition hover:text-[var(--shell-accent)]"
                >
                  <Icon size={20} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-col items-center gap-3 lg:col-span-4 lg:items-start lg:pl-2">
            <h3 className="font-[var(--font-display)] text-sm font-semibold uppercase tracking-widest !text-[var(--footer-heading)]">
              Explore
            </h3>
            <nav className="flex flex-col items-center gap-2 lg:items-start">
              {NAV_LINKS.map(({ href, label, authOnly, notAuthOnly }) => {
                if ((authOnly && !isLoggedIn) || (notAuthOnly && isLoggedIn))
                  return null;
                return (
                  <a
                    key={href}
                    href={href}
                    className="w-fit text-sm transition hover:text-[var(--shell-accent)] hover:underline hover:underline-offset-4"
                  >
                    {label}
                  </a>
                );
              })}
            </nav>
          </div>

          {/* Contact */}
          <div className="flex flex-col items-center gap-3 lg:col-span-4 lg:items-start lg:pl-2">
            <h3 className="font-[var(--font-display)] text-sm font-semibold uppercase tracking-widest !text-[var(--footer-heading)]">
              Contact
            </h3>
            <ul className="flex flex-col gap-2 text-sm">
              <li>
                <span className="block text-[var(--color-nav-link)]/60 text-xs uppercase tracking-wider">
                  Email
                </span>
                <a
                  href="mailto:hello@holidaze.com"
                  className="transition hover:text-[var(--shell-accent)]"
                >
                  hello@holidaze.com
                </a>
              </li>
              <li>
                <span className="block text-[var(--color-nav-link)]/60 text-xs uppercase tracking-wider">
                  Support
                </span>
                <a
                  href="mailto:support@holidaze.com"
                  className="transition hover:text-[var(--shell-accent)]"
                >
                  support@holidaze.com
                </a>
              </li>
              <li>
                <span className="block text-[var(--color-nav-link)]/60 text-xs uppercase tracking-wider">
                  Based in
                </span>
                <span>Oslo, Norway</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-[var(--color-nav-link)]/20 pt-6 text-xs text-[var(--color-nav-link)]/50">
          <p className="text-center">
            &copy; {year} Malin Skrettingland. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
