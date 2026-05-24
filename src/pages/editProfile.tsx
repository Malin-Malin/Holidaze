import Breadcrumb from "../components/layout/Breadcrumb";
import ProfileForm from "../components/profile/ProfileForm";

import { useAuth } from "../hooks/useAuth";

const EditProfilePage = () => {
  const { user, isLoggedIn } = useAuth();

  const metaDescription =
    "Edit your Holidaze profile information, including your bio, contact details, and profile picture.";

  if (!isLoggedIn || !user) {
    return (
      <>
        <title>Holidaze | Edit Profile</title>
        <meta name="description" content={metaDescription} />
        <p className="px-4 py-6 text-[var(--color-danger)]">
          You must be logged in to edit your profile.
        </p>
      </>
    );
  }

  return (
    <>
      <title>Holidaze | Edit Profile</title>
      <meta name="description" content={metaDescription} />
      <Breadcrumb />
      <ProfileForm initialProfile={user} />
    </>
  );
};

export default EditProfilePage;
