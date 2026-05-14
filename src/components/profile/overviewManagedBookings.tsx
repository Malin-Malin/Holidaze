import BookingGrid from "../booking/BookingGrid";

import type { Booking } from "../../types/venue.types";
import { isUpcomingBooking } from "../../utils/booking";

type OverviewManagedBookingsProps = {
  bookings?: Booking[];
};

const OverviewManagedBookings = ({
  bookings = [],
}: OverviewManagedBookingsProps) => {
  const upcomingBookings = bookings.filter(isUpcomingBooking);

  return (
    <BookingGrid
      title="Guest bookings at my venues"
      bookings={upcomingBookings}
      isLoading={false}
      showViewVenueButton={false}
      fallbackMessage="You have no upcoming bookings across your venues."
    />
  );
};

export default OverviewManagedBookings;
