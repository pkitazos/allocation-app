import { StudentRow } from "@/lib/validations/allocation-adjustment";

export function rowsDiff(array: StudentRow[], subArray: string[]) {
  const ids = new Set(subArray);
  return array.filter(({ student }) => !ids.has(student.id));
}
