"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

interface props extends React.HTMLAttributes<HTMLElement> {
  label: string;
}

export function LabelledSeparator({ label, className }: props) {
  return (
    <div className={cn("relative", className)}>
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t" />
      </div>
      <div className="relative flex justify-center text-xs">
        <span className="bg-background px-2 text-muted-foreground">
          {label}
        </span>
      </div>
    </div>
  );
}
