"use client";
import DataTable from "@/components/ui/data-table/data-table";
import { Supervisor } from "@prisma/client";
import { columns } from "./supervisors-columns";

export function ClientSection({ data }: { data: Supervisor[] }) {
  return (
    <>
      <DataTable className="w-full" columns={columns} data={data} />
    </>
  );
}
