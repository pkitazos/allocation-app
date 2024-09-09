"use client";

import DataTable from "@/components/ui/data-table/data-table";

import { PreferenceSubmissionDto } from "@/lib/validations/dto/preference";

import { usePreferenceSubmissionColumns } from "./preference-submissions-columns";

export function PreferenceSubmissionsDataTable({
  data,
}: {
  data: PreferenceSubmissionDto[];
}) {
  const columns = usePreferenceSubmissionColumns();

  return (
    <DataTable
      className="w-full"
      searchableColumn={{ id: "Name", displayName: "Names" }}
      columns={columns}
      filters={[
        {
          columnId: "Submitted",
          title: "add filters",
          options: [
            { title: "Submitted", id: "yes" },
            { title: "Not Submitted", id: "no" },
            { title: "Pre-Allocated", id: "pre-allocated" },
          ],
        },
      ]}
      data={data}
    />
  );
}
