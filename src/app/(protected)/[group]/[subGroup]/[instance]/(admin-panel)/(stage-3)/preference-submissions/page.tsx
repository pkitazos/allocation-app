import { SubHeading } from "@/components/heading";
import { PanelWrapper } from "@/components/panel-wrapper";

import { api } from "@/lib/trpc/server";
import { InstanceParams } from "@/lib/validations/params";

import { SubmissionsTable } from "./_components/submissions-table";

export default async function Page({ params }: { params: InstanceParams }) {
  const { studentData } =
    await api.institution.instance.project.preferenceInfo.query({
      params,
    });

  return (
    <PanelWrapper className="mt-10 flex flex-col items-start gap-8 px-12">
      <SubHeading className="text-2xl">
        Student Preference Submissions
      </SubHeading>
      <SubmissionsTable preferences={studentData} />
    </PanelWrapper>
  );
}
