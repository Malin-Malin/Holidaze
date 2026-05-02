export function BookingForm() {
  return (
    <section>
      <h3>Booking this venue today</h3>

      <form action="">
        <label htmlFor="dateFrom" className="block text-sm font-medium">
          Check in date
        </label>
        <input
          id="dateFrom"
          name="dateFrom"
          type="date"
          className="w-full rounded border shadow-md px-3 py-2"
        />
        <label htmlFor="dateTo" className="block text-sm font-medium mt-4">
          Check out date
        </label>
        <input
          id="dateTo"
          name="dateTo"
          type="date"
          className="w-full rounded border shadow-md px-3 py-2"
        />
        <label htmlFor="guests" className="block text-sm font-medium mt-4">
          Number of guests
        </label>
        <input
          id="guests"
          name="guests"
          type="number"
          min="1"
          className="w-full rounded border shadow-md px-3 py-2"
        />
        <button className="mt-4 inline-flex items-center justify-center rounded-md bg-[var(--color-ink)] px-5 py-2 text-[var(--color-honey)] transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-honey)]">
          Book now
        </button>
      </form>
    </section>
  );
}
