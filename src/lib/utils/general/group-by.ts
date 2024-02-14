export function groupBy<
  T extends Record<K, string | number | symbol>,
  K extends keyof T,
>(arr: T[], property: K): Record<T[K], T[]> {
  return arr.reduce(
    (memo, x) => {
      const key = x[property];
      if (!memo[key]) memo[key] = [];
      memo[key].push(x);
      return memo;
    },
    {} as Record<T[K], T[]>,
  );
}
