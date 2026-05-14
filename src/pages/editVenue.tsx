import { useParams } from "react-router-dom";
import { CreateVenue } from "../components/venue/editVenue/createVenue";

export default function EditVenuePage() {
  const { id } = useParams<{ id: string }>();

  // todo: present error modal and then navigate back to profile page instead of just showing text on the page
  if (!id) {
    return <p>Venue not found</p>;
  }

  return <CreateVenue venueId={id} />;
}
