import { ClientSection } from "./client-section";
import { Heading } from "@/components/heading";
import { api } from "@/lib/trpc/server";

export default async function Projects() {
  const projects = await api.project.getAll.query({
    allocationInstanceId: "1a9c55f9-3c96-4860-bfab-80ba13c83ae6",
  });

  const tableData = projects.map(
    ({ id, title, description, supervisor: { name } }) => ({
      id,
      title,
      description,
      supervisorName: name,
    }),
  );

  return (
    <div className="flex w-2/3 max-w-7xl flex-col">
      <Heading title="Projects" />
      <ClientSection data={tableData} />
    </div>
  );
}
