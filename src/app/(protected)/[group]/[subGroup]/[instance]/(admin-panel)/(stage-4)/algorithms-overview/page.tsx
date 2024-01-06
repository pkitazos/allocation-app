import { api } from "@/lib/trpc/server";
import { ClientSection } from "./client-section";

export default async function Page({
  params,
}: {
  params: { group: string; subGroup: string; instance: string };
}) {
  const matchingData =
    await api.institution.instance.matchingData.query(params);

  return (
    <div className="mt-20 flex flex-col items-center">
      <div className="flex min-w-[50%] flex-col gap-3">
        <h2 className="mb-6 text-2xl font-semibold">
          Select Algorithms to run
        </h2>
        <ClientSection
          groupId={params.group}
          subGroupId={params.subGroup}
          instanceId={params.instance}
          matchingData={matchingData}
        />
      </div>
    </div>
  );
}
