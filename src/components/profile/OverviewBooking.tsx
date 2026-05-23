import { useEffect, useMemo, useState } from "react";

import ConfirmModal from "../ui/ConfirmModal";
import BookingGrid from "../booking/BookingGrid";

import type { Booking } from "../../types/venue.types";

import { deleteBooking } from "../../api/bookingService";
import { isUpcomingBooking } from "../../utils/booking";
import { useToast } from "../../hooks/useToast";

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

  const [confirmBookingId, setConfirmBookingId] = useState<string | null>(null);

  useEffect(() => {
    setMyBookings(bookings);
  }, [bookings]);

  async function handleCancel(bookingId: string) {
    setConfirmBookingId(bookingId);
  }

  async function confirmCancelBooking() {
    if (!confirmBookingId) return;
    try {
      setErrorMessage("");
      await deleteBooking(confirmBookingId);

      setMyBookings((prev) =>
        prev.filter((booking) => booking.id !== confirmBookingId),
      );
      showToast("Booking successfully canceled.", "success");
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : "Failed to cancel booking.";
      setErrorMessage(msg);
    } finally {
      setConfirmBookingId(null);
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
    <>
      <BookingGrid
        title="My upcoming bookings"
        bookings={upcomingBookings}
        isLoading={isLoading}
        handleCancel={handleCancel}
        fallbackMessage="You have no upcoming bookings."
        errorMessage={errorMessage}
      />
      <ConfirmModal
        open={!!confirmBookingId}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
        confirmText="Cancel Booking"
        cancelText="Keep Booking"
        onConfirm={confirmCancelBooking}
        onCancel={() => setConfirmBookingId(null)}
      />
    </>
  );
};

export default OverviewBooking;
