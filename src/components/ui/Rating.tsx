type RatingProps = {
  rating: number;
  className?: string;
  max?: number;
};

/**
 * Component for displaying a star rating.
 * @param {RatingProps} props
 * @param {number} props.rating - The rating value.
 * @param {string} [props.className] - Additional CSS classes.
 * @param {number} [props.max=5] - Maximum rating value.
 * @returns {JSX.Element}
 */
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
