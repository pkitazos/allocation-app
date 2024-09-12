import { InstanceParams } from "@/lib/validations/params";

export function expand(params: InstanceParams) {
  return {
    allocationGroupId: params.group,
    allocationSubGroupId: params.subGroup,
    allocationInstanceId: params.instance,
  };
}
