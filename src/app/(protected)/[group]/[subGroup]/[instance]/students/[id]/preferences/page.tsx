import { Stage } from "@prisma/client";

import { AccessControl } from "@/components/access-control";
import { Heading } from "@/components/heading";
import { PageWrapper } from "@/components/page-wrapper";
import { LatestSubmissionDataTable } from "@/components/pages/student-preferences/latest-submission-data-table";
import { SubmissionArea } from "@/components/pages/student-preferences/submission-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { api } from "@/lib/trpc/server";
import { PageParams } from "@/lib/validations/params";

import { CurrentBoardState } from "./_components/current-board-state";

export default async function Page({ params }: { params: PageParams }) {
  const studentId = params.id;
  const student = await api.user.student.getById({
    params,
    studentId: studentId,
  });

  const { initialColumns, initialProjects } =
    await api.user.student.preference.initialBoardState({
      params,
      studentId: studentId,
    });

  const latestSubmissionDateTime = await api.user.student.latestSubmission({
    params,
    studentId: studentId,
  });

  const restrictions = await api.user.student.preferenceRestrictions({
    params,
  });

  const availableProjects = await api.project.getAllForUser({
    params,
    userId: studentId,
  });

  return (
    <PageWrapper>
      <Heading className="flex items-baseline gap-6">
        <p>Preferences</p>
        <p className="text-3xl text-muted-foreground">for {student.name}</p>
      </Heading>
      <AccessControl allowedStages={[Stage.PROJECT_SELECTION]}>
        <section className="flex flex-col gap-3">
          <SubmissionArea
            title="Submit student preference list"
            studentId={studentId}
            initialProjects={initialProjects}
            latestSubmissionDateTime={latestSubmissionDateTime}
            restrictions={restrictions}
          />
        </section>
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
          <CurrentBoardState
            availableProjects={availableProjects}
            initialColumns={initialColumns}
            initialProjects={initialProjects}
          />
        </TabsContent>
        <TabsContent value="last-submission">
          <LatestSubmissionDataTable studentId={studentId} />
        </TabsContent>
      </Tabs>
    </PageWrapper>
  );
}
