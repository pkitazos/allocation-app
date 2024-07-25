export function changeInstanceId<T extends { allocationInstanceId: string }>(
  item: T,
  newId: string,
) {
  return {
    ...item,
    allocationInstanceId: newId,
  };
}
