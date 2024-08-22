import { GroupParams, SubGroupParams } from "@/lib/validations/params";

type GroupOrSubGroup = {
  allocationGroupId: string | null;
  allocationSubGroupId: string | null;
};

/**
 * Categorizes an array of admin spaces into groups and sub-groups.
 *
 * @description
 * This function processes an array of `GroupOrSubGroup` objects, identifying each as either a group or a sub-group based on the presence of `allocationGroupId` and `allocationSubGroupId`.
 * It returns an object containing two arrays: `groups` for categorized group spaces and `subGroups` for categorized sub-group spaces.
 * The `subGroups` array is filtered to remove any sub-groups whose parent group is already present in the `groups` array.
 *
 * @param {GroupOrSubGroup[]} spaces - An array of objects representing admin spaces, each containing `allocationGroupId` and `allocationSubGroupId`.
 *
 * @returns {{ groups: GroupParams[], subGroups: SubGroupParams[] }} An object containing categorized group and sub-group spaces.
 *
 * @throws {Error} If an admin space in the input array is invalid (i.e., missing both `allocationGroupId` and `allocationSubGroupId`).
 */
export function partitionSpaces(spaces: GroupOrSubGroup[]): {
  groups: GroupParams[];
  subGroups: SubGroupParams[];
} {
  const groups: GroupParams[] = [];
  const subGroups: SubGroupParams[] = [];
  for (const space of spaces) {
    if (space.allocationGroupId && !space.allocationSubGroupId) {
      // this is a group
      groups.push({ group: space.allocationGroupId });
    } else if (space.allocationGroupId && space.allocationSubGroupId) {
      // this is a sub-group
      subGroups.push({
        group: space.allocationGroupId,
        subGroup: space.allocationSubGroupId,
      });
    } else {
      throw new Error("Invalid admin space");
    }
  }
  return {
    groups,
    subGroups: subGroups.filter(
      (s) => !groups.map((g) => g.group).includes(s.group),
    ),
  };
}
