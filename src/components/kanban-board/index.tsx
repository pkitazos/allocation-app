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
  const columns = useBoardDetails((s) => s.columns);
  // const columns = useMemo(() => initialColumns, [initialColumns]);

  const projects = useBoardDetails((s) => s.projects);
  const updateBoardProjects = useBoardDetails((s) => s.updateProjects);
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

  /**
   * @description
   * this function is called when the drag event ends
   * it checks if the dragged item is dropped over another item or column
   * if it is dropped over another item, it will reorder the items
   * if it is dropped over a column, it will move the item to that column at the bottom
   */
  function onDragEnd({ active, over }: DragEndEvent) {
    // if there is no over, it means the item is not dropped over anything
    // so we can just return
    if (!over) return;

    // if the active item is the same as the over item, it means the item is dropped
    // over itself, so we can just return
    if (active.id === over.id) return;

    // check if the active item and over item are tasks (ProjectPreference) or columns
    const isActiveProject = active.data.current?.type === "ProjectPreference";
    const isOverProject = over.data.current?.type === "ProjectPreference";

    // if the active item is not a task, we can just return
    if (!isActiveProject) return;

    // if the active item is a task and the over item is a task, then we are dropping
    // the task over another task
    if (isActiveProject && isOverProject) {
      updateBoardProjects((projects) => {
        // find the index of the active and over items in the projects array
        // this is using the previous state of the projects array
        const activeIdx = projects.findIndex((e) => e.id === active.id);
        const overIdx = projects.findIndex((e) => e.id === over.id);

        // ? can probably omit the check here
        // if the active item and over item are not in the same column
        // we need to update the columnId of the active item to the columnId of the over item
        // this is because we are moving the active item to the column of the over item
        // they may be in different columns or they may be in the same column
        // if they are in the same column, we don't need to update the columnId (but we can, so perhaps the check is not needed)

        projects[activeIdx].columnId = projects[overIdx].columnId;

        // ? maybe it reads better if we move this to the end of the callback, right before the return
        // this will update the position of the active item to be the position of the over item
        // it will essentially appear before the over item
        const newArray = arrayMove(projects, activeIdx, overIdx);

        // while the new array has the items in the correct order, the rank of the items
        // is not updated, so we need to compute the new rank of the active item

        // this function will compute the new rank of the active item as
        // the midpoint between the ranks of the items before and after it
        const updatedRank = getUpdatedRank(newArray, overIdx);

        // parse the custom Id types into usable types
        const projectId = z.string().parse(projects[activeIdx].id);
        const newType = z
          .nativeEnum(PreferenceType)
          .parse(projects[overIdx].columnId);

        // perform the re-ordering mutation
        // it just updates the rank of the active item to the new computed rank
        void reorderPreference(projectId, updatedRank, newType);

        return newArray;
      });
    }

    // if the over item is not a task, then it is a column

    // probably not needed, but doesn't hurt to check
    const isOverColumn = over.data.current?.type === "Column";

    // if the active item is a task and the over item is a column
    // we need to move the active item to the column of the over item to the bottom
    if (isActiveProject && isOverColumn) {
      updateBoardProjects((projects) => {
        // find the index of the active item in the projects
        const activeIdx = projects.findIndex((e) => e.id === active.id);

        // ? can probably omit the check here
        // if the active item is not in the same column as the over item
        // we need to update the columnId of the active item to the columnId of the over item
        if (projects[activeIdx].columnId !== over.id) {
          projects[activeIdx].columnId = over.id;
        }

        // ? maybe it reads better if we move this to the end of the callback, right before the return
        // this will update the position of the active item to be the position of the over item
        // it will essentially appear before the over item
        const newArray = arrayMove(projects, activeIdx, activeIdx);

        // parse the custom Id types into usable types
        const projectId = z.string().parse(projects[activeIdx].id);
        const newType = z.nativeEnum(PreferenceType).parse(over.id);

        const lastRank = 1; // TODO: actually compute this

        // perform the re-ordering mutation
        // it just updates the rank of the active item to the new computed rank
        void reorderPreference(projectId, lastRank, newType);

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
            deletePreference={(p) => deletePreference(p, updateBoardProjects)}
          />
        ))}
        {createPortal(
          <DragOverlay>
            {activeProject && (
              <ProjectPreferenceCard
                project={activeProject}
                deletePreference={(p) =>
                  deletePreference(p, updateBoardProjects)
                }
              />
            )}
          </DragOverlay>,
          document.body,
        )}
      </div>
    </DndContext>
  );
}
