"use client";

import { useDroppable } from "@dnd-kit/core";

import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { cn } from "@/lib/utils";
import { getProjectInfo } from "@/lib/utils/allocation-adjustment";
import { withinBounds } from "@/lib/utils/allocation-adjustment/project";
import {
  getProjectSupervisor,
  withinCapacity,
} from "@/lib/utils/allocation-adjustment/supervisor";

import { useAllocDetails } from "./allocation-store";
import { ProjectCardTooltip } from "./project-card-tooltip";

export function ProjectCard({
  project: { id: projectId, selected: originallySelected },
  studentId,
}: {
  project: { id: string; selected: boolean };
  studentId: string;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: projectId });

  const allSupervisors = useAllocDetails((s) => s.supervisors);
  const allProjects = useAllocDetails((s) => s.projects);
  const projectInfo = getProjectInfo(allProjects, projectId);

  const currentlySelected = projectInfo.allocatedTo.includes(studentId);
  const invalid = currentlySelected && !withinBounds(projectInfo);

  const supervisor = getProjectSupervisor(projectInfo, allSupervisors);
  const overworked = !withinCapacity(allProjects, supervisor);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card
            ref={setNodeRef}
            className={cn(
              "flex min-h-20 min-w-32 items-center justify-center overflow-hidden p-3 text-center",
              originallySelected && "bg-primary/50 text-primary-foreground",
              currentlySelected && "bg-primary text-primary-foreground",
              invalid && "bg-destructive text-destructive-foreground",
              isOver && "outline outline-[3px] outline-sky-500",
              currentlySelected && overworked && "bg-orange-500",
            )}
          >
            <p>{projectInfo.id}</p>
          </Card>
        </TooltipTrigger>
        <TooltipContent>
          <ProjectCardTooltip projectInfo={projectInfo} />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
