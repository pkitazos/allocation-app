import { Role, Stage } from "@prisma/client";

import { AccessControl } from "@/components/access-control";
import { Heading } from "@/components/heading";
import { PanelWrapper } from "@/components/panel-wrapper";
import { Unauthorised } from "@/components/unauthorised";

import { api } from "@/lib/trpc/server";
import { InstanceParams } from "@/lib/validations/params";

import { KanbanBoard } from "./_components/kanban-board";
import { SubmissionButton } from "./_components/submission-button";

export default async function Page({ params }: { params: InstanceParams }) {
  const role = await api.user.role({ params });

  if (role !== Role.STUDENT) {
    return (
      <Unauthorised message="You need to be a Student to access this page" />
    );
  }

  const { initialColumns, initialProjects } =
    await api.user.student.preference.initialBoardState({ params });

  const restrictions = await api.user.student.preferenceRestrictions({
    params,
  });

  return (
    <>
      <Heading>My Preferences</Heading>
      <PanelWrapper className="mt-10 h-full">
        <AccessControl allowedStages={[Stage.PROJECT_SELECTION]}>
          <SubmissionButton restrictions={restrictions} />
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
