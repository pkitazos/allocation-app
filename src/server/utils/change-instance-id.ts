export function changeInstanceId<T extends { allocationInstanceId: string }>(
  items: T[],
  newId: string,
) {
  return items.map((item) => ({
    ...item,
    allocationInstanceId: newId,
  }));
}
