import type { Venue } from "../../types/venue.types";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { deleteVenue } from "../../api/venueService";
import { VenueCard } from "../venue/card";

type OverviewVenueProps = {
  venues?: Venue[];
};

export default function OverviewVenue({ venues = [] }: OverviewVenueProps) {
  const navigate = useNavigate();
  const [myVenues, setMyVenues] = useState<Venue[]>(venues);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    setMyVenues(venues);
  }, [venues]);

  async function handleDelete(venueId: string) {
    const confirmed = window.confirm("Delete this venue?");
    if (!confirmed) return;

    try {
      setErrorMessage("");
      setSuccessMessage("");
      await deleteVenue(venueId);
      setMyVenues((prev) => prev.filter((venue) => venue.id !== venueId));
      setSuccessMessage("Venue successfully deleted.");
    } catch (error) {
      setSuccessMessage("");
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to delete venue.",
      );
    }
  }

  return (
    <section className="px-4 py-6">
      <h2 className="text-2xl font-[var(--font-display)] text-[var(--color-ink)] text-center p-4">
        My venues
      </h2>

      {myVenues.length === 0 ? (
        <p className="mt-4 text-[var(--text-h)]">
          You have not created any venues yet.
        </p>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {myVenues.map((venue) => (
            <VenueCard
              key={venue.id}
              venue={venue}
              onEdit={(venueId) => navigate(`/create-venue/${venueId}/edit`)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {errorMessage && (
        <p className="mt-3 text-sm text-red-700">{errorMessage}</p>
      )}
      {successMessage && (
        <p className="mt-3 text-sm text-green-700">{successMessage}</p>
      )}

      <p className="mt-1 p-6 text-sm text-[var(--text-h)] text-end">
        {myVenues.length} {myVenues.length === 1 ? "venue" : "venues"} created
      </p>
      <Link
        to="/create-venue"
        className="rounded-md border border-[var(--color-honey)] bg-[var(--color-honey)] px-4 py-2 text-sm font-semibold text-[var(--color-ink)] transition hover:opacity-90"
      >
        Create venue
      </Link>
    </section>
  );
}
