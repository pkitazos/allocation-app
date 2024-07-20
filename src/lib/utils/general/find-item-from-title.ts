export function findItemFromTitle<T extends { id: string; title: string }>(
  items: T[],
  title: string,
) {
  const itemIdx = items.findIndex((item) => item.title === title);
  if (itemIdx === -1) throw new Error(`Title ${title} not found in items`);
  return items[itemIdx];
}
