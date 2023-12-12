import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/trpc/server";
import { Stage } from "@prisma/client";
import { AlgorithmTabs, StageControl } from "./(tabs)";

const tabsRecord: Record<Stage, string[]> = {
  SETUP: ["Add Supervisors", "Add Students"],
  PROJECT_SUBMISSION: ["Invite Supervisors", "Projects Overview"],
  PROJECT_SELECTION: ["Invite Students", "Preferences Overview"],
  PROJECT_ALLOCATION: ["Algorithms Overview", "Algorithm Details"],
  ALLOCATION_PUBLICATION: ["Allocation Overview"],
};

export default async function Page({
  params: { group, subGroup, instance },
}: {
  params: { group: string; subGroup: string; instance: string };
}) {
  const stage = await api.institution.instance.getStage.query({
    groupId: group,
    subGroupId: subGroup,
    instanceId: instance,
  });

  const tabs = tabsRecord[stage];

  return (
    <Tabs defaultValue="stage-control" className="grid w-full grid-cols-6">
      <div className="col-span-1 mt-28 flex justify-center border-r">
        <TabsList className="flex h-max w-fit flex-col gap-2 bg-transparent">
          <TabsTrigger
            value="stage-control"
            className="w-full rounded-md data-[state=active]:shadow-none"
            asChild
          >
            <Button variant="outline">Stage Control</Button>
          </TabsTrigger>
          <Separator className="my-1 w-3/4" />
          {tabs.map((tab, i) => (
            <TabsTrigger
              key={i}
              value={tab}
              className="w-full rounded-md data-[state=active]:shadow-none"
              asChild
            >
              <Button variant="outline">{tab}</Button>
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      <section className="col-span-5 max-w-6xl">
        <Heading title={instance} />
        <TabsContent value="stage-control">
          <StageControl
            stage={stage}
            groupId={group}
            subGroupId={subGroup}
            instanceId={instance}
          />
        </TabsContent>
        {stage === "PROJECT_ALLOCATION" && (
          <AlgorithmTabs
            tabValues={tabs}
            groupId={group}
            subGroupId={subGroup}
            instanceId={instance}
          />
        )}
      </section>
    </Tabs>
  );
}
