import type { Venue } from "../../types/venue.types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteVenue } from "../../api/venueService";
import VenueGrid from "../venue/VenueGrid";

type OverviewVenueProps = {
  venues?: Venue[];
  canCreateVenue?: boolean;
};

const OverviewVenue = ({ venues = [] }: OverviewVenueProps) => {
  const navigate = useNavigate();
  const [myVenues, setMyVenues] = useState<Venue[]>(venues);
  const [errorMessage, setErrorMessage] = useState("");
  //TODO: Add toast for success messages instead of inline text
  // const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    setMyVenues(venues);
  }, [venues]);

  async function handleDelete(venueId: string) {
    const confirmed = window.confirm("Delete this venue?");
    if (!confirmed) return;

    try {
      setErrorMessage("");
      // setSuccessMessage("");
      await deleteVenue(venueId);
      setMyVenues((prev) => prev.filter((venue) => venue.id !== venueId));
      // setSuccessMessage("Venue successfully deleted.");
    } catch (error) {
      // setSuccessMessage("");
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to delete venue.",
      );
    }
  }

  return (
    <>
      <VenueGrid
        title="My venues"
        venues={myVenues}
        isLoading={false}
        fallbackMessage="You have not created any venues yet."
        errorMessage={errorMessage}
        handleEdit={(venueId) => navigate(`/venues/${venueId}/edit`)}
        handleDelete={handleDelete}
      />
      <p className="mt-1 p-6 text-sm text-[var(--text-h)] text-end">
        You have {myVenues.length} {myVenues.length === 1 ? "venue" : "venues"}
      </p>
    </>
  );
};

export default OverviewVenue;
