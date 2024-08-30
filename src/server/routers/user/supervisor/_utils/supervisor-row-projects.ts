type SupervisorProject = {
  description: string;
  id: string;
  allocations: { student: { user: { id: string; name: string | null } } }[];
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

    // ! breaks if pre-allocated student is removed
    if (preAllocatedStudentId) {
      const idx = allocations.findIndex(
        (a) => a.student.user.id === preAllocatedStudentId,
      );

      if (idx === -1) {
        return {
          ...rest,
          allocatedStudentId: undefined,
          allocatedStudentName: undefined,
        };
      }

      return {
        ...rest,
        allocatedStudentId: preAllocatedStudentId,
        allocatedStudentName: allocations[idx].student.user.name!,
      };
    }

    if (allocations.length === 0) {
      return {
        ...rest,
        allocatedStudentId: undefined,
        allocatedStudentName: undefined,
      };
    }

    return allocations.map((allocation) => ({
      ...rest,
      allocatedStudentId: allocation.student.user.id,
      allocatedStudentName: allocation.student.user.name!,
    }));
  });
}
