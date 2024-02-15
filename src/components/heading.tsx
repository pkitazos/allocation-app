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
