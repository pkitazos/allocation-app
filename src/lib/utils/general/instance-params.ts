import { InstanceParams } from "@/lib/validations/params";

export function expand(params: InstanceParams, instanceId?: string) {
  return {
    allocationGroupId: params.group,
    allocationSubGroupId: params.subGroup,
    allocationInstanceId: instanceId ?? params.instance,
  };
}
