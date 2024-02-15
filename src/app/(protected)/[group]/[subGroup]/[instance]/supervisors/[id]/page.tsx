import { api } from "@/lib/trpc/server";
import { ProjectsDataTable } from "./supervisor-projects-data-table";
import { InstanceParams } from "@/lib/validations/params";

interface pageParams extends InstanceParams {
  id: string;
}

export default async function Page({ params }: { params: pageParams }) {
  const { supervisorProjects, user: supervisor } =
    await api.user.supervisor.instanceData.query({
      params,
      supervisorId: params.id,
    });

  return (
    <div className="flex w-2/3 max-w-7xl flex-col">
      <div className="flex rounded-md bg-accent px-6 py-5">
        <h1 className="text-5xl text-accent-foreground">{supervisor.name}</h1>
      </div>
      <div className="mt-6 flex gap-6">
        <ProjectsDataTable data={supervisorProjects} />
      </div>
    </div>
  );
}
