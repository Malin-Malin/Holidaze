import { useParams } from "react-router-dom";
import { CreateVenue } from "../components/venue/editVenue/createVenue";

export default function CreateVenuePage() {
  const { id } = useParams<{ id: string }>();

  return (
    <section className="pb-10">
      <CreateVenue venueId={id} />
    </section>
  );
}
