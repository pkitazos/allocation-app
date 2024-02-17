import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";
import { ReactNode } from "react";

export function Heading({ children: title }: { children: ReactNode }) {
  return (
    <div className="flex rounded-md bg-accent px-6 py-5 dark:bg-accent-foreground">
      <h1 className="text-5xl text-accent-foreground dark:text-accent">
        {title}
      </h1>
    </div>
  );
}

export function SubHeading({
  children: text,
  className,
}: {
  className?: ClassValue;
  children: ReactNode;
}) {
  return (
    <h2
      className={cn(
        "text-3xl font-medium leading-none tracking-tight underline decoration-secondary underline-offset-4",
        className,
      )}
    >
      {text}
    </h2>
  );
}
