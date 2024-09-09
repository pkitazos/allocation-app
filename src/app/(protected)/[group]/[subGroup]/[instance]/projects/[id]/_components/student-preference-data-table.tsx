"use client";

import DataTable from "@/components/ui/data-table/data-table";

import { ProjectStudentDto } from "@/lib/validations/dto/preference";

import { useStudentPreferenceColumns } from "./student-preference-columns";

export function StudentPreferenceDataTable({
  data,
}: {
  data: ProjectStudentDto[];
}) {
  const columns = useStudentPreferenceColumns();

  return <DataTable columns={columns} data={data} />;
}
