export function isValidHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function toHttpUrl(value: string | undefined | null): string {
  if (!value) return "";
  return isValidHttpUrl(value) ? value : "";
}
