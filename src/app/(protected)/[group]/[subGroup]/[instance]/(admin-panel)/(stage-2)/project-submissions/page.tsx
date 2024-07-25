import { SubHeading } from "@/components/heading";
import { PanelWrapper } from "@/components/panel-wrapper";

import { api } from "@/lib/trpc/server";
import { InstanceParams } from "@/lib/validations/params";

import { SubmissionsTable } from "./_components/submissions-table";

export default async function Page({ params }: { params: InstanceParams }) {
  const data = await api.institution.instance.project.submissionInfo({
    params,
  });

  return (
    <PanelWrapper className="mt-10 flex flex-col items-start gap-8 px-12">
      <SubHeading className="text-2xl">Project Submissions</SubHeading>
      <SubmissionsTable capacities={data} />
    </PanelWrapper>
  );
}
