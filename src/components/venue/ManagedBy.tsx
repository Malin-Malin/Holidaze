import placeholderProfileAvatar from "../../assets/placeholderProfileAvatar.jpg";
import SafeImage from "../ui/SafeImage";

import type { Profile } from "../../types/profile.types";
import { formatDate } from "../../utils/date";

type VenueFooterProps = {
  manager: Partial<Profile> | null | undefined;
  created: string;
  updated: string;
};

const ManagedBy = ({ manager, created, updated }: VenueFooterProps) => {
  return (
    <section className="mx-auto mt-6 w-full max-w-6xl px-8 py-5 text-sm text-[var(--text)] md:px-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <SafeImage
            src={manager?.avatar?.url}
            alt={manager?.avatar?.alt || manager?.name}
            fallbackSrc={placeholderProfileAvatar}
            fallbackAlt="Venue manager"
            className="h-10 w-10 rounded-full object-cover"
          />
          <div>
            <p className="text-xs text-[var(--text)]/60">Managed by</p>
            <span className="font-medium">
              {manager?.name || "Unknown manager"}
            </span>
          </div>
        </div>
        <div className="text-left text-[var(--text)]/60 sm:text-right">
          <p>Created: {formatDate(created, { fallback: "Unknown date" })}</p>
          <p>Updated: {formatDate(updated, { fallback: "Unknown date" })}</p>
        </div>
      </div>
    </section>
  );
};

export default ManagedBy;
