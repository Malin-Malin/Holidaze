import { LuHouse } from "react-icons/lu";
import { SlCalender } from "react-icons/sl";
import { IoKeyOutline } from "react-icons/io5";

import Banner from "../components/layout/banner";
import PopoutCard from "../components/ui/PopoutCard";
import VenueGrid from "../components/venue/VenueGrid";
import WideCard from "../components/ui/WideCard";
// import { PopularVenuesSection } from "../components/venue/popularVenuesSection";

import type { Venue } from "../types/venue.types";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { getVenues } from "../api/venueService";

const HomePage = () => {
  const { isLoggedIn, isVenueManager } = useAuth();
  const [isLoadingRecent, setIsLoadingRecent] = useState(false);
  const [recentVenues, setRecentVenues] = useState<Venue[]>([]);

  // Load recent venues
  useEffect(() => {
    async function loadRecentVenues() {
      try {
        setIsLoadingRecent(true);
        const response = await getVenues(1, 3, false, "created", "desc");
        const latest = [...response.data];

        setRecentVenues(latest);
      } catch (error) {
        console.error("Error loading recent venues:", error);
        setRecentVenues([]);
      } finally {
        setIsLoadingRecent(false);
      }
    }

    void loadRecentVenues();
  }, []);

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

        {/* <PopularVenuesSection /> */}

        {/* add a section divider- brown - a home away from home */}

        <WideCard title="A home away from home">
          <p className="mx-auto mt-4 max-w-2xl text-center text-base text-[var(--color-nav-link)]/90 md:text-lg">
            At Holidaze, we believe that travel is about more than just visiting
            new places. It's about creating memories, experiencing different
            cultures, and finding a home away from home.
          </p>
        </WideCard>

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

        {/* login/register */}
      </main>
    </>
  );
};

export default HomePage;
