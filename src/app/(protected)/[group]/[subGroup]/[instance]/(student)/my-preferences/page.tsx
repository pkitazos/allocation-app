import { Role, Stage } from "@prisma/client";

import { AccessControl } from "@/components/access-control";
import { Heading } from "@/components/heading";
import { PanelWrapper } from "@/components/panel-wrapper";
import { Unauthorised } from "@/components/unauthorised";

import { api } from "@/lib/trpc/server";
import { instanceTabs } from "@/lib/validations/instance-tabs";
import { InstanceParams } from "@/lib/validations/params";

import { KanbanBoard } from "./_components/kanban-board";
import { SubmissionArea } from "./_components/submission-area";

export default async function Page({ params }: { params: InstanceParams }) {
  const role = await api.user.role({ params });

  if (role !== Role.STUDENT) {
    return (
      <Unauthorised message="You need to be a Student to access this page" />
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
        <div className="flex w-full max-w-7xl flex-col">
          <KanbanBoard
            initialColumns={initialColumns}
            initialProjects={initialProjects}
          />
        </div>
      </PanelWrapper>
    </>
  );
}
