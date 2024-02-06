"use client";

import { ProjectPreference } from "@/lib/validations/board";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function ProjectPreferenceCard({
  project,
}: {
  project: ProjectPreference;
}) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: project.id,
    data: {
      type: "ProjectPreference",
      project,
    },
  });

  const style = { transition, transform: CSS.Transform.toString(transform) };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="h-14 rounded-md bg-slate-300 opacity-50"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="rounded-md bg-slate-300 p-4"
    >
      {project.title}
    </div>
  );
}
