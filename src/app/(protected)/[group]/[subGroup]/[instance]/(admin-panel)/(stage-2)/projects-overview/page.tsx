import { api } from "@/lib/trpc/server";
import { SubmissionsTable } from "./_components/submissions-table";
import { instanceParams } from "@/lib/validations/params";

export default async function Page({ params }: { params: instanceParams }) {
  const data = await api.institution.instance.project.submissionInfo.query({
    params,
  });

  return (
    <div>
      <SubmissionsTable capacities={data} />
    </div>
  );
}
