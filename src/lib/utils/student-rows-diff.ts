import { StudentRow } from "@/lib/validations/allocation-adjustment";

export function rowsDiff(array: StudentRow[], subArray: StudentRow[]) {
  const ids = new Set(subArray.map(({ student }) => student.id));
  return array.filter(({ student }) => !ids.has(student.id));
}
