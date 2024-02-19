"use client";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card
            ref={setNodeRef}
            className="w-32 bg-secondary px-5 py-3 text-secondary-foreground"
            style={style}
            {...attributes}
            {...listeners}
          >
            <p className="max-w-[124px] overflow-hidden">{studentId}</p>
          </Card>
        </TooltipTrigger>
        <TooltipContent>
          <p>{studentId}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
