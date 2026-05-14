import type { Venue } from "../../types/venue.types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteVenue } from "../../api/venueService";
import { VenueCard } from "../venue/card";
import { ButtonLink } from "../ui/button";

type OverviewVenueProps = {
  venues?: Venue[];
  canCreateVenue?: boolean;
};

export default function OverviewVenue({
  venues = [],
  canCreateVenue = false,
}: OverviewVenueProps) {
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
              onEdit={(venueId) => navigate(`/venues/${venueId}/edit`)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {errorMessage && (
        <p className="mt-3 text-sm text-[var(--color-danger)]">
          {errorMessage}
        </p>
      )}
      {successMessage && (
        <p className="mt-3 text-sm text-[var(--color-success)]">
          {successMessage}
        </p>
      )}

      <p className="mt-1 p-6 text-sm text-[var(--text-h)] text-end">
        You have {myVenues.length} {myVenues.length === 1 ? "venue" : "venues"}
      </p>
      {canCreateVenue && (
        <div className="mt-6 flex justify-center px-4">
          <ButtonLink
            to="/venue/new"
            variant="primary"
            size="lg"
            className="w-full max-w-md"
          >
            Create venue
          </ButtonLink>
        </div>
      )}
    </section>
  );
}
