import {
  GroupParams,
  InstanceParams,
  instanceParamsSchema,
  RefinedSpaceParams,
  SubGroupParams,
  subGroupParamsSchema,
} from "@/lib/validations/params";

/**
 * Dispatches an operation based on the type of space parameters provided.
 *
 * @description
 * This function attempts to parse the input `params` into different space types
 * (instance, sub-group, group) using their respective schemas.
 * Depending on the successful parse result, it invokes the corresponding callback function
 * (`instanceCallback`, `subGroupCallback`, `groupCallback`) with the parsed data.
 *
 * @param {RefinedSpaceParams} params - The parameters representing a space (instance, sub-group, or group).
 * @param {(p: GroupParams) => Promise<boolean>} groupCallback - The callback function to execute if `params` represent a group.
 * @param {(p: SubGroupParams) => Promise<boolean>} subGroupCallback - The callback function to execute if `params` represent a sub-group.
 * @param {(p: InstanceParams) => Promise<boolean>} instanceCallback - The callback function to execute if `params` represent an instance.
 *
 */
export async function dispatchBySpace<T>(
  params: RefinedSpaceParams,
  groupCallback: (p: GroupParams) => Promise<T>,
  subGroupCallback: (p: SubGroupParams) => Promise<T>,
  instanceCallback: (p: InstanceParams) => Promise<T>,
): Promise<T> {
  const instanceResult = instanceParamsSchema.safeParse(params);

  if (instanceResult.success) {
    return instanceCallback(instanceResult.data);
  }

  const subGroupResult = subGroupParamsSchema.safeParse(params);

  if (subGroupResult.success) {
    return subGroupCallback(subGroupResult.data);
  }

  return groupCallback(params);
}
