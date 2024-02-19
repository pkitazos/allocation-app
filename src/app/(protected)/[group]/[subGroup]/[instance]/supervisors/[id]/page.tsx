import { Heading, SubHeading } from "@/components/heading";

import { api } from "@/lib/trpc/server";
import { InstanceParams } from "@/lib/validations/params";

import { SupervisorProjectsDataTable } from "./_components/supervisor-projects-data-table";

interface pageParams extends InstanceParams {
  id: string;
}

export default async function Page({ params }: { params: pageParams }) {
  const { supervisorProjects, user: supervisor } =
    await api.user.supervisor.instanceData.query({
      params,
      supervisorId: params.id,
    });

  const { user, role } = await api.user.userRole.query({ params });
  const stage = await api.institution.instance.currentStage.query({ params });

  return (
    <div className="flex w-2/3 max-w-7xl flex-col">
      <Heading>{supervisor.name}</Heading>

      <SubHeading className="mt-16">All Projects</SubHeading>
      <div className="mt-6 flex gap-6">
        <SupervisorProjectsDataTable
          user={user}
          role={role}
          stage={stage}
          supervisorId={supervisor.id}
          data={supervisorProjects.map((e) => ({
            supervisorId: supervisor.id,
            ...e,
          }))}
        />
      </div>
    </div>
  );
}
