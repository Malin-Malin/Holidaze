export function validateNoroffEmail(
  value: string,
  message = "Please enter a valid email address.",
) {
  return /^[^\s@]+@(stud\.)?noroff\.no$/.test(value) ? "" : message;
}

export function validateUsername(
  value: string,
  message = "Name can only contain letters, numbers, and underscores.",
) {
  return /^[\w]+$/.test(value) ? "" : message;
}
