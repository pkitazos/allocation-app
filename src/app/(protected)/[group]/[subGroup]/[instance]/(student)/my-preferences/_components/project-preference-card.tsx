"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { PreferenceType, Stage } from "@prisma/client";
import { X } from "lucide-react";

import { AccessControl } from "@/components/access-control";
import { useInstanceStage } from "@/components/params-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { cn } from "@/lib/utils";
import { previousStages, stageGte } from "@/lib/utils/permissions/stage-check";
import { ProjectPreference } from "@/lib/validations/board";

export function ProjectPreferenceCard({
  project,
  idx,
  deletePreference,
}: {
  project: ProjectPreference;
  idx?: number;
  deletePreference: (id: string) => Promise<void>;
}) {
  const stage = useInstanceStage();

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({
    id: project.id,
    data: {
      type: "ProjectPreference",
      project,
    },
    disabled: stageGte(stage, Stage.PROJECT_ALLOCATION),
  });

  const style = { transition, transform: CSS.Transform.toString(transform) };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={cn("h-44 rounded-md bg-muted-foreground/20")}
      />
    );
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "group relative rounded-md bg-accent p-4 shadow-sm",
        isOver && "outline outline-4 outline-muted-foreground/50",
      )}
    >
      <CardHeader>
        <div className="flex flex-row items-center gap-3">
          {project.columnId === PreferenceType.PREFERENCE && (
            <p className="text-xl font-bold text-sky-600">{idx}</p>
          )}
          <CardTitle className="text-xl">{project.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div>
          <p className="text-muted-foreground">Supervisor</p>
          <p className="font-semibold">{project.supervisorName}</p>
        </div>
      </CardContent>
      <AccessControl allowedStages={previousStages(Stage.PROJECT_SELECTION)}>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 hidden -translate-y-1/2 items-center justify-center hover:bg-destructive hover:text-destructive-foreground group-hover:flex"
          onClick={() => deletePreference(project.id as string)}
        >
          <X className="h-4 w-4 font-bold" />
        </Button>
      </AccessControl>
    </Card>
  );
}
