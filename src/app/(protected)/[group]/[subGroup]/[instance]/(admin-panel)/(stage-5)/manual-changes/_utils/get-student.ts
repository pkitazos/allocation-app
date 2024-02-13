import {
  ProjectInfo,
  StudentRow,
} from "@/lib/validations/allocation-adjustment";

export function getStudent(students: StudentRow[], studentId: string) {
  return students.find(({ student }) => student.id === studentId)!;
}

export function getStudents(students: StudentRow[], studentIds: string[]) {
  return students.filter(({ student }) => studentIds.includes(student.id));
}

export function inAllocatedTo(projects: ProjectInfo[], studentId: string) {
  return projects.findIndex((p) => p.allocatedTo.includes(studentId));
}
