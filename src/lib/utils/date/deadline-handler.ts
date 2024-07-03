import { addHours } from "date-fns";

/**
 *
 * @param date the date selected by the user
 * @returns the date with the correct amount of hours and minutes added
 */
export function deadlineHandler(date: Date) {
  //   TODO: set deadline correctly
  const actualDate = addHours(date, 1);
  return actualDate;
}
