import { ProjectInfo } from "@/lib/validations/allocation-adjustment";

export function withinBounds(project: ProjectInfo) {
  const { capacityLowerBound, capacityUpperBound, allocatedTo } = project;
  return (
    capacityLowerBound <= allocatedTo.length &&
    allocatedTo.length <= capacityUpperBound
  );
}
