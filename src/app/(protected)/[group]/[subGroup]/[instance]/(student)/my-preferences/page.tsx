import { Role, Stage } from "@prisma/client";

import { AccessControl } from "@/components/access-control";
import { Heading } from "@/components/heading";
import { PanelWrapper } from "@/components/panel-wrapper";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Unauthorised } from "@/components/unauthorised";

import { api } from "@/lib/trpc/server";
import { InstanceParams } from "@/lib/validations/params";
import { instanceTabs } from "@/lib/validations/tabs/instance";

import { KanbanBoard } from "./_components/kanban-board";
import { SubmissionArea } from "./_components/submission-area";
import { LatestSubmissionDataTable } from "./latest-submission-data-table";

export default async function Page({ params }: { params: InstanceParams }) {
  const roles = await api.user.roles({ params });

  if (!roles.has(Role.STUDENT)) {
    return (
      <Unauthorised message="You need to be a Student to access this page" />
    );
  }

  const user = await api.user.get();
  const preAllocatedTitle = await api.user.student.isPreAllocated({ params });
  if (preAllocatedTitle !== null) {
    return (
      <Unauthorised message="You have a self-defined project and may not submit any other preferences" />
    );
  }

  const { initialColumns, initialProjects } =
    await api.user.student.preference.initialBoardState({ params });

  const latestSubmissionDateTime = await api.user.student.latestSubmission({
    params,
  });

  const restrictions = await api.user.student.preferenceRestrictions({
    params,
  });

  return (
    <>
      <Heading>{instanceTabs.myPreferences.title}</Heading>
      <PanelWrapper className="mt-10 h-full">
        <AccessControl allowedStages={[Stage.PROJECT_SELECTION]}>
          <SubmissionArea
            initialProjects={initialProjects}
            latestSubmissionDateTime={latestSubmissionDateTime}
            restrictions={restrictions}
          />
        </AccessControl>
        <Tabs defaultValue="current-board-state" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger
              className="w-full data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
              value="current-board-state"
            >
              Working Board
            </TabsTrigger>
            <TabsTrigger
              className="w-full data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
              value="last-submission"
            >
              Latest Submission
            </TabsTrigger>
          </TabsList>
          <Separator className="my-4" />
          <TabsContent value="current-board-state">
            <div className="flex w-full max-w-7xl flex-col">
              <KanbanBoard
                initialColumns={initialColumns}
                initialProjects={initialProjects}
              />
            </div>
          </TabsContent>
          <TabsContent value="last-submission">
            <LatestSubmissionDataTable studentId={user.id} />
          </TabsContent>
        </Tabs>
      </PanelWrapper>
    </>
  );
}
