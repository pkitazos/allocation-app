export function findDuplicates<T>(
  users: T[],
  getKey: (user: T) => string,
): Record<string, number> {
  const count = users.reduce(
    (acc, user) => {
      const key = getKey(user);
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return Object.fromEntries(
    Object.entries(count).filter(([, value]) => value > 1),
  );
}
