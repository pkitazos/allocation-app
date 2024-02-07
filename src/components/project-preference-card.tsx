"use client";

import { ProjectPreference } from "@/lib/validations/board";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { PreferenceType } from "@prisma/client";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import Link from "next/link";

export function ProjectPreferenceCard({
  project,
  idx,
}: {
  project: ProjectPreference;
  idx?: number;
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
      className="rounded-md bg-slate-300 p-4 shadow-sm"
    >
      <div className="flex items-center gap-4 ">
        {project.columnId === PreferenceType.PREFERENCE && (
          <p className="font-bold text-sky-600">{idx}</p>
        )}
        <p>{project.title}</p>
      </div>
      <div className="flex justify-end">
        <Link href={`/projects/${project.id}`}>
          <Button variant="link">view</Button>
        </Link>
        {/* // TODO: hook up appropriate procedure */}
        <Button
          size="icon"
          variant="ghost"
          className="hover:bg-destructive hover:text-destructive-foreground"
        >
          <X className="h-4 w-4 font-bold" />
        </Button>
      </div>
    </div>
  );
}
