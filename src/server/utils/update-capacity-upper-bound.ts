import { Project, ProjectAllocation } from "@prisma/client";

type ProjectWithAllocations = Project & {
  allocations: ProjectAllocation[];
};

/**
 * Calculates any changes made to the capacityUpperBound of a project in the forked instance
 * @param parentProject the equivalent project in the parent instance
 * @param forkedProject the project in the forked instance
 * @returns the updated capacityUpperBound for the forked project
 */
export function updateCapacityUpperBound(
  parentProject: ProjectWithAllocations,
  forkedProject: ProjectWithAllocations,
) {
  const allocationsInParentInstance = parentProject.allocations.length;
  const changedCapacityInForkedInstance = forkedProject.capacityUpperBound;
  return allocationsInParentInstance + changedCapacityInForkedInstance;
}
