/**
 * Computes the intersection of two sets
 * @param a set A
 * @param b set B
 * @param getKey a function to get the key of the element
 * @returns the intersection of set A and set B
 */
export function setIntersection<T>(a: T[], b: T[], getKey: (a: T) => any) {
  return a.filter((x) => b.some((y) => getKey(x) === getKey(y)));
}
