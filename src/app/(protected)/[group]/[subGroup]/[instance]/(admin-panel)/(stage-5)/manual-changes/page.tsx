import { api } from "@/lib/trpc/server";
import { InstanceParams } from "@/lib/validations/params";

import { AdjustmentSpace, AllocDetailsProvider } from "./_components";

export default async function Page({ params }: { params: InstanceParams }) {
  const { students, projects, supervisors } =
    await api.institution.instance.matching.rowData.query({
      params,
    });

  console.log("-- -- -- -- -- -- -- --");
  console.log(supervisors[0]);
  console.log("-- -- -- -- -- -- -- --");
  console.log(supervisors[1]);
  console.log("-- -- -- -- -- -- -- --");
  console.log(supervisors[2]);
  console.log("-- -- -- -- -- -- -- --");

  return (
    <div className="mt-10 flex h-full justify-center px-20">
      <AllocDetailsProvider
        students={students}
        projects={projects}
        supervisors={supervisors}
        studentsBackup={structuredClone(students)}
        selectedStudentIds={[]}
      >
        <AdjustmentSpace />
      </AllocDetailsProvider>
    </div>
  );
}
