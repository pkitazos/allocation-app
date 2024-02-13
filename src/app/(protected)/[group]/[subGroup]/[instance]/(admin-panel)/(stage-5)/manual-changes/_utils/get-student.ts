import {
  ProjectInfo,
  StudentRow,
} from "@/lib/validations/allocation-adjustment";

import { getProjectInfo } from "./get-project";
import { removedItem } from "@/lib/utils/removed-item";

export function getStudent(students: StudentRow[], studentId: string) {
  return students.find(({ student }) => student.id === studentId)!;
}

export function getStudents(students: StudentRow[], studentIds: string[]) {
  return students.filter(({ student }) => studentIds.includes(student.id));
}

export function inAllocatedTo(projects: ProjectInfo[], studentId: string) {
  return projects.findIndex((p) => p.allocatedTo.includes(studentId));
}

export function getSelectedProject(
  allProjects: ProjectInfo[],
  student: StudentRow,
) {
  return getProjectInfo(
    allProjects,
    student.projects.find((p) => p.selected)!.id,
  );
}

export function removeFromAllocations(project: ProjectInfo, studentId: string) {
  const newProject = structuredClone(project);
  newProject.allocatedTo = removedItem(newProject.allocatedTo, studentId);
  return newProject;
}

export function addToAllocations(project: ProjectInfo, studentId: string) {
  if (project.allocatedTo.includes(studentId)) return project;
  const newProject = structuredClone(project);
  newProject.allocatedTo = [...project.allocatedTo, studentId];
  return newProject;
}

export function findAllocation(allProjects: ProjectInfo[], studentId: string) {
  return allProjects.find((p) => p.allocatedTo.includes(studentId))!;
}
