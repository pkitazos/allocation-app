"use client";

import DataTable from "@/components/ui/data-table/data-table";

import { SavedPreferenceDto } from "@/lib/validations/dto/preference";

import { savedPreferencesColumns } from "./columns";

export function StudentSavedPreferenceDataTable({
  data,
}: {
  data: SavedPreferenceDto[];
}) {
  return (
    <DataTable
      searchableColumn={{ id: "Title", displayName: "Project Title" }}
      className="w-full"
      columns={savedPreferencesColumns}
      data={data}
    />
  );
}
