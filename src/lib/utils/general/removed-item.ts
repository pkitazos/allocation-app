export function removedItem<T>(array: T[], item: T) {
  const index = array.indexOf(item);
  if (index === -1) return array;
  return array.toSpliced(index, 1);
}
