"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function StageControl() {
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const [confirmedIdx, setConfirmedIdx] = useState(1);

  const handleSelection = (idx: number) => {
    if (idx === selectedIdx) setSelectedIdx(-1);
    else setSelectedIdx(idx);
  };

  const handleConfirmation = (idx: number) => {
    setSelectedIdx(-1);
    setConfirmedIdx(idx);
  };
  return (
    <div className="mx-16 mt-20 flex justify-between px-6">
      <ol className="flex flex-col gap-10">
        <li className="flex items-center gap-9">
          <button
            onClick={() => handleSelection(1)}
            className={cn(
              "flex h-16 w-16 items-center justify-center rounded-full bg-accent text-lg font-medium",
              selectedIdx === 1 && "border-4 border-amber-500",
              confirmedIdx >= 1 && "bg-primary text-primary-foreground",
            )}
          >
            1
          </button>
          <h3>Setup</h3>
        </li>
        <li className="flex items-center gap-9">
          <button
            onClick={() => handleSelection(2)}
            className={cn(
              "flex h-16 w-16 items-center justify-center rounded-full bg-accent text-lg font-medium",
              selectedIdx === 2 && "border-4 border-amber-500",
              confirmedIdx >= 2 && "bg-primary text-primary-foreground",
            )}
          >
            2
          </button>
          <h3>Project Submission</h3>
        </li>
        <li className="flex items-center gap-9">
          <button
            onClick={() => handleSelection(3)}
            className={cn(
              "flex h-16 w-16 items-center justify-center rounded-full bg-accent text-lg font-medium",
              selectedIdx === 3 && "border-4 border-amber-500",
              confirmedIdx >= 3 && "bg-primary text-primary-foreground",
            )}
          >
            3
          </button>
          <h3>Project Selection</h3>
        </li>
        <li className="flex items-center gap-9">
          <button
            onClick={() => handleSelection(4)}
            className={cn(
              "flex h-16 w-16 items-center justify-center rounded-full bg-accent text-lg font-medium",
              selectedIdx === 4 && "border-4 border-amber-500",
              confirmedIdx >= 4 && "bg-primary text-primary-foreground",
            )}
          >
            4
          </button>
          <h3>Project Allocation</h3>
        </li>
        <li className="flex items-center gap-9">
          <button
            onClick={() => handleSelection(5)}
            className={cn(
              "flex h-16 w-16 items-center justify-center rounded-full bg-accent text-lg font-medium",
              selectedIdx === 5 && "border-4 border-amber-500",
              confirmedIdx >= 5 && "bg-primary text-primary-foreground",
            )}
          >
            5
          </button>
          <h3>Publishing Project Allocation</h3>
        </li>
      </ol>
      <Button
        className="self-end"
        disabled={selectedIdx === -1}
        onClick={() => handleConfirmation(selectedIdx)}
      >
        confirm
      </Button>
    </div>
  );
}
