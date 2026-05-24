/**
 * Capitalizes the first character of a string.
 * @param {string} value - The string to capitalize.
 * @returns {string} The capitalized string.
 */
export function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/**
 * Converts a string to title case, splitting and joining by the given separators.
 * @param {string} value - The string to convert.
 * @param {string} [separator=" "] - The separator to split the string.
 * @param {string} [joiner=" "] - The joiner to use when joining the string.
 * @returns {string} The title-cased string.
 */
export function toTitleCase(value: string, separator = " ", joiner = " ") {
  return value
    .split(separator)
    .filter(Boolean)
    .map((part) => capitalize(part))
    .join(joiner);
}
