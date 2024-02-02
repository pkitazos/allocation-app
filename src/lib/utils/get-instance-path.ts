import { instanceParams } from "@/lib/validations/params";

export function getInstancePath(instanceParams: instanceParams) {
  const { group, subGroup, instance } = instanceParams;
  return `/${group}/${subGroup}/${instance}`;
}
