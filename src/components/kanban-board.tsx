"use client";
import {
  DndContext,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useState } from "react";
import { createPortal } from "react-dom";
import { ColumnContainer } from "./column-container";
import { ProjectPreferenceCard } from "./project-preference-card";
import { BoardColumn, ProjectPreference } from "@/lib/validations/board";

export function KanbanBoard({
  initialColumns,
  initialProjects,
}: {
  initialColumns: BoardColumn[];
  initialProjects: ProjectPreference[];
}) {
  const columns = initialColumns;

  const [projects, setProjects] =
    useState<ProjectPreference[]>(initialProjects);

  const [activeProject, setActiveProject] = useState<ProjectPreference | null>(
    null,
  );

  function onDragStart({ active }: DragStartEvent) {
    if (active.data.current?.type === "ProjectPreference") {
      setActiveProject(active.data.current.project);
    }
  }

  function onDragOver({ active, over }: DragOverEvent) {
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

        // ? if statement perhaps unnecessary
        if (projects[activeIdx].columnId !== projects[overIdx].columnId) {
          // TODO: perform type-changing mutation
          projects[activeIdx].columnId = projects[overIdx].columnId;
        }
        // TODO: perform re-ordering mutation
        return arrayMove(projects, activeIdx, overIdx);
      });
    }

    const isOverColumn = over.data.current?.type === "Column";

    // dropping a task over a column
    if (isActiveProject && isOverColumn) {
      setProjects((projects) => {
        const activeIdx = projects.findIndex((e) => e.id === active.id);

        // ? if statement perhaps unnecessary
        if (projects[activeIdx].columnId !== over.id) {
          projects[activeIdx].columnId = over.id;
        }

        // TODO: perform type-changing mutation
        return arrayMove(projects, activeIdx, activeIdx);
      });
    }
  }

  return (
    <DndContext onDragStart={onDragStart} onDragOver={onDragOver}>
      <div className="flex h-full w-full gap-5">
        {columns.map((column) => (
          <ColumnContainer
            key={column.id}
            column={column}
            projects={projects.filter((e) => e.columnId === column.id)}
          />
        ))}
        {createPortal(
          <DragOverlay>
            {activeProject && <ProjectPreferenceCard project={activeProject} />}
          </DragOverlay>,
          document.body,
        )}
      </div>
    </DndContext>
  );
}
