/**
 * Checks if a string is a valid HTTP or HTTPS URL.
 * @param {string} value - The URL string to validate.
 * @returns {boolean} True if valid, false otherwise.
 */
export function isValidHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Returns the value if it's a valid HTTP/HTTPS URL, otherwise returns an empty string.
 * @param {string | undefined | null} value - The URL string to check.
 * @returns {string} The valid URL or an empty string.
 */
export function toHttpUrl(value: string | undefined | null): string {
  if (!value) return "";
  return isValidHttpUrl(value) ? value : "";
}
