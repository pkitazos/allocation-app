import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/trpc/server";
import { ByProjectDataTable } from "./by-project-data-table";
import { ByStudentDataTable } from "./by-student-data-table";
import { BySupervisorDataTable } from "./by-supervisor-data-table";

export default async function Page({
  params: { group: groupId, subGroup: subGroupId, instance: instanceId },
}: {
  params: { group: string; subGroup: string; instance: string };
}) {
  const { byStudent, byProject, bySupervisor } =
    await api.institution.instance.getProjectAllocations.query({
      groupId,
      subGroupId,
      instanceId,
    });

  return (
    <div className="mt-20 flex w-full flex-col items-center">
      <div className="flex w-5/6 flex-col gap-3">
        <h2 className="mb-6 text-2xl font-semibold">Final Allocation</h2>
        <Tabs defaultValue="student" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger
              className="w-full data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
              value="student"
            >
              By Student
            </TabsTrigger>
            <TabsTrigger
              className="w-full data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
              value="project"
            >
              By Project
            </TabsTrigger>
            <TabsTrigger
              className="w-full data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
              value="supervisor"
            >
              By Supervisor
            </TabsTrigger>
          </TabsList>
          <Separator className="my-4" />
          <TabsContent value="student">
            <ByStudentDataTable data={byStudent} />
          </TabsContent>
          <TabsContent value="project">
            <ByProjectDataTable data={byProject} />
          </TabsContent>
          <TabsContent value="supervisor">
            <BySupervisorDataTable data={bySupervisor} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
