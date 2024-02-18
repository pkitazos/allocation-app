import { Heading } from "@/components/heading";

import { api } from "@/lib/trpc/server";
import { InstanceParams } from "@/lib/validations/params";

import { ProjectsDataTable } from "./_components/projects-data-table";

export default async function Projects({ params }: { params: InstanceParams }) {
  const { user, role } = await api.user.userRole.query({ params });
  const tableData = await api.project.getTableData.query({ params });

  return (
    <div className="flex w-2/3 max-w-7xl flex-col">
      <Heading>Projects</Heading>
      <ProjectsDataTable user={user} role={role} data={tableData} />
    </div>
  );
}
