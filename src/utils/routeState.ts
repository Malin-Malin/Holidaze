import type { NavigateFunction } from "react-router-dom";

type RouteState = Record<string, unknown>;

type SyncVenueNameStateParams = {
  navigate: NavigateFunction;
  to: string;
  locationState: unknown;
  venueName: string;
};

export function syncVenueNameState({
  navigate,
  to,
  locationState,
  venueName,
}: SyncVenueNameStateParams) {
  if (!venueName.trim()) {
    return;
  }

  const currentState: RouteState =
    locationState && typeof locationState === "object"
      ? (locationState as RouteState)
      : {};

  const currentVenueName =
    typeof currentState.venueName === "string"
      ? currentState.venueName
      : undefined;

  if (currentVenueName === venueName) {
    return;
  }

  navigate(to, {
    replace: true,
    state: { ...currentState, venueName },
  });
}
