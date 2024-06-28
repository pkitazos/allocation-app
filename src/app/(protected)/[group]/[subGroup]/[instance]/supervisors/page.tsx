import { Heading } from "@/components/heading";
import { PageWrapper } from "@/components/page-wrapper";

import { api } from "@/lib/trpc/server";
import { InstanceParams } from "@/lib/validations/params";

import { SupervisorsDataTable } from "./_components/supervisors-data-table";

export default async function Page({ params }: { params: InstanceParams }) {
  const { user, role } = await api.user.userRole({ params });

  const stage = await api.institution.instance.currentStage({ params });
  const tableData = await api.institution.instance.supervisors({
    params,
  });

  return (
    <PageWrapper>
      <Heading>Supervisors</Heading>
      <SupervisorsDataTable
        stage={stage}
        user={user}
        role={role}
        data={tableData}
      />
    </PageWrapper>
  );
}
