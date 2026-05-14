import type { Booking } from "../../types/venue.types";
import { useEffect, useMemo, useState } from "react";

import BookingGrid from "../booking/BookingGrid";

import { deleteBooking } from "../../api/bookingService";
import { isUpcomingBooking } from "../../utils/booking";

type OverviewBookingProps = {
  bookings?: Booking[];
};

const OverviewBooking = ({ bookings = [] }: OverviewBookingProps) => {
  const [myBookings, setMyBookings] = useState<Booking[]>(bookings);
  const [errorMessage, setErrorMessage] = useState("");
  // TODO: Add toast for success messages instead of inline text
  // const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    setMyBookings(bookings);
  }, [bookings]);

  async function handleCancel(bookingId: string) {
    const confirmed = window.confirm("Cancel this booking?");
    if (!confirmed) return;

    try {
      setErrorMessage("");
      // setSuccessMessage("");
      await deleteBooking(bookingId);
      setMyBookings((prev) =>
        prev.filter((booking) => booking.id !== bookingId),
      );
      // setSuccessMessage("Booking successfully canceled.");
    } catch (error) {
      // setSuccessMessage("");
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to cancel booking.",
      );
    }
  }

  const upcomingBookings = useMemo(
    () =>
      myBookings
        .filter(isUpcomingBooking)
        .sort(
          (first, second) =>
            new Date(first.dateFrom).getTime() -
            new Date(second.dateFrom).getTime(),
        ),
    [myBookings],
  );

  return (
    <BookingGrid
      title="My upcoming bookings"
      bookings={upcomingBookings}
      isLoading={false}
      handleCancel={handleCancel}
      fallbackMessage="You have no upcoming bookings."
      errorMessage={errorMessage}
    />
  );
};

export default OverviewBooking;
