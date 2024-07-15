/**
 * Finds the elements unique to `setA` (not present in `setB`).
 * The order of elements in the returned array is not guaranteed.
 *
 * @template T A type with a `title` property (e.g., an object).
 * @param {T[]} setA The first set of elements.
 * @param {T[]} setB The second set of elements.
 * @param {(a: T) => string} getKey A function that returns a unique key for each element.
 * @returns {T[]} A new array containing the elements unique to `setA`.
 *
 * @example
 * const fromDatabase = [{ title: 'A' }, { title: 'B' }, { title: 'C' }];
 * const fromForm = [{ title: 'A' }, { title: 'D' }];
 * const newItems = setDiff(fromForm, fromDatabase, (item) => item.title;
 * console.log(newItems); // Output: [{ title: 'D' }]
 */
export function setDiff<T>(
  setA: T[],
  setB: T[],
  getKey: (a: T) => string,
): T[] {
  const keysB = new Set(setB.map(getKey));
  return setA.filter((a) => !keysB.has(getKey(a)));
}
