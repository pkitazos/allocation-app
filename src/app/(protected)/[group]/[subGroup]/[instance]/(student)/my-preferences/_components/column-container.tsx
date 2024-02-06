"use client";
import { useDroppable } from "@dnd-kit/core";

import { useMemo } from "react";
import { SortableContext } from "@dnd-kit/sortable";
import { ProjectPreferenceCard } from "./project-preference-card";
import { BoardColumn, ProjectPreference } from "@/lib/validations/board";

export function ColumnContainer({
  column,
  projects,
}: {
  column: BoardColumn;
  projects: ProjectPreference[];
}) {
  const { setNodeRef } = useDroppable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });

  const projectIds = useMemo(() => projects.map((e) => e.id), [projects]);

  return (
    <div
      ref={setNodeRef}
      className="flex h-full w-full flex-col gap-2 bg-accent px-2 pt-4"
    >
      <p>{column.displayName}</p>
      <SortableContext items={projectIds}>
        {projects.map((e) => (
          <ProjectPreferenceCard key={e.id} project={e} />
        ))}
      </SortableContext>
    </div>
  );
}
