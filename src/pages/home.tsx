import { LuHouse } from "react-icons/lu";
import { SlCalender } from "react-icons/sl";
import { IoKeyOutline } from "react-icons/io5";

import Banner from "../components/layout/Banner";
import PopoutCard from "../components/ui/PopoutCard";
import VenueGrid from "../components/venue/VenueGrid";
import WideCard from "../components/ui/WideCard";

import { useAuth } from "../hooks/useAuth";
import { useVenues } from "../hooks/useVenues";

const HomePage = () => {
  const { isLoggedIn, isVenueManager } = useAuth();
  const { venues: recentVenues, isLoading: isLoadingRecent } = useVenues(1, {
    count: 3,
    orderBy: "created",
    orderDirection: "desc",
  });
  const { venues: featuredVenues, isLoading: isLoadingFeatured } = useVenues(
    1,
    {
      count: 3,
      orderBy: "created",
      orderDirection: "desc",
      useRandomPage: true,
    },
  );
  const featuredVenueId = featuredVenues[0]?.id;
  const venueDetailLink = featuredVenueId
    ? `/venues/${featuredVenueId}`
    : "/venues";

  const metaDescription =
    "Welcome to Holidaze, your go-to platform for booking unique venues around the world. Discover, book, and manage your stays with ease.";

  return (
    <>
      <title>Holidaze | Home</title>
      <meta name="description" content={metaDescription} />
      <Banner />
      <section className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6 md:py-14">
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
              title={isLoggedIn ? "Browse venues" : "Unique places"}
              text={
                isLoggedIn
                  ? "Hundreds of venues across the world, from cozy apartments to luxurious villas."
                  : "Create an account to unlock venue browsing and booking features."
              }
              to={isLoggedIn ? "/venues" : "/register"}
            />
            <PopoutCard
              icon={<SlCalender />}
              title={isLoggedIn ? "Easy booking" : "Easy booking"}
              text={
                isLoggedIn
                  ? "Jump into one of our featured venues and complete your booking in minutes."
                  : "Register in order to book your next stay at one of our unique venues."
              }
              to={isLoggedIn ? venueDetailLink : "/register"}
            />
            <PopoutCard
              icon={<IoKeyOutline />}
              title={isLoggedIn ? "Venue manager" : "Join Holidaze"}
              text={
                isLoggedIn
                  ? "As a venue manager, you can create and manage your venues."
                  : "Create your account to manage stays and become a host."
              }
              to={isLoggedIn ? "/venues/new" : "/register"}
            />
          </div>
        </section>
      </section>
    </>
  );
};

export default HomePage;
