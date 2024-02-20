export function getUpdatedRank<T extends { rank: number }>(
  arr: T[],
  targetIdx: number,
): number {
  // console.log("state of the array: ", { arr });
  // console.log("position item moved to: ", { arr });

  // if the array was empty set the rank of the item to 1
  if (arr.length === 0) {
    // console.log("(if 0) updated rank: ", { updatedRank: 1 });
    return 1;
  }

  /**
   * The item was placed as the first element in the array
   * because of the above guard clause, we know the array has at least 1 element in it
   * the rank we need is that of the second element
   */
  if (targetIdx === 0) {
    const after = arr[0];
    // console.log("(if 1) updated rank: ", { updatedRank: after.rank / 2 });
    return after.rank / 2;
  }

  /**
   * The item was placed as the last element in the array
   * meaning we need to know the rank of the previously last element in the array
   * the rank we need is that of the current second to last element
   * (targetIdx points to the last element, so targetIdx-1 is the one before)
   */
  if (targetIdx === arr.length - 1) {
    const before = arr[targetIdx - 1];
    // console.log("(if 2) updated rank: ", {
    //   updatedRank: before.rank + 1,
    // });
    return before.rank + 1;
  }

  /**
   * finally, if the item is placed anywhere else in the array, all we need to do
   * is get the rank of the items before and after it,
   * and set the updated rank to the midpoint between the two
   */
  const before = arr[targetIdx - 1];
  const after = arr[targetIdx + 1];
  // console.log("(if 3) updated rank: ", {
  //   updatedRank: (before.rank + after.rank) / 2,
  // });
  return (before.rank + after.rank) / 2;
}
