import Breadcrumb from "../components/layout/Breadcrumb";
import ProfileForm from "../components/profile/ProfileForm";

import { useAuth } from "../hooks/useAuth";

const EditProfilePage = () => {
  const { user, isLoggedIn } = useAuth();

  if (!isLoggedIn || !user) {
    return (
      <p className="px-4 py-6 text-[var(--color-danger)]">
        You must be logged in to edit your profile.
      </p>
    );
  }

  return (
    <>
      <Breadcrumb />
      <ProfileForm initialProfile={user} />
    </>
  );
};

export default EditProfilePage;
