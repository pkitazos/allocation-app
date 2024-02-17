import { ClassValue } from "clsx";
import { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function PanelWrapper({
  className,
  children,
}: {
  className?: ClassValue;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "mt-16 flex h-max w-full flex-col gap-4 px-8 pb-20",
        className,
      )}
    >
      {children}
    </div>
  );
}
