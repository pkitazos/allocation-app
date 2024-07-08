import { getHours, getMinutes, set } from "date-fns";

export function updateDateOnly(oldDate: Date, newDate: Date) {
  const hours = getHours(oldDate);
  const minutes = getMinutes(oldDate);
  return set(newDate, { hours, minutes });
}
