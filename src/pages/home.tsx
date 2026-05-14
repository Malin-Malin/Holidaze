import { LuHouse } from "react-icons/lu";
import { SlCalender } from "react-icons/sl";
import { IoKeyOutline } from "react-icons/io5";
import { ButtonLink } from "../components/ui/button";
import { useAuth } from "../hooks/useAuth";
import { PopularVenuesSection } from "../components/venue/popularVenuesSection";
import { RecentVenuesSection } from "../components/venue/recentVenuesSection";
import { Banner } from "../components/layout/banner";

export default function HomePage() {
  const { isLoggedIn, user } = useAuth();
  const isVenueManager = Boolean(user?.venueManager);

  const hostLinkTarget = !isLoggedIn
    ? "/register"
    : isVenueManager
      ? "/profile"
      : "/profile/edit";

  // todo: add a toast message when they are correctly implemented in the codebase, for now we can just pass a state with the message and display it in the profile page when they are redirected there
  const hostLinkState = isVenueManager
    ? { toastMessage: "You are already a venue manager." }
    : undefined;

  return (
    <>
      <Banner />
      <main className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6 md:py-14">
        <h1 className="text-4xl font-bold text-center text-[var(--text-h)] dark:text-white md:text-6xl">
          Welcome to Holidaze
        </h1>

        <RecentVenuesSection />
        {/* create a CTA create venue */}

        <section className="relative overflow-hidden rounded-lg border border-[var(--border)] bg-[linear-gradient(125deg,#f9f3ec_0%,#f4e5d3_48%,#ecd0b0_100%)] px-6 py-14 text-center shadow-lg dark:bg-[linear-gradient(125deg,var(--color-ink)_0%,#1a2f2f_45%,#2a3a2f_100%)] md:px-10 md:py-20">
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[var(--color-honey)]/30 blur-3xl dark:bg-[var(--color-honey)]/20"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-[var(--color-clay)]/20 blur-3xl dark:bg-white/10"
            aria-hidden="true"
          />

          <div className="relative z-10 mx-auto max-w-3xl">
            <h2 className="mt-5 font-[var(--font-display)] text-4xl font-bold leading-tight text-[var(--text-h)] dark:text-white md:text-6xl">
              Find your next stay
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-base text-[var(--text)] dark:text-white/85 md:text-lg">
              Browse venues, check availability, and book your next trip with
              ease.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
              <ButtonLink to="/venues" variant="primary" size="lg">
                Browse venues
              </ButtonLink>
              <ButtonLink
                to={hostLinkTarget}
                state={hostLinkState}
                variant="secondary"
                size="lg"
              >
                Become a host
              </ButtonLink>
            </div>
          </div>
        </section>

        <PopularVenuesSection />

        {/* add the latest venues */}
        {/* add a section divider- brown - a home away from home */}

        <section className="relative overflow-hidden rounded-lg border border-[var(--color-nav-link)]/25 [background:var(--surface-shell)] px-6 py-14 text-center shadow-lg md:px-10 md:py-20">
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[var(--color-honey)]/30 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-20 -left-12 h-64 w-64 rounded-full bg-[var(--color-moss)]/32 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative z-10 mx-auto max-w-2xl">
            <h2 className="font-[var(--font-display)] text-3xl font-bold text-[var(--footer-heading)] md:text-4xl">
              A home away from home
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-base text-[var(--color-nav-link)]/90 md:text-lg">
              At Holidaze, we believe that travel is about more than just
              visiting new places. It's about creating memories, experiencing
              different cultures, and finding a home away from home.
            </p>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="grid gap-6 md:grid-cols-3">
            <article className="group rounded-md border border-[var(--border)] bg-[var(--bg)] p-6 text-center shadow-sm transition hover:-translate-y-1 hover:border-[var(--color-honey)]/60 hover:shadow-md">
              <span
                className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full text-2xl text-[var(--color-honey)]"
                aria-hidden="true"
              >
                <LuHouse />
              </span>
              <h2 className="mb-2 text-lg font-semibold text-[var(--text-h)]">
                Unique places
              </h2>
              <p className="text-sm leading-relaxed text-[var(--text)]">
                Hundreds of venues across the world, from cozy cabins to city
                apartments.
              </p>
            </article>

            <article className="group rounded-md border border-[var(--border)] bg-[var(--bg)] p-6 text-center shadow-sm transition hover:-translate-y-1 hover:border-[var(--color-honey)]/60 hover:shadow-md">
              <span
                className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full text-2xl text-[var(--color-honey)]"
                aria-hidden="true"
              >
                <SlCalender />
              </span>
              <h2 className="mb-2 text-lg font-semibold text-[var(--text-h)]">
                Easy booking
              </h2>
              <p className="text-sm leading-relaxed text-[var(--text)]">
                Check availability, pick your dates and book! It's that simple.
              </p>
            </article>

            <article className="group rounded-md border border-[var(--border)] bg-[var(--bg)] p-6 text-center shadow-sm transition hover:-translate-y-1 hover:border-[var(--color-honey)]/60 hover:shadow-md">
              <span
                className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full text-2xl text-[var(--color-honey)]"
                aria-hidden="true"
              >
                <IoKeyOutline />
              </span>
              <h2 className="mb-2 text-lg font-semibold text-[var(--text-h)]">
                Host too
              </h2>
              <p className="text-sm leading-relaxed text-[var(--text)]">
                Do you have a property to list? Become a host and list your
                property in minutes.
              </p>
            </article>
          </div>
        </section>

        {/* login/register */}
      </main>
    </>
  );
}
