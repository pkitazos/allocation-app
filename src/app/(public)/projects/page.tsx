import { getAllProjects } from "@/procedures/project";
import { ClientSection } from "./client-section";

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
      <div className="flex rounded-md bg-accent px-6 py-5">
        <h1 className="text-5xl text-accent-foreground">Projects</h1>
      </div>
      <ClientSection data={tableData} />
    </div>
  );
}
