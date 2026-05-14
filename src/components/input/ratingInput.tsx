const RatingInput = ({
  rating,
  max = 5,
  onChange,
}: {
  rating: number;
  max?: number;
  onChange: (newRating: number) => void;
}) => {
  const clampedRating = Math.max(0, Math.min(max, rating));

  return (
    <div
      className="flex items-center gap-1"
      role="radiogroup"
      aria-label="Venue star rating"
    >
      {Array.from({ length: max }, (_, index) => {
        const starValue = index + 1;
        const isActive = starValue <= clampedRating;

        return (
          <button
            key={starValue}
            type="button"
            role="radio"
            aria-checked={starValue === clampedRating}
            aria-label={`${starValue} star${starValue > 1 ? "s" : ""}`}
            onClick={() =>
              onChange(starValue === clampedRating ? 0 : starValue)
            }
            className={`text-2xl leading-none transition ${
              isActive ? "text-amber-500" : "text-gray-300"
            }`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
};

export default RatingInput;
