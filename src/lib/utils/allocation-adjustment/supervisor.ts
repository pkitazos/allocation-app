import {
  ProjectInfo,
  SupervisorAllocationData,
  SupervisorDetails,
} from "@/lib/validations/allocation-adjustment";

import { getProjectInfo } from "./project";

export function toSupervisorDetails(supervisorData: SupervisorAllocationData) {
  return {
    supervisorId: supervisorData.userId,
    lowerBound: supervisorData.projectAllocationLowerBound,
    target: supervisorData.projectAllocationTarget,
    upperBound: supervisorData.projectAllocationUpperBound,
    projects: supervisorData.userInInstance.supervisorProjects.map((e) => e.id),
  };
}

export function getCurrentCapacity(
  allProjects: ProjectInfo[],
  s: SupervisorDetails,
) {
  return s.projects.filter((id) => {
    const project = getProjectInfo(allProjects, id);
    return project.allocatedTo.length !== 0;
  }).length;
}

export function withinCapacity(
  allProjects: ProjectInfo[],
  s: SupervisorDetails,
) {
  const capacity = getCurrentCapacity(allProjects, s);
  return capacity >= s.lowerBound && capacity <= s.upperBound;
}

export function allSupervisorsValid(
  allProjects: ProjectInfo[],
  supervisors: SupervisorDetails[],
) {
  return supervisors.map((s) => withinCapacity(allProjects, s)).every(Boolean);
}
