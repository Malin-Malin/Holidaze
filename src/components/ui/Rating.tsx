type RatingProps = {
  rating: number;
  className?: string;
  max?: number;
};

const Rating = ({ rating, className = "", max = 5 }: RatingProps) => {
  const filledStarCount = Math.floor(Math.max(0, Math.min(max, rating)));

  return (
    <p
      className={className}
      aria-label={`Rating ${filledStarCount} out of ${max}`}
      title={`${filledStarCount}/${max}`}
    >
      {"★".repeat(filledStarCount)}
    </p>
  );
};

export default Rating;
