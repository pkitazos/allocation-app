import { Heading, SubHeading } from "@/components/heading";
import { PageWrapper } from "@/components/page-wrapper";

import { api } from "@/lib/trpc/server";
import { InstanceParams } from "@/lib/validations/params";

import { SupervisorProjectsDataTable } from "./_components/supervisor-projects-data-table";

interface pageParams extends InstanceParams {
  id: string;
}

export default async function Page({ params }: { params: pageParams }) {
  const { supervisorProjects, user: supervisor } =
    await api.user.supervisor.instanceData({
      params,
      supervisorId: params.id,
    });

  const { user, role } = await api.user.userRole({ params });
  const stage = await api.institution.instance.currentStage({ params });

  return (
    <PageWrapper>
      <Heading>{supervisor.name}</Heading>
      <SubHeading className="mt-6">All Projects</SubHeading>
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
    </PageWrapper>
  );
}
