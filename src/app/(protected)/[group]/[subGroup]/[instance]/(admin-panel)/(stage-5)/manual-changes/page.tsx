import { api } from "@/lib/trpc/server";
import { instanceParams } from "@/lib/validations/params";

import { AdjustmentSpace, AllocDetailsProvider } from "./_components";

export default async function Page({ params }: { params: instanceParams }) {
  const { students, projects } =
    await api.institution.instance.matching.rowData.query({
      params,
    });

  return (
    <div className="mt-10 flex h-full justify-center px-20">
      <AllocDetailsProvider
        students={students}
        projects={projects}
        studentsBackup={structuredClone(students)}
        selectedStudentIds={[]}
      >
        <AdjustmentSpace params={params} />
      </AllocDetailsProvider>
    </div>
  );
}
