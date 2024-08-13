import { PanelWrapper } from "@/components/panel-wrapper";

import { api } from "@/lib/trpc/server";
import { InstanceParams } from "@/lib/validations/params";

import { AdjustmentSpace, AllocDetailsProvider } from "./_components";

export default async function Page({ params }: { params: InstanceParams }) {
  const { students, projects, supervisors } =
    await api.institution.instance.matching.rowData({
      params,
    });

  return (
    <PanelWrapper className="mt-10 flex h-full justify-center">
      <AllocDetailsProvider
        students={students}
        projects={projects}
        supervisors={supervisors}
        studentsBackup={structuredClone(students)}
        selectedStudentIds={[]}
      >
        <AdjustmentSpace />
      </AllocDetailsProvider>
    </PanelWrapper>
  );
}
