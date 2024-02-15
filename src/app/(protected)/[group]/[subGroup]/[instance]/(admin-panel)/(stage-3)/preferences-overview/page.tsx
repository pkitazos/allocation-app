import { api } from "@/lib/trpc/server";
import { SubmissionsTable } from "./_components/submissions-table";
import { InstanceParams } from "@/lib/validations/params";

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
