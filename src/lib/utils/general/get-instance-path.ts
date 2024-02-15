import { InstanceParams } from "@/lib/validations/params";

export function formatParamsAsPath(instanceParams: InstanceParams) {
  const { group, subGroup, instance } = instanceParams;
  return `/${group}/${subGroup}/${instance}`;
}
