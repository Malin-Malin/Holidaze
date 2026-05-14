export function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function toTitleCase(value: string, separator = " ", joiner = " ") {
  return value
    .split(separator)
    .filter(Boolean)
    .map((part) => capitalize(part))
    .join(joiner);
}
