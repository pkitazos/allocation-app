import { Heading } from "@/components/heading";
import { api } from "@/lib/trpc/server";
import { ProjectsDataTable } from "./projects-data-table";

export default async function Projects({
  params,
}: {
  params: { group: string; subGroup: string; instance: string };
}) {
  const tableData = await api.project.getTableData.query({ params });

  return (
    <div className="flex w-2/3 max-w-7xl flex-col">
      <Heading title="Projects" />
      <ProjectsDataTable data={tableData} />
    </div>
  );
}
