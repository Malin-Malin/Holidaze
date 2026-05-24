import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import Amenities from "../components/ui/Amenities";
import LocationText from "../components/ui/LocationText";
import Rating from "../components/ui/Rating";
import Gallery from "../components/venue/Gallery";
import BookingForm from "../components/booking/BookingForm";
import BookingSummary from "../components/booking/BookingSummary";
import Modal from "../components/ui/Modal";

import BookingGrid from "../components/booking/BookingGrid";
import AvailabilityCalendar from "../components/booking/AvailabilityCalendar";
import ManagedBy from "../components/venue/ManagedBy";
import Breadcrumb from "../components/layout/Breadcrumb";
import { VenueDetailSkeleton } from "../components/loading/PageSkeletons";

import { useVenueById } from "../hooks/useVenueById";
import { useAuth } from "../hooks/useAuth";
import { formatPrice } from "../utils/number";
import { syncVenueNameState } from "../utils/routeState";

function isUpcomingBooking(dateTo: string) {
  const now = new Date();
  return new Date(dateTo) >= now;
}

const VenueDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { venue, isLoading, errorMessage, refresh } = useVenueById(id);
  const { user, isLoggedIn } = useAuth();
  const [selectedDateFrom, setSelectedDateFrom] = useState("");
  const [selectedDateTo, setSelectedDateTo] = useState("");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [confirmedData, setConfirmedData] = useState<{
    dateFrom: string;
    dateTo: string;
    guests: number;
  } | null>(null);

  useEffect(() => {
    if (!venue?.id || !venue?.name) {
      return;
    }

    syncVenueNameState({
      navigate,
      to: `/venues/${venue.id}`,
      locationState: location.state,
      venueName: venue.name,
    });
  }, [location.state, navigate, venue?.id, venue?.name]);

  if (isLoading) {
    return <VenueDetailSkeleton />;
  }

  if (errorMessage) {
    return (
      <p className="mx-auto w-full max-w-6xl px-4 py-10 text-left text-[var(--color-danger)]">
        {errorMessage}
      </p>
    );
  }

  if (!venue) {
    return (
      <p className="mx-auto w-full max-w-6xl px-4 py-10 text-left">
        Venue not found.
      </p>
    );
  }

  const metaDescription = "Browse and book venues on Holidaze.";

  const manager = venue.owner ?? user;
  const detailsText = venue.description?.trim() || "More details are coming.";
  const isVenueManager =
    !!user?.venueManager && !!user?.name && user.name === venue.owner?.name;
  const upcomingVenueBookings = (venue.bookings ?? [])
    .filter((booking) => isUpcomingBooking(booking.dateTo))
    .sort(
      (first, second) =>
        new Date(first.dateFrom).getTime() -
        new Date(second.dateFrom).getTime(),
    );
  const managerBookingCards = upcomingVenueBookings.map((booking) => ({
    id: booking.id,
    dateFrom: booking.dateFrom,
    dateTo: booking.dateTo,
    guests: booking.guests,
    customer: booking.customer,
    venue,
    created: booking.created,
    updated: booking.updated,
  }));

  const venueTitle = venue.name
    ? `Holidaze | ${venue.name}`
    : "Holidaze | Venue details";

  return (
    <>
      <title>{venueTitle}</title>
      <meta name="description" content={metaDescription} />
      <section className="pb-10">
        <Gallery media={venue.media} />
        <Breadcrumb />
        <div className="mx-auto w-full max-w-6xl space-y-5 px-4 pt-6 text-start md:px-6">
          <h1 className="mb-4 mt-0 break-words px-1 uppercase leading-tight">
            {venue.name}
          </h1>
          <div className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[var(--text)]">
              <LocationText venue={venue} />
            </p>
            <Rating
              rating={venue.rating}
              className="text-end text-lg tracking-wide text-amber-500"
            />
          </div>
          <div className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-2xl text-[var(--text-h)]">
              Price: {formatPrice(venue.price)} / night
            </p>
            <p className="text-lg text-[var(--text)]">
              Max guests: {venue.maxGuests}
            </p>
          </div>
          <div className="-mx-4 md:-mx-6">
            <Amenities meta={venue.meta} />
          </div>
        </div>
        <div className="mx-auto mt-4 flex w-full max-w-6xl flex-col items-stretch gap-6 px-4 py-3 text-sm text-[var(--text)] md:px-6 lg:flex-row">
          <section className="flex flex-1 flex-col px-4 text-start md:px-6">
            <h2>Details</h2>
            <p className="pt-2 text-[var(--text)] text-lg">{detailsText}</p>
          </section>
          <section className="px-4 text-start md:px-6 lg:w-auto lg:flex-1">
            <h2>Availability</h2>
            <AvailabilityCalendar
              bookings={venue.bookings ?? []}
              selectedDateFrom={selectedDateFrom}
              selectedDateTo={selectedDateTo}
              canViewBookedByName={isVenueManager}
              currentUserName={user?.name}
              currentUserEmail={user?.email}
              onRangeSelect={(dateFrom, dateTo) => {
                setSelectedDateFrom(dateFrom);
                setSelectedDateTo(dateTo);
              }}
            />
          </section>
          <section className="px-4 text-start md:px-6 lg:w-64 lg:flex-none">
            <h2>Book</h2>
            <h3>{venue.name}</h3>
            {isLoggedIn && (
              <BookingForm
                venue={venue}
                selectedDateFrom={selectedDateFrom}
                selectedDateTo={selectedDateTo}
                onDatesChange={(dateFrom, dateTo) => {
                  setSelectedDateFrom(dateFrom);
                  setSelectedDateTo(dateTo);
                }}
                onBookingConfirmed={(data) => {
                  setConfirmedData(data);
                  setBookingConfirmed(true);
                  setSelectedDateFrom("");
                  setSelectedDateTo("");
                  void refresh();
                }}
              />
            )}
            {!isLoggedIn && (
              <p className="rounded-md border border-[var(--color-honey)]/60 bg-[var(--color-honey)]/15 px-4 py-3 text-sm text-[var(--text)]">
                Please log in to book this venue.
                <Link
                  to="/login"
                  state={{ from: `/venues/${venue.id}` }}
                  className="ml-1 font-semibold text-[var(--color-honey)] hover:underline"
                >
                  Log in
                </Link>
              </p>
            )}
          </section>
        </div>

        {bookingConfirmed && confirmedData && (
          <Modal
            onClose={() => setBookingConfirmed(false)}
            ariaLabel="Booking confirmation summary"
          >
            <BookingSummary
              venue={venue}
              dateFrom={confirmedData.dateFrom}
              dateTo={confirmedData.dateTo}
              guests={confirmedData.guests}
              onDismiss={() => setBookingConfirmed(false)}
            />
          </Modal>
        )}

        {isVenueManager && (
          <BookingGrid
            bookings={managerBookingCards}
            showViewVenueButton={false}
            isLoading={isLoading}
          />
        )}

        <ManagedBy
          manager={manager}
          created={venue.created}
          updated={venue.updated}
        />
      </section>
    </>
  );
};

export default VenueDetail;
