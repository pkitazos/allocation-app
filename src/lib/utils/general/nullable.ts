export function nullable<T>(arg: T | undefined) {
  return arg ?? null;
}
