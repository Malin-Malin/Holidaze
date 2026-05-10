import { useState } from "react";
import { useParams } from "react-router-dom";
import { useVenueById } from "../hooks/useVenueById";
import { useAuth } from "../hooks/useAuth";
import { Amenities } from "../components/ui/amenities";
import { LocationText } from "../components/ui/locationText";
import { Rating } from "../components/ui/rating";
import Gallery from "../components/venue/gallery";
import { FaMapMarkerAlt } from "react-icons/fa";
import { BookingForm } from "../components/booking/bookingForm";
import { BookingSummary } from "../components/booking/bookingSummary";
import { AvailabilityCalendar } from "../components/booking/availabilityCalendar";
import { UpcomingBookings } from "../components/venue/upcomingBookings";
import { ManagedBy } from "../components/venue/managedBy";
import { VenueDetailSkeleton } from "../components/loading/pageSkeletons";

function isUpcomingBooking(dateTo: string) {
  const now = new Date();
  return new Date(dateTo) >= now;
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function VenueDetail() {
  const { id } = useParams<{ id: string }>();
  const { venue, isLoading, errorMessage, refresh } = useVenueById(id);
  const { user } = useAuth();
  const [selectedDateFrom, setSelectedDateFrom] = useState("");
  const [selectedDateTo, setSelectedDateTo] = useState("");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [confirmedData, setConfirmedData] = useState<{
    dateFrom: string;
    dateTo: string;
    guests: number;
  } | null>(null);

  if (isLoading) {
    return <VenueDetailSkeleton />;
  }

  if (errorMessage) {
    return (
      <p className="mx-auto w-full max-w-6xl px-4 py-10 text-left text-red-700">
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
  const managerBookingCards = upcomingVenueBookings.map((booking, index) => ({
    id:
      booking.id ||
      `${venue.id}-${booking.dateFrom}-${booking.dateTo}-${index}`,
    dateFrom: booking.dateFrom,
    dateTo: booking.dateTo,
    guests: booking.guests,
    customer: booking.customer,
    venue,
  }));

  return (
    <section className="pb-10">
      <Gallery media={venue.media} />
      <div className="mx-auto w-full max-w-6xl space-y-5 px-4 pt-6 text-start md:px-6">
        <h1 className="mb-4 mt-0 break-words px-1 uppercase leading-tight">
          {venue.name}
        </h1>
        <div className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="inline-flex items-center gap-2 text-[var(--text)]">
            <FaMapMarkerAlt aria-hidden="true" />
            <LocationText
              city={venue.location.city}
              country={venue.location.country}
            />
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
          <p className="pt-2 text-[var(--text)]">{detailsText}</p>
        </section>
        <section className="px-4 text-start md:px-6 lg:w-auto lg:flex-1">
          <h3>Availability</h3>
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
        </section>
      </div>

      {bookingConfirmed && confirmedData && (
        <div className="mx-auto mt-6 w-full max-w-3xl px-4 md:px-6">
          <BookingSummary
            venue={venue}
            dateFrom={confirmedData.dateFrom}
            dateTo={confirmedData.dateTo}
            guests={confirmedData.guests}
            onDismiss={() => setBookingConfirmed(false)}
          />
        </div>
      )}

      {isVenueManager && <UpcomingBookings bookings={managerBookingCards} />}

      <ManagedBy
        manager={manager}
        created={venue.created}
        updated={venue.updated}
      />
    </section>
  );
}
