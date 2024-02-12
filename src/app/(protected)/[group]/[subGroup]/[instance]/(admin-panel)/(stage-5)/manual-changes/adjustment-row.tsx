"use client";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { createPortal } from "react-dom";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { StudentRow } from "./allocation-adjustment";

type Project = { id: string; selected: boolean };

export function AdjustmentRow({
  studentRow: { student, projectPreferences },
}: {
  studentRow: StudentRow;
}) {
  const [dragging, setDragging] = useState(false);
  const [projects, updateProjects] = useState<Project[]>(projectPreferences);

  function onDragEnd({ over }: DragEndEvent) {
    if (!over) return;

    updateProjects((projects) => {
      const selectedIdx = projects.findIndex((e) => e.selected);
      const overIdx = projects.findIndex((e) => e.id === over.id);

      projects[selectedIdx].selected = false;
      projects[overIdx].selected = true;

      return projects;
    });

    setDragging(false);
  }

  return (
    <DndContext onDragStart={() => setDragging(true)} onDragEnd={onDragEnd}>
      <div className="flex items-center gap-3">
        <div className="border-r pr-3">
          <StudentCard studentId={student.id} />
        </div>
        {projects.map((p, i) => (
          <ProjectCard key={i} project={p}></ProjectCard>
        ))}
      </div>
      {createPortal(
        <DragOverlay>
          {dragging && <StudentCard studentId={student.id} />}
        </DragOverlay>,
        document.body,
      )}
    </DndContext>
  );
}

export function StudentCard({ studentId }: { studentId: string }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: studentId,
    });

  const style = { transform: CSS.Transform.toString(transform) };

  if (isDragging) {
    return (
      <Card
        ref={setNodeRef}
        className="w-32 bg-secondary/50 px-5 py-3 text-secondary-foreground"
      >
        <p className="max-w-[124px] overflow-hidden">{studentId}</p>
      </Card>
    );
  }

  return (
    <Card
      ref={setNodeRef}
      className="w-32 bg-secondary px-5 py-3 text-secondary-foreground"
      style={style}
      {...attributes}
      {...listeners}
    >
      <p className="max-w-[124px] overflow-hidden">{studentId}</p>
    </Card>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  const { setNodeRef, isOver } = useDroppable({ id: project.id });

  return (
    <Card
      ref={setNodeRef}
      className={cn(
        "w-32 overflow-hidden p-3 text-center",
        project.selected && "bg-primary text-primary-foreground",
        isOver && "outline outline-[3px] outline-sky-500",
      )}
    >
      {project.id}
    </Card>
  );
}
