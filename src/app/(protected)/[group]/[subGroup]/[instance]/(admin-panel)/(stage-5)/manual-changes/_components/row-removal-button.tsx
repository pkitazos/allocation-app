"use client";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAllocDetails } from "./allocation-store";

export function RowRemovalButton({ rowIdx }: { rowIdx: number }) {
  const selectedStudentIds = useAllocDetails((s) => s.selectedStudentIds);
  const setSelectedStudentIds = useAllocDetails((s) => s.setSelectedStudentIds);

  // TODO: discard changes when row is removed
  function handleRowRemoval(idx: number) {
    setSelectedStudentIds(selectedStudentIds.toSpliced(idx, 1));
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-12 w-12"
      onClick={() => handleRowRemoval(rowIdx)}
    >
      <X className="h-5 w-5" />
    </Button>
  );
}
