import { getAllProjects } from "@/procedures/project";
import { ClientSection } from "./client-section";
import { Heading } from "@/components/heading";

export default async function Projects() {
  const allocationInstanceId = "1029";

  const projects = await getAllProjects(allocationInstanceId);

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
