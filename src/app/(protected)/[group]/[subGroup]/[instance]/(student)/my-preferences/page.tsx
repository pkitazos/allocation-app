import { Role, Stage } from "@prisma/client";

import { Heading } from "@/components/heading";
import { PanelWrapper } from "@/components/panel-wrapper";
import { Unauthorised } from "@/components/unauthorised";

import { api } from "@/lib/trpc/server";
import { stageCheck } from "@/lib/utils/permissions/stage-check";
import { InstanceParams } from "@/lib/validations/params";

import { KanbanBoard } from "./_components/kanban-board";
import { SubmissionButton } from "./_components/submission-button";

export default async function Page({ params }: { params: InstanceParams }) {
  const role = await api.user.role.query({ params });

  if (role !== Role.STUDENT) {
    return (
      <Unauthorised message="You need to be a Student to access this page" />
    );
  }
  const stage = await api.institution.instance.currentStage.query({ params });

  const { initialColumns, initialProjects } =
    await api.user.student.preference.initialBoardState.query({ params });

  const restrictions = await api.user.student.preferenceRestrictions.query({
    params,
  });

  return (
    <>
      <Heading>My Preferences</Heading>
      <PanelWrapper className="mt-10 h-full">
        {!stageCheck(stage, Stage.PROJECT_ALLOCATION) && (
          <SubmissionButton restrictions={restrictions} />
        )}
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
