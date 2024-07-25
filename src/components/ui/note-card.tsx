import { ReactNode } from "react";
import { ClassValue } from "clsx";

import { cn } from "@/lib/utils";

import { Card, CardContent, CardHeader } from "./card";

export function NoteCard({
  className,
  children: note,
}: {
  className?: ClassValue;
  children: ReactNode;
}) {
  return (
    <Card
      className={cn(
        "border-l-[3px] border-y-transparent border-l-sky-400 border-r-transparent bg-sky-100/50",
        className,
      )}
    >
      <CardHeader className="px-3 pb-1 pt-4 text-base font-semibold text-secondary">
        Please note:
      </CardHeader>
      <CardContent className="px-3 pb-4">{note}</CardContent>
    </Card>
  );
}
