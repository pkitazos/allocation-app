import { Heading } from "@/components/heading";
import { PageWrapper } from "@/components/page-wrapper";

import { api } from "@/lib/trpc/server";
import { InstanceParams } from "@/lib/validations/params";

import { ProjectsDataTable } from "./_components/all-projects-data-table";

export default async function Projects({ params }: { params: InstanceParams }) {
  const user = await api.user.get();
  const role = await api.user.role({ params });
  const projects = await api.project.getAllForUser({ params });

  return (
    <PageWrapper>
      <Heading>All Projects</Heading>
      <ProjectsDataTable user={user} role={role} data={projects} />
    </PageWrapper>
  );
}
