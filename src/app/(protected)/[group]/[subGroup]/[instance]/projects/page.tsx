import { ClientSection } from "./client-section";
import { Heading } from "@/components/heading";
import { api } from "@/lib/trpc/server";

export default async function Projects({
  params,
}: {
  params: { group: string; subGroup: string; instance: string };
}) {
  const tableData = await api.project.getTableData.query({
    allocationInstanceId: params.instance,
  });

  return (
    <div className="flex w-2/3 max-w-7xl flex-col">
      <Heading title="Projects" />
      <ClientSection data={tableData} />
    </div>
  );
}
