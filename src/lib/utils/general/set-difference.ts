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
 * const a = [{ title: 'A' }, { title: 'B' }, { title: 'C' }];
 * const b = [{ title: 'A' }, { title: 'D' }];
 * const notInB = setDiff(b, a, (x) => x.title);
 * console.log(notInB); // Output: [{ title: 'B' }, { title: 'C' }]
 */
export function setDiff<T>(
  setA: T[],
  setB: T[],
  getKey: (a: T) => string,
): T[] {
  const keysB = new Set(setB.map(getKey));
  return setA.filter((a) => !keysB.has(getKey(a)));
}
