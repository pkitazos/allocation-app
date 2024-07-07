import { Heading } from "@/components/heading";
import { PageWrapper } from "@/components/page-wrapper";

import { api } from "@/lib/trpc/server";
import { InstanceParams } from "@/lib/validations/params";

import { ProjectsDataTable } from "./_components/projects-data-table";

export default async function Projects({ params }: { params: InstanceParams }) {
  const user = await api.user.get();
  const role = await api.user.role({ params });

  const tableData = await api.project.getTableData({ params });
  const stage = await api.institution.instance.currentStage({ params });

  return (
    <PageWrapper>
      <Heading>Projects</Heading>
      <ProjectsDataTable
        user={user}
        role={role}
        stage={stage}
        data={tableData}
      />
    </PageWrapper>
  );
}
