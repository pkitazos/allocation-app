import { SortablePreference } from "@/lib/validations/board";

/***
 * sorts two items by their preference
 * @usage `sortedMovies = items.sort(sortMovies)`
 */
export function sortItems(a: SortablePreference, b: SortablePreference) {
  return a.rank - b.rank;
}
