import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import VenueGrid from "../venue/VenueGrid";
import ConfirmModal from "../ui/ConfirmModal";

import type { Venue } from "../../types/venue.types";

import { useToast } from "../../hooks/useToast";
import { deleteVenue } from "../../api/venueService";

type OverviewVenueProps = {
  venues?: Venue[];
  isLoading?: boolean;
};

const OverviewVenue = ({
  venues = [],
  isLoading = false,
}: OverviewVenueProps) => {
  const navigate = useNavigate();
  const [myVenues, setMyVenues] = useState<Venue[]>(venues);
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmVenueId, setConfirmVenueId] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    setMyVenues(venues);
  }, [venues]);

  async function handleDelete(venueId: string) {
    setConfirmVenueId(venueId);
  }

  async function confirmDeleteVenue() {
    if (!confirmVenueId) return;
    try {
      setErrorMessage("");
      await deleteVenue(confirmVenueId);
      setMyVenues((prev) =>
        prev.filter((venue) => venue.id !== confirmVenueId),
      );
      showToast("Venue successfully deleted.", "success");
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : "Failed to delete venue.";
      setErrorMessage(msg);
    } finally {
      setConfirmVenueId(null);
    }
  }

  return (
    <>
      <VenueGrid
        title="My venues"
        venues={myVenues}
        isLoading={isLoading}
        numberOfVenues={3}
        fallbackMessage="You have not created any venues yet."
        errorMessage={errorMessage}
        handleEdit={(venueId) => navigate(`/venues/${venueId}/edit`)}
        handleDelete={handleDelete}
      />
      <ConfirmModal
        open={!!confirmVenueId}
        title="Delete Venue"
        message="Are you sure you want to delete this venue? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDeleteVenue}
        onCancel={() => setConfirmVenueId(null)}
      />
      <p className="mt-1 p-6 text-sm text-[var(--text-h)] text-end">
        You have {myVenues.length} {myVenues.length === 1 ? "venue" : "venues"}
      </p>
    </>
  );
};

export default OverviewVenue;
