import Breadcrumb from "../components/layout/Breadcrumb";
import VenueForm from "../components/venue/VenueForm";

const CreateVenuePage = () => {
  const metaDescription =
    "Create a new venue on Holidaze and share it with travelers around the world.";
  return (
    <>
      <title>Holidaze | Create Venue</title>
      <meta name="description" content={metaDescription} />
      <Breadcrumb />
      <VenueForm />
    </>
  );
};

export default CreateVenuePage;
