import type { Booking } from "../../types/venue.types";
import { useEffect, useMemo, useState } from "react";
import { useToast } from "../../hooks/useToast";

import BookingGrid from "../booking/BookingGrid";

import { deleteBooking } from "../../api/bookingService";
import { isUpcomingBooking } from "../../utils/booking";

type OverviewBookingProps = {
  bookings?: Booking[];
  isLoading?: boolean;
};

const OverviewBooking = ({
  bookings = [],
  isLoading = false,
}: OverviewBookingProps) => {
  const [myBookings, setMyBookings] = useState<Booking[]>(bookings);
  const [errorMessage, setErrorMessage] = useState("");
  const { showToast } = useToast();

  useEffect(() => {
    setMyBookings(bookings);
  }, [bookings]);

  async function handleCancel(bookingId: string) {
    const confirmed = window.confirm("Cancel this booking?");
    if (!confirmed) return;

    try {
      setErrorMessage("");
      await deleteBooking(bookingId);
      setMyBookings((prev) =>
        prev.filter((booking) => booking.id !== bookingId),
      );
      showToast("Booking successfully canceled.", "success");
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : "Failed to cancel booking.";
      setErrorMessage(msg);
      showToast(msg, "error");
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
      isLoading={isLoading}
      handleCancel={handleCancel}
      fallbackMessage="You have no upcoming bookings."
      errorMessage={errorMessage}
    />
  );
};

export default OverviewBooking;
