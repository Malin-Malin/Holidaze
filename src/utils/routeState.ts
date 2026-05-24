import type { NavigateFunction } from "react-router-dom";

type RouteState = Record<string, unknown>;

type SyncVenueNameStateParams = {
  navigate: NavigateFunction;
  to: string;
  locationState: unknown;
  venueName: string;
};

/**
 * Syncs the venue name in the route state and navigates if necessary.
 * @param {SyncVenueNameStateParams} params - The parameters for syncing venue name state.
 */
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
