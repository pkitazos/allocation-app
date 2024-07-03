import { removedItem } from "@/lib/utils/general/removed-item";
import {
  ProjectInfo,
  StudentRow,
} from "@/lib/validations/allocation-adjustment";

import { getProjectInfo } from "./project";

export function getStudent(students: StudentRow[], studentId: string) {
  return students.find(({ student }) => student.id === studentId)!;
}

export function getStudents(students: StudentRow[], studentIds: string[]) {
  return students.filter(({ student }) => studentIds.includes(student.id));
}

/**
 *  Get the index of the project in the ProjectInfo array that the student is allocated to
 * @param allProjects list of all projects
 * @param studentId a student ID
 * @returns the index of the project in the `allProjects` that the student is allocated to
 * @example const projects = [{id: "1", allocatedTo: ["1", "2"]}, {id: "2", allocatedTo: ["3"]}]
 * getProjectIdx(projects, "2") // 0
 */
export function getProjectIdx(allProjects: ProjectInfo[], studentId: string) {
  return allProjects.findIndex((p) => p.allocatedTo.includes(studentId));
}

/**
 * Get the project that the student is allocated to
 * @param allProjects list of all projects
 * @param studentId a student ID
 * @returns the project that the student is allocated to
 * @example const projects = [{id: "1", allocatedTo: ["1", "2"]}, {id: "2", allocatedTo: ["3"]}]
 * getProjectInfo(projects, "2") // {id: "1", allocatedTo: ["1", "2"]}
 */
export function getProjectInfoFromStudentId(
  allProjects: ProjectInfo[],
  studentId: string,
): ProjectInfo {
  const idx = getProjectIdx(allProjects, studentId);
  return allProjects[idx];
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
