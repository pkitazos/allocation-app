/**
 * Find an object in an array of objects with a `title` property
 * @param items an array of objects with a `title` property
 * @param title the `title` to search for
 * @returns the object with the matching `title`
 * @example const items = [{ id: '1', title: 'A' }, { id: '2', title: 'B' }];
 * const item = findItemFromTitle(items, 'B');
 * console.log(item); // Output: { id: '2', title: 'B' }
 */
export function findItemFromTitle<T extends { id: string; title: string }>(
  items: T[],
  title: string,
) {
  const itemIdx = items.findIndex((item) => item.title === title);
  if (itemIdx === -1) throw new Error(`Title ${title} not found in items`);
  return items[itemIdx];
}
