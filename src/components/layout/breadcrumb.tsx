import { Link, useLocation } from "react-router-dom";

function toTitleCase(value: string) {
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getSegmentLabel(segment: string, index: number, segments: string[]) {
  if (segment === "venue") {
    return "Venue";
  }

  if (segment === "create-venue") {
    return "Create Venue";
  }

  if (segment === "profile") {
    return "Profile";
  }

  if (segment === "login") {
    return "Login";
  }

  if (segment === "edit" && segments[index - 1]) {
    return "Edit";
  }

  return toTitleCase(segment);
}

export function Breadcrumb() {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);
  const state = location.state as { venueName?: string } | null;
  const venueName = state?.venueName?.trim();

  if (segments.length === 0) {
    return null;
  }

  const crumbs = segments
    .map((segment, index) => {
      const isVenueId = segments[index - 1] === "venue";
      const isCreateVenueId =
        segments[index - 1] === "create-venue" &&
        segments[index + 1] === "edit";

      if (isCreateVenueId) {
        return null;
      }

      if (isVenueId) {
        const to = `/${segments.slice(0, index + 1).join("/")}`;
        return {
          to,
          label: venueName || "Venue",
        };
      }

      const to = `/${segments.slice(0, index + 1).join("/")}`;
      return {
        to,
        label: getSegmentLabel(segment, index, segments),
      };
    })
    .filter(Boolean) as Array<{ to: string; label: string }>;

  return (
    <nav
      aria-label="Breadcrumb"
      className="mx-auto w-full max-w-6xl px-4 py-3 text-left text-sm md:px-6"
    >
      <ol className="flex flex-wrap items-center gap-1 text-[var(--text-h)]/80">
        <li>
          <Link
            to="/"
            className="hover:text-[var(--color-ink)] hover:underline"
          >
            Home
          </Link>
        </li>
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;

          return (
            <li key={crumb.to} className="inline-flex items-center gap-1">
              <span aria-hidden="true" className="px-1 text-[var(--text)]/60">
                /
              </span>
              {isLast ? (
                <span
                  aria-current="page"
                  className="font-medium text-[var(--color-ink)]"
                >
                  {crumb.label}
                </span>
              ) : (
                <Link
                  to={crumb.to}
                  className="hover:text-[var(--color-ink)] hover:underline"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
