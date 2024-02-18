import { Heading } from "@/components/heading";

import { api } from "@/lib/trpc/server";
import { InstanceParams } from "@/lib/validations/params";

import { KanbanBoard } from "./kanban-board";

export async function PreferenceSelection({
  params,
}: {
  params: InstanceParams;
}) {
  const { initialColumns, initialProjects } =
    await api.user.student.preference.initialBoardState.query({ params });

  return (
    <div className="flex w-full max-w-7xl flex-col">
      <Heading>Preference</Heading>
      <div className="my-2">&nbsp;</div>
      <KanbanBoard
        initialColumns={initialColumns}
        initialProjects={initialProjects}
      />
    </div>
  );
}
