import BookingGrid from "../booking/BookingGrid";

import type { Booking } from "../../types/venue.types";
import { isUpcomingBooking } from "../../utils/booking";

type OverviewManagedBookingsProps = {
  bookings?: Booking[];
  isLoading?: boolean;
};

/**
 * Component for displaying upcoming guest bookings at the user's managed venues.
 * @param {OverviewManagedBookingsProps} props
 * @param {Booking[]} [props.bookings] - List of bookings to display.
 * @param {boolean} [props.isLoading] - Loading state.
 * @returns {JSX.Element}
 */
const OverviewManagedBookings = ({
  bookings = [],
  isLoading = false,
}: OverviewManagedBookingsProps) => {
  const upcomingBookings = bookings.filter(isUpcomingBooking);

  return (
    <BookingGrid
      title="Guest bookings at my venues"
      bookings={upcomingBookings}
      isLoading={isLoading}
      showViewVenueButton={false}
      fallbackMessage="You have no upcoming bookings across your venues."
    />
  );
};

export default OverviewManagedBookings;
