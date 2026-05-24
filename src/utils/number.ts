/**
 * Formats a number as a USD currency string with no decimal places.
 * @param {number} value - The number to format.
 * @returns {string} The formatted price string.
 */
export function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}
