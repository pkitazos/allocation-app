import { format } from "date-fns";

/**
 *
 * @param date a date object
 * @returns correctly formatted date string
 */
export function dateFormatter(date: Date) {
  const day = format(date, "dd");
  const month = format(date, "MMM");
  const year = format(date, "yyyy");
  return `${day} ${month} ${year}`;
}
