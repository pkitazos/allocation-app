import { api } from "@/lib/trpc/server";
import { InstanceParams } from "@/lib/validations/params";

import { SubmissionsTable } from "./_components/submissions-table";

export default async function Page({ params }: { params: InstanceParams }) {
  const data = await api.institution.instance.project.submissionInfo.query({
    params,
  });

  return (
    <div>
      <SubmissionsTable capacities={data} />
    </div>
  );
}
