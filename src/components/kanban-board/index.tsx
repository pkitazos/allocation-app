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
import { z } from "zod";

import { getUpdatedRank } from "@/lib/utils/sorting/get-updated-rank";
import { ProjectPreference } from "@/lib/validations/board";

import { ColumnContainer } from "./column-container";
import { ProjectPreferenceCard } from "./project-preference-card";
import { StateSetter, useBoardDetails } from "./store";

type ReorderFunction = (
  projectId: string,
  updatedRank: number,
  preferenceType: PreferenceType,
) => Promise<void>;

type DeleteFunction = (
  projectId: string,
  updateProjects: StateSetter<ProjectPreference[]>,
) => Promise<void>;

export function KanbanBoard({
  reorderPreference,
  deletePreference,
}: {
  reorderPreference: ReorderFunction;
  deletePreference: DeleteFunction;
}) {
  const initialColumns = useBoardDetails((s) => s.columns);
  const columns = useMemo(() => initialColumns, [initialColumns]);

  const projects = useBoardDetails((s) => s.projects);
  const setProjects = useBoardDetails((s) => s.updateProjects);
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
            deletePreference={(p) => deletePreference(p, setProjects)}
          />
        ))}
        {createPortal(
          <DragOverlay>
            {activeProject && (
              <ProjectPreferenceCard
                project={activeProject}
                deletePreference={(p) => deletePreference(p, setProjects)}
              />
            )}
          </DragOverlay>,
          document.body,
        )}
      </div>
    </DndContext>
  );
}
