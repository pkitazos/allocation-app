"use client";

import { useDroppable } from "@dnd-kit/core";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { withinBounds } from "@/lib/utils/allocation-within-bounds";
import { useAllocDetails } from "./allocation-store";
import { getProjectInfo } from "../_utils/get-project";

export function ProjectCard({
  project: { id: projectId, selected: originallySelected },
  studentId,
}: {
  project: { id: string; selected: boolean };
  studentId: string;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: projectId });

  const allProjects = useAllocDetails((s) => s.projects);
  const projectInfo = getProjectInfo(allProjects, projectId);

  if (!projectInfo.allocatedTo) {
    console.log("blows up here ------>>", { projectInfo });
  }

  const currentlySelected = projectInfo.allocatedTo.includes(studentId);
  const invalid = currentlySelected && !withinBounds(projectInfo);

  return (
    <div className="flex  flex-col">
      <Card
        ref={setNodeRef}
        className={cn(
          "w-32 overflow-hidden p-3 text-center",
          originallySelected && "bg-primary/50 text-primary-foreground",
          currentlySelected && "bg-primary text-primary-foreground",
          invalid && "bg-destructive text-destructive-foreground",
          isOver && "outline outline-[3px] outline-sky-500",
        )}
      >
        {projectInfo.id}
      </Card>
      <div className="w-32">
        <p>{projectInfo.capacityLowerBound}</p>
        <p>{projectInfo.capacityUpperBound}</p>
        {projectInfo.allocatedTo.map((item, i) => (
          <p key={i} className={cn(item === studentId && "font-bold")}>
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}
