/**
 * Validates if the email is a valid Noroff or stud.noroff.no address.
 * @param {string} value - The email address to validate.
 * @param {string} [message] - The error message to return if invalid.
 * @returns {string} An empty string if valid, otherwise the error message.
 */
export function validateNoroffEmail(
  value: string,
  message = "Please enter a valid email address.",
) {
  return /^[^\s@]+@(stud\.)?noroff\.no$/.test(value) ? "" : message;
}

/**
 * Validates if the username contains only letters, numbers, and underscores.
 * @param {string} value - The username to validate.
 * @param {string} [message] - The error message to return if invalid.
 * @returns {string} An empty string if valid, otherwise the error message.
 */
export function validateUsername(
  value: string,
  message = "Name can only contain letters, numbers, and underscores.",
) {
  return /^[\w]+$/.test(value) ? "" : message;
}
