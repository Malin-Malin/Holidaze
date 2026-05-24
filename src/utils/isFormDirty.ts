// Generic compare for form is dirty check
export function isFormDirty<T extends object>(form: T, initial: T): boolean {
  return Object.keys(initial).some(
    (key) => form[key as keyof T] !== initial[key as keyof T],
  );
}

// Compare for arrays of objects (like media list)
export function isArrayDirty<T>(arr: T[], initial: T[]): boolean {
  if (arr.length !== initial.length) return true;
  return arr.some(
    (item, i) => JSON.stringify(item) !== JSON.stringify(initial[i]),
  );
}
