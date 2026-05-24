/**
 * Checks if any property in the form object differs from the initial object.
 * @template T
 * @param {T} form - The current form object.
 * @param {T} initial - The initial form object.
 * @returns {boolean} True if any property is dirty, false otherwise.
 */
export function isFormDirty<T extends object>(form: T, initial: T): boolean {
  return Object.keys(initial).some(
    (key) => form[key as keyof T] !== initial[key as keyof T],
  );
}

/**
 * Checks if two arrays of objects differ by value.
 * @template T
 * @param {T[]} arr - The current array.
 * @param {T[]} initial - The initial array.
 * @returns {boolean} True if arrays differ, false otherwise.
 */
export function isArrayDirty<T>(arr: T[], initial: T[]): boolean {
  if (arr.length !== initial.length) return true;
  return arr.some(
    (item, i) => JSON.stringify(item) !== JSON.stringify(initial[i]),
  );
}
