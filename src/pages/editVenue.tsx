import { useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

import VenueForm from "../components/venue/VenueForm";
import Breadcrumb from "../components/layout/Breadcrumb";
import { VenueFormSkeleton } from "../components/loading/PageSkeletons";

import { useVenueById } from "../hooks/useVenueById";
import { syncVenueNameState } from "../utils/routeState";

const EditVenuePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { venue, isLoading, errorMessage } = useVenueById(id);

  useEffect(() => {
    if (!venue?.id || !venue?.name) return;
    syncVenueNameState({
      navigate,
      to: `/venues/${venue.id}/edit`,
      locationState: location.state,
      venueName: venue.name,
    });
  }, [location.state, navigate, venue?.id, venue?.name]);

  if (!id) {
    return <p>Venue not found</p>;
  }

  if (isLoading) {
    return <VenueFormSkeleton />;
  }

  if (errorMessage) {
    return <p className="px-4 py-6 text-red-700">{errorMessage}</p>;
  }

  if (!venue) {
    return <p>Venue not found</p>;
  }

  return (
    <>
      <Breadcrumb />
      <VenueForm venueId={id} initialVenue={venue} />
    </>
  );
};

export default EditVenuePage;
