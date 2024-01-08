"use client";
import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction } from "react";

export function StageButton({
  title,
  num,
  selectedIdx,
  confirmedIdx,
  setSelectedIdx,
}: {
  title: string;
  num: number;
  selectedIdx: number;
  confirmedIdx: number;
  setSelectedIdx: Dispatch<SetStateAction<number>>;
}) {
  const handleSelection = (idx: number) => {
    if (idx === selectedIdx) setSelectedIdx(-1);
    else setSelectedIdx(idx);
  };

  return (
    <li className="flex items-center gap-9">
      <button
        onClick={() => handleSelection(num)}
        className={cn(
          "flex h-16 w-16 items-center justify-center rounded-full bg-accent text-lg font-medium",
          selectedIdx === num && "border-4 border-amber-500",
          confirmedIdx >= num && "bg-primary text-primary-foreground",
        )}
      >
        {num}
      </button>
      <h3>{title}</h3>
    </li>
  );
}
