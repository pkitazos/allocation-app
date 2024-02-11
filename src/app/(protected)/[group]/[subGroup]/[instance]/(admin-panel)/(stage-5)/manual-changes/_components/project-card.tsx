"use client";

import { useDroppable } from "@dnd-kit/core";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RowProject } from "@/lib/validations/allocation-adjustment";
import { allocationWithinBounds } from "../adjustment-row";
import { useAllocDetailsContext } from "../allocation-store";

export function ProjectCard({
  project,
  studentId,
}: {
  project: RowProject;
  studentId: string;
}) {
  const conflictingWith = useAllocDetailsContext((s) => s.conflictingWith);
  const { setNodeRef, isOver } = useDroppable({ id: project.id });
  const withinBounds = allocationWithinBounds(project);
  const isConflicting = conflictingWith.includes(studentId);
  return (
    <div className="flex  flex-col">
      <Card
        ref={setNodeRef}
        className={cn(
          "w-32 overflow-hidden p-3 text-center",
          project.selected && "bg-primary text-primary-foreground",
          !withinBounds && "bg-destructive text-destructive-foreground",
          project.selected && isConflicting && "bg-orange-500 text-white",
          isOver && "outline outline-[3px] outline-sky-500",
        )}
      >
        {project.id}
      </Card>
      <div className="w-32">
        <p>{project.selected.toString()}</p>
        <p>{project.capacityLowerBound}</p>
        <p>{project.capacityUpperBound}</p>
        {project.allocatedTo.map((item, i) => (
          <p key={i}>{item}</p>
        ))}
      </div>
    </div>
  );
}
