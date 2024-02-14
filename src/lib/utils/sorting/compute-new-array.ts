import { UniqueIdentifier } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

import { SortablePreference } from "@/lib/validations/board";

/***
 * ? assume there are at least 2 elements in items
 */
export function computeNewArr(
  activeID: UniqueIdentifier,
  overID: UniqueIdentifier,
  items: SortablePreference[],
): SortablePreference[] {
  const oldIndex = items.findIndex((item) => item.id === activeID);
  const newIndex = items.findIndex((item) => item.id === overID);

  const arr = arrayMove(items, oldIndex, newIndex);

  const targetIndex = arr.findIndex((item) => item.id === activeID);

  const prevPref = arr[targetIndex - 1]?.rank ?? 0;
  const nextPref =
    arr[targetIndex + 1]?.rank ?? Math.max(...arr.map((e) => e.rank)) + 1;

  const newPref = (prevPref + nextPref) / 2;

  arr[targetIndex]!.rank = newPref;
  arr[targetIndex]!.changed = true;

  return arr;
}
