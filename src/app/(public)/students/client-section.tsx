"use client";
import DataTable from "@/components/ui/data-table/data-table";
import { columns } from "./students-columns";
import { Student } from "@prisma/client";

export function ClientSection({ data }: { data: Student[] }) {
  return (
    <>
      <DataTable className="w-full" columns={columns} data={data} />
    </>
  );
}
