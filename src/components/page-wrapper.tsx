import { ClassValue } from "clsx";
import { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function PageWrapper({
  className,
  children,
}: {
  className?: ClassValue;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "mt-6 flex h-max w-full max-w-5xl flex-col gap-10 px-6 pb-20",
        className,
      )}
    >
      {children}
    </div>
  );
}
