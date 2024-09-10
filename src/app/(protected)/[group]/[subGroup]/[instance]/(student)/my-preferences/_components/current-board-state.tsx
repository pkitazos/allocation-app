"use client";
import { BoardDetailsProvider } from "@/components/kanban-board/store";

import { BoardColumn, ProjectPreference } from "@/lib/validations/board";

import { KanbanBoardSection } from "./kanban-board-section";

// TODO: move context provider to the parent component

export function CurrentBoardState({
  initialColumns,
  initialProjects,
}: {
  initialColumns: BoardColumn[];
  initialProjects: ProjectPreference[];
}) {
  return (
    <BoardDetailsProvider projects={initialProjects} columns={initialColumns}>
      <KanbanBoardSection />
    </BoardDetailsProvider>
  );
}
