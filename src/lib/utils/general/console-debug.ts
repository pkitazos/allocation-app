export function dbg<T>(label: string, obj?: T) {
  const mode = true;
  if (mode) console.log(`------------ ${label}`, obj ?? "");
}
