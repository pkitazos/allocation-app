"use client";
import DataTable from "@/components/ui/data-table/data-table";
import { columns } from "./projects-columns";
import { data } from "@/data/all-projects";

export default function Projects() {
  return (
    <div className="flex flex-col w-2/3 max-w-7xl">
      <div className="flex rounded-md bg-accent py-5 px-6">
        <h1 className="text-5xl text-accent-foreground">Projects</h1>
      </div>
      <DataTable className="w-full" columns={columns} data={data} />
    </div>
  );
}
