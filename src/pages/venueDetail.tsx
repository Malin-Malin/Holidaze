import { useState } from "react";
import { useParams } from "react-router-dom";
import { useVenueById } from "../hooks/useVenueById";
import { useAuth } from "../hooks/useAuth";
import { Amenities } from "../components/ui/amenities";
import { LocationText } from "../components/ui/locationText";
import { Rating } from "../components/ui/rating";
import Gallery from "../components/venue/gallery";
import { FaMapMarkerAlt } from "react-icons/fa";
import placeholderProfileAvatar from "../assets/placeholderProfileAvatar.jpg";
import { BookingForm } from "../components/booking/bookingForm";
import { formatDate } from "../utils/date";
import { AvailabilityCalendar } from "../components/booking/availabilityCalendar";
import { BookingCard } from "../components/booking/card";

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
  const { venue, isLoading, errorMessage } = useVenueById(id);
  const { user } = useAuth();
  const [selectedDateFrom, setSelectedDateFrom] = useState("");
  const [selectedDateTo, setSelectedDateTo] = useState("");

  if (isLoading) {
    return (
      <p className="mx-auto w-full max-w-6xl px-4 py-10 text-left">
        Loading venue...
      </p>
    );
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
          />

          {isVenueManager && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-[var(--text-h)]">
                Upcoming bookings for this venue
              </h3>
              {managerBookingCards.length === 0 ? (
                <p className="mt-2 text-sm text-[var(--text)]/80">
                  No upcoming bookings yet.
                </p>
              ) : (
                <div className="mt-3 grid grid-cols-1 gap-4">
                  {managerBookingCards.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      </div>
      <div className="mx-auto mt-6 w-full max-w-6xl px-8 py-5 text-sm text-[var(--text)] md:px-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <img
              src={manager?.avatar?.url || placeholderProfileAvatar}
              alt={manager?.avatar?.alt || manager?.name || "Venue manager"}
              className="h-10 w-10 rounded-full object-cover"
            />
            <div>
              <p className="text-xs text-[var(--text)]/60">Managed by</p>
              <span className="font-medium">
                {manager?.name || "Unknown manager"}
              </span>
            </div>
          </div>
          <div className="text-left text-[var(--text)]/60 sm:text-right">
            <p>
              Created: {formatDate(venue.created, { fallback: "Unknown date" })}
            </p>
            <p>
              Updated: {formatDate(venue.updated, { fallback: "Unknown date" })}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
