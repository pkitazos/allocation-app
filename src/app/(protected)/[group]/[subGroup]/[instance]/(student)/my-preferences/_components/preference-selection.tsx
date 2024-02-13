import { Heading } from "@/components/heading";
import { KanbanBoard } from "@/components/kanban-board";
import { api } from "@/lib/trpc/server";
import { instanceParams } from "@/lib/validations/params";

export async function PreferenceSelection({
  params,
}: {
  params: instanceParams;
}) {
  const { initialColumns, initialProjects } =
    await api.user.student.preference.initialBoardState.query({ params });

  return (
    <div className="flex w-2/3 max-w-7xl flex-col">
      <Heading title="Preference Lists" />
      <div className="my-2">&nbsp;</div>
      <KanbanBoard
        initialColumns={initialColumns}
        initialProjects={initialProjects}
      />
    </div>
  );
}
