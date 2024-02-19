"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { PreferenceType, Stage } from "@prisma/client";

import { useInstanceStage } from "@/components/params-context";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

import { stageCheck } from "@/lib/utils/permissions/stage-check";
import { ProjectPreference } from "@/lib/validations/board";

export function ProjectPreferenceCard({
  project,
  idx,
}: {
  project: ProjectPreference;
  idx?: number;
}) {
  const stage = useInstanceStage();

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
    disabled: stageCheck(stage, Stage.PROJECT_ALLOCATION),
  });

  const style = { transition, transform: CSS.Transform.toString(transform) };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="h-24 rounded-md bg-slate-300 opacity-50"
      />
    );
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="rounded-md bg-accent p-4 shadow-sm "
    >
      <CardHeader>
        <div className="flex flex-row items-center gap-3">
          {project.columnId === PreferenceType.PREFERENCE && (
            <p className="text-xl font-bold text-sky-600">{idx}</p>
          )}
          <CardTitle className="text-xl">{project.title}</CardTitle>
        </div>
      </CardHeader>
      {/* // TODO: hook up appropriate procedure */}
      {/* <div className="flex justify-end">
        <Link href={`/projects/${project.id}`}>
          <Button variant="link">view</Button>
        </Link>
        <Button
          size="icon"
          variant="ghost"
          className="hover:bg-destructive hover:text-destructive-foreground"
        >
          <X className="h-4 w-4 font-bold" />
        </Button>
      </div> */}
    </Card>
  );
}
