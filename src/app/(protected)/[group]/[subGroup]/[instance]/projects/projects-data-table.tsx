"use client";
import DataTable from "@/components/ui/data-table/data-table";
import { ProjectTableData, projectColumns } from "./projects-columns";

export function ProjectsDataTable({ data }: { data: ProjectTableData[] }) {
  return (
    <>
      <DataTable className="w-full" columns={projectColumns} data={data} />
    </>
  );
}
