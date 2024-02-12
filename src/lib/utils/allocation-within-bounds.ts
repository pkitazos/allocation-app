import { RowProject } from "@/lib/validations/allocation-adjustment";

export function allocationWithinBounds(project: RowProject) {
  const { capacityLowerBound, capacityUpperBound, allocatedTo } = project;
  return (
    capacityLowerBound <= allocatedTo.length &&
    allocatedTo.length <= capacityUpperBound
  );
}
