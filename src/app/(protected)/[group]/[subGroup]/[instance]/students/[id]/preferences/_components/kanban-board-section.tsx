"use client";

import { PreferenceType } from "@prisma/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { KanbanBoard } from "@/components/kanban-board";
import { StateSetter } from "@/components/kanban-board/store";
import { useInstanceParams } from "@/components/params-context";

import { api } from "@/lib/trpc/client";
import { ProjectPreference } from "@/lib/validations/board";

export function KanbanBoardSection({ studentId }: { studentId: string }) {
  const params = useInstanceParams();
  const router = useRouter();

  const utils = api.useUtils();

  const refetch = () =>
    utils.user.student.preference.initialBoardState.refetch();

  const { mutateAsync: reorderAsync } =
    api.user.student.preference.makeReorder.useMutation();

  const { mutateAsync: updatePreferenceAsync } =
    api.user.student.preference.makeUpdate.useMutation();

  async function reorderPreference(
    projectId: string,
    updatedRank: number,
    preferenceType: PreferenceType,
  ) {
    void toast.promise(
      reorderAsync({
        params,
        studentId,
        projectId,
        updatedRank,
        preferenceType,
      }).then(() => {
        router.refresh();
        refetch();
      }),
      {
        loading: "Reordering...",
        error: "Something went wrong",
        success: "Successfully reordered preferences",
      },
    );
  }

  async function deletePreference(
    projectId: string,
    updateProjects: StateSetter<ProjectPreference[]>,
  ) {
    void toast.promise(
      updatePreferenceAsync({
        params,
        studentId,
        projectId,
        preferenceType: "None",
      }).then(() => {
        router.refresh();
        refetch();
        updateProjects((prev) => prev.filter((e) => e.id !== projectId));
      }),
      {
        loading: `Removing project from preferences...`,
        error: "Something went wrong",
        success: `Successfully removed project from preferences`,
      },
    );
  }

  return (
    <KanbanBoard
      reorderPreference={reorderPreference}
      deletePreference={deletePreference}
    />
  );
}
