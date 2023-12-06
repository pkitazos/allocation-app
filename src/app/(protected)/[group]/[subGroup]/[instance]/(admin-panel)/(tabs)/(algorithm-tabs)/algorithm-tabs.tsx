import { TabsContent } from "@/components/ui/tabs";
import { api } from "@/lib/trpc/server";
import { OverviewClientSection } from "./overview-client-section";
import { DetailsSection } from "./details-section";

export async function AlgorithmTabs({
  groupId,
  subGroupId,
  instanceId,
  tabValues,
}: {
  groupId: string;
  subGroupId: string;
  instanceId: string;
  tabValues: string[];
}) {
  const matchingData = await api.institution.instance.getMatchingData.query({
    groupId,
    subGroupId,
    instanceId,
  });

  return (
    <>
      <TabsContent value={tabValues[0]}>
        <div className="mt-20 flex flex-col items-center">
          <div className="flex flex-col gap-3">
            <h2 className="mb-6 text-2xl font-semibold">
              Select Algorithms to run
            </h2>
            <OverviewClientSection matchingData={matchingData} />
          </div>
        </div>
      </TabsContent>
      <TabsContent value={tabValues[1]}>
        <div className="mt-20 flex flex-col items-center">
          <div className="flex flex-col gap-3">
            <h2 className="mb-6 text-2xl font-semibold">Algorithm Results</h2>
            <DetailsSection />
          </div>
        </div>
      </TabsContent>
    </>
  );
}
