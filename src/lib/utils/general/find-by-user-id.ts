/**
 * Find an object in an array by its `userId` property
 * @param items an array of objects with a `userId` property
 * @param userId the `userId` to search for
 * @returns the object with the matching `userId`
 * @example const items = [{ userId: '1', name: 'A' }, { userId: '2', name: 'B' }];
 * const item = findByUserId(items, '2');
 * console.log(item); // Output: { userId: '2', name: 'B' }
 */
export function findByUserId<T extends { userId: string }>(
  items: T[],
  userId: string,
) {
  const idx = items.findIndex((e) => e.userId === userId);
  if (idx === -1) throw new Error("User not found");
  return items[idx];
}
