import { Heading } from "@/components/heading";
import { PageWrapper } from "@/components/page-wrapper";

import { api } from "@/lib/trpc/server";
import { InstanceParams } from "@/lib/validations/params";

import { SupervisorsDataTable } from "./_components/all-supervisors-data-table";

export default async function Page({ params }: { params: InstanceParams }) {
  const role = await api.user.role({ params });
  const tableData = await api.institution.instance.supervisors({ params });

  return (
    <PageWrapper>
      <Heading>All Supervisors</Heading>
      <SupervisorsDataTable role={role} data={tableData} />
    </PageWrapper>
  );
}
