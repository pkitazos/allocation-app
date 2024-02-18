"use client";
import { useMemo } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";

import { BoardColumn, ProjectPreference } from "@/lib/validations/board";

import { ProjectPreferenceCard } from "./project-preference-card";

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
      className="flex h-full w-full flex-col gap-2 rounded-md bg-accent px-3.5 shadow-sm"
    >
      <p className="mx-3 mb-3 mt-5 text-2xl font-medium underline decoration-secondary underline-offset-4">
        {column.displayName}
      </p>
      <SortableContext items={projectIds}>
        {projects.map((e, i) => (
          <ProjectPreferenceCard key={e.id} project={e} idx={i + 1} />
        ))}
      </SortableContext>
    </div>
  );
}
