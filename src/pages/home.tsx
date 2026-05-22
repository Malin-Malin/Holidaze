import { LuHouse } from "react-icons/lu";
import { SlCalender } from "react-icons/sl";
import { IoKeyOutline } from "react-icons/io5";
import Banner from "../components/layout/Banner";
import PopoutCard from "../components/ui/PopoutCard";
import VenueGrid from "../components/venue/VenueGrid";
import WideCard from "../components/ui/WideCard";

import { useAuth } from "../hooks/useAuth";
import { useRecentVenues } from "../hooks/useRecentVenues";

const HomePage = () => {
  const { isLoggedIn, isVenueManager } = useAuth();
  const { venues: recentVenues, isLoading: isLoadingRecent } =
    useRecentVenues(3);
  const { venues: featuredVenues, isLoading: isLoadingFeatured } =
    useRecentVenues(3, "created", "desc", true);

  return (
    <>
      <Banner />
      <main className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6 md:py-14">
        <h1 className="text-4xl font-bold text-center text-[var(--text-h)] dark:text-white md:text-6xl">
          Welcome to Holidaze
        </h1>

        {/* Recently added venues */}
        <VenueGrid
          title="Recently added venues"
          venues={recentVenues}
          isLoading={isLoadingRecent}
          numberOfVenues={3}
          showViewAllButton={true}
        />

        {/* create a CTA create venue */}
        <WideCard
          title="Find your next stay"
          primaryButtonText="Browse venues"
          primaryButtonLink="/venues"
          secondaryButtonText={
            isLoggedIn
              ? isVenueManager
                ? "Manage your venues"
                : "Become a host"
              : "Register user"
          }
          secondaryButtonLink={
            isLoggedIn
              ? isVenueManager
                ? "/profile"
                : "/profile/edit"
              : "/register"
          }
        >
          <p className="mx-auto mt-4 max-w-2xl text-center text-base text-[var(--text)] dark:text-white/85 md:text-lg">
            Browse venues, check availability, and book your next trip with
            ease.
          </p>
        </WideCard>

        {/* Discover more venues */}
        <VenueGrid
          title="Discover more venues"
          venues={featuredVenues}
          isLoading={isLoadingFeatured}
          numberOfVenues={3}
          showViewAllButton={true}
        />

        <WideCard title="A home away from home">
          <p className="mx-auto mt-4 max-w-2xl text-center text-base text-[var(--color-nav-link)]/90 md:text-lg">
            At Holidaze, we believe that travel is about more than just visiting
            new places. It's about creating memories, experiencing different
            cultures, and finding a home away from home.
          </p>
        </WideCard>

        {/* login/register */}

        <section className="py-12 md:py-16">
          <div className="grid gap-6 md:grid-cols-3">
            <PopoutCard
              icon={<LuHouse />}
              title="Unique places"
              text="Hundreds of venues across the world, from cozy cabins to city apartments."
            />
            <PopoutCard
              icon={<SlCalender />}
              title="Easy booking"
              text="Check availability, pick your dates and book! It's that simple."
            />
            <PopoutCard
              icon={<IoKeyOutline />}
              title="Host too"
              text="Do you have a property to list? Become a host and list your property in minutes."
            />
          </div>
        </section>
      </main>
    </>
  );
};

export default HomePage;
