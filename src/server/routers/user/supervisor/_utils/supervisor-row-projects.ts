type SupervisorProject = {
  description: string;
  id: string;
  allocations: {
    userId: string;
  }[];
  title: string;
  capacityLowerBound: number;
  capacityUpperBound: number;
  preAllocatedStudentId: string | null;
};

export function formatSupervisorRowProjects(
  supervisorProjects: SupervisorProject[],
) {
  return supervisorProjects.flatMap((project) => {
    const { allocations, preAllocatedStudentId, ...rest } = project;

    if (preAllocatedStudentId) {
      return { ...rest, allocatedStudentId: preAllocatedStudentId };
    }

    if (allocations.length === 0) {
      return { ...rest, allocatedStudentId: undefined };
    }

    return allocations.map((allocation) => ({
      ...rest,
      allocatedStudentId: allocation.userId,
    }));
  });
}
