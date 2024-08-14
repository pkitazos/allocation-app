"use client";
import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { PreferenceType } from "@prisma/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

import { useInstanceParams } from "@/components/params-context";

import { api } from "@/lib/trpc/client";
import { getUpdatedRank } from "@/lib/utils/sorting/get-updated-rank";
import { BoardColumn, ProjectPreference } from "@/lib/validations/board";

import { ColumnContainer } from "./column-container";
import { ProjectPreferenceCard } from "./project-preference-card";

export function KanbanBoard({
  initialColumns,
  initialProjects,
}: {
  initialColumns: BoardColumn[];
  initialProjects: ProjectPreference[];
}) {
  const params = useInstanceParams();
  const router = useRouter();

  const columns = useMemo(() => initialColumns, [initialColumns]);
  const [projects, setProjects] = useState(initialProjects);
  const [activeProject, setActiveProject] = useState<ProjectPreference | null>(
    null,
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px
      },
    }),
  );

  const utils = api.useUtils();

  const refetch = () =>
    utils.user.student.preference.initialBoardState.refetch();

  const { mutateAsync: reorderAsync } =
    api.user.student.preference.reorder.useMutation();

  const { mutateAsync: updatePreferenceAsync } =
    api.user.student.preference.update.useMutation();

  async function reorderPreference(
    projectId: string,
    updatedRank: number,
    preferenceType: PreferenceType,
  ) {
    void toast.promise(
      reorderAsync({ params, projectId, updatedRank, preferenceType }).then(
        () => {
          router.refresh();
          refetch();
        },
      ),
      {
        loading: "Reordering...",
        error: "Something went wrong",
        success: "Successfully reordered preferences",
      },
    );
  }

  async function deletePreference(projectId: string) {
    void toast.promise(
      updatePreferenceAsync({ params, projectId, preferenceType: "None" }).then(
        () => {
          router.refresh();
          refetch();
          setProjects((prev) => prev.filter((e) => e.id !== projectId));
        },
      ),
      {
        loading: `Removing project from preferences...`,
        error: "Something went wrong",
        success: `Successfully removed project from preferences`,
      },
    );
  }

  function onDragStart({ active }: DragStartEvent) {
    if (active.data.current?.type === "ProjectPreference") {
      setActiveProject(active.data.current.project);
    }
  }

  function onDragEnd({ active, over }: DragEndEvent) {
    if (!over) return;

    if (active.id === over.id) return;

    const isActiveProject = active.data.current?.type === "ProjectPreference";
    const isOverProject = over.data.current?.type === "ProjectPreference";

    if (!isActiveProject) return;

    // dropping a task over a task
    if (isActiveProject && isOverProject) {
      setProjects((projects) => {
        const activeIdx = projects.findIndex((e) => e.id === active.id);
        const overIdx = projects.findIndex((e) => e.id === over.id);

        if (projects[activeIdx].columnId !== projects[overIdx].columnId) {
          projects[activeIdx].columnId = projects[overIdx].columnId;
        }
        // perform re-ordering mutation
        const newArray = arrayMove(projects, activeIdx, overIdx);
        const updatedRank = getUpdatedRank(newArray, overIdx);

        const projectId = z.string().parse(projects[activeIdx].id);
        const newType = z
          .nativeEnum(PreferenceType)
          .parse(projects[overIdx].columnId);

        void reorderPreference(projectId, updatedRank, newType);

        return newArray;
      });
    }

    const isOverColumn = over.data.current?.type === "Column";

    // dropping a task over a column
    if (isActiveProject && isOverColumn) {
      setProjects((projects) => {
        const activeIdx = projects.findIndex((e) => e.id === active.id);

        if (projects[activeIdx].columnId !== over.id) {
          projects[activeIdx].columnId = over.id;
        }

        // perform re-ordering mutation
        const newArray = arrayMove(projects, activeIdx, activeIdx);

        const projectId = z.string().parse(projects[activeIdx].id);
        const newType = z.nativeEnum(PreferenceType).parse(over.id);

        void reorderPreference(projectId, 1, newType);

        return newArray;
      });
    }
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="flex h-full w-full gap-5">
        {columns.map((column) => (
          <ColumnContainer
            key={column.id}
            column={column}
            projects={projects.filter((e) => e.columnId === column.id)}
            deletePreference={deletePreference}
          />
        ))}
        {createPortal(
          <DragOverlay>
            {activeProject && (
              <ProjectPreferenceCard
                project={activeProject}
                deletePreference={deletePreference}
              />
            )}
          </DragOverlay>,
          document.body,
        )}
      </div>
    </DndContext>
  );
}
