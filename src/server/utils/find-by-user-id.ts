export function findByUserId<T extends { userId: string }>(
  items: T[],
  userId: string,
) {
  const idx = items.findIndex((e) => e.userId === userId);
  if (idx === -1) throw new Error("User not found");
  return items[idx];
}
