export type Result<T, E> =
  | { success: true; data: T }
  | { success: false; msg: E };

export function OK<T>(data: T) {
  return { success: true as const, data };
}

export function Err<T>(msg: T) {
  return { success: false as const, msg };
}
