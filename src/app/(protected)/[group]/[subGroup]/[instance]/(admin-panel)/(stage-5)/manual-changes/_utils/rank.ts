/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  ProjectInfo,
  StudentRow,
} from "@/lib/validations/allocation-adjustment";
import { getStudent } from "./get-student";

function getStudentProjectIds(row: StudentRow): string[] {
  return row.projects.map((p) => p.id);
}

function getProjectRank(projectIds: string[], projectId: string): number {
  return projectIds.findIndex((id) => id === projectId);
}

export function getStudentRank(
  allStudents: StudentRow[],
  studentId: string,
  projectId: string,
): number {
  const student = getStudent(allStudents, studentId);
  const projectIds = getStudentProjectIds(student);
  return getProjectRank(projectIds, projectId);
}

export function getAllocPairs(allProjects: ProjectInfo[]) {
  return allProjects.flatMap((p) =>
    p.allocatedTo.map((userId) => ({ projectId: p.id, userId })),
  );
}
