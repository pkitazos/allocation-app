"use client";
import { Button } from "@/components/ui/button";
import { useAllocDetails } from "../allocation-store";
import { X } from "lucide-react";

export function RowRemovalButton({ rowIdx }: { rowIdx: number }) {
  const allOriginalRows = useAllocDetails((s) => s.allOriginalRows);
  const allWorkingRows = useAllocDetails((s) => s.allWorkingRows);
  const visibleRows = useAllocDetails((s) => s.visibleRows);

  const updateWorkingRows = useAllocDetails((s) => s.updateWorkingRows);
  const updateVisibleRows = useAllocDetails((s) => s.updateVisibleRows);

  const rowConflicts = useAllocDetails((s) => s.rowConflicts);
  const updateRowConflicts = useAllocDetails((s) => s.updateRowConflicts);

  // TODO: make sure validity check runs after row removal
  function handleRowRemoval(idx: number) {
    const updatedWorkingRows = allWorkingRows.map((row, i) => {
      return i === idx ? allOriginalRows[idx] : row;
    });

    updateWorkingRows(updatedWorkingRows);
    updateVisibleRows(visibleRows.toSpliced(idx, 1));

    updateRowConflicts(rowConflicts.toSpliced(idx, 1));
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
