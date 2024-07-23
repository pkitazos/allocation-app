import { SubHeading } from "@/components/heading";
import { PanelWrapper } from "@/components/panel-wrapper";

import { api } from "@/lib/trpc/server";
import { InstanceParams } from "@/lib/validations/params";

import { SendAllocationsSection } from "./_components/send-allocations";
import { SendStudentSection } from "./_components/send-student-section";
import { SendSupervisorSection } from "./_components/send-supervisor-section";

export default async function Page({ params }: { params: InstanceParams }) {
  const { studentData, supervisorData, projectData } =
    await api.institution.instance.matching.exportDataToExternalSystem({
      params,
    });

  return (
    <PanelWrapper className="flex flex-col gap-5 pt-8">
      {/* // TODO: add to NoteCard after merging branches */}
      <p>Include note card here explaining the steps/what will happen?</p>
      <SubHeading className="mt-3">
        Check Students on Assessment System
      </SubHeading>
      <p>Info on what happens/results maybe? </p>
      <SendStudentSection studentData={studentData} />
      <SubHeading className="mt-3">
        Check Supervisor on Assessment System
      </SubHeading>
      <p>Info on what happens: </p>
      <SendSupervisorSection supervisorData={supervisorData} />
      <SubHeading className="mt-3">
        Check Students on Assessment System
      </SubHeading>
      <p>Info on what happens: </p>
      <SendAllocationsSection projectData={projectData} />
    </PanelWrapper>
  );
}
