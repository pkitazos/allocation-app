import { ReactNode } from "react";
import { ClassValue } from "clsx";
import { InfoIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export function MoreInformation({
  className,
  children,
}: {
  className?: ClassValue;
  children: ReactNode;
}) {
  return (
    <Popover>
      <PopoverTrigger>
        <InfoIcon className="h-4 w-4 stroke-slate-400" />
      </PopoverTrigger>
      <PopoverContent side="right" align="center" className={cn(className)}>
        {children}
      </PopoverContent>
    </Popover>
  );
}
