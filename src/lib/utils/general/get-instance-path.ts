import { instanceParams } from "@/lib/validations/params";

export function formatParamsAsPath(instanceParams: instanceParams) {
  const { group, subGroup, instance } = instanceParams;
  return `/${group}/${subGroup}/${instance}`;
}
