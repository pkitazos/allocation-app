import { Heading } from "@/components/heading";
import { PageWrapper } from "@/components/page-wrapper";

import { api } from "@/lib/trpc/server";
import { InstanceParams } from "@/lib/validations/params";

import { StudentsDataTable } from "./_components/students-data-table";

export default async function Students({ params }: { params: InstanceParams }) {
  const role = await api.user.role({ params });
  const tableData = await api.institution.instance.students({ params });

  const stage = await api.institution.instance.currentStage({ params });

  return (
    <PageWrapper>
      <Heading>Students</Heading>
      <StudentsDataTable role={role} stage={stage} data={tableData} />
    </PageWrapper>
  );
}
