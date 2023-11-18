import { api } from "@/lib/trpc/server";
import { ClientSection } from "./client-section";

export async function Algorithms({
  groupId,
  subGroupId,
  instanceId,
}: {
  groupId: string;
  subGroupId: string;
  instanceId: string;
}) {
  const matchingData = await api.institution.instance.getMatchingData.query({
    groupId,
    subGroupId,
    instanceId,
  });
  console.log("ADMIN-PANEL");
  console.log(matchingData);
  return (
    <div className="mt-20 flex flex-col items-center">
      <div className="flex w-1/2 flex-col gap-3">
        <h2 className="mb-6 text-2xl font-semibold">
          Select Algorithms to run
        </h2>
        <ClientSection matchingData={matchingData} />
      </div>
    </div>
  );
}
