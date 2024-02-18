"use client";
import DataTable from "@/components/ui/data-table/data-table";

import { columns,StudentData } from "./students-columns";

export function StudentsDataTable({ data }: { data: StudentData[] }) {
  return <DataTable className="w-full" columns={columns} data={data} />;
}
