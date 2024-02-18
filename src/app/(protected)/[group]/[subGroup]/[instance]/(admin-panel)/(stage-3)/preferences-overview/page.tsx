import { api } from "@/lib/trpc/server";
import { InstanceParams } from "@/lib/validations/params";

import { SubmissionsTable } from "./_components/submissions-table";

export default async function Page({ params }: { params: InstanceParams }) {
  const { studentData } =
    await api.institution.instance.project.preferenceInfo.query({
      params,
    });

  return (
    <div>
      <SubmissionsTable preferences={studentData} />
    </div>
  );
}
