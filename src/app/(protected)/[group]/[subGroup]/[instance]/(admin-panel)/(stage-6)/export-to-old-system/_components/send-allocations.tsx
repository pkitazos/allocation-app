"use client";

import { ShareIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export function SendAllocationsSection({ data }: { data: Project[] }) {
  return (
    <div>
      <Button
        variant="secondary"
        className="flex cursor-pointer items-center gap-2"
      >
        <ShareIcon className="h-4 w-4" />
        <p>Send</p>
      </Button>
    </div>
  );
}
