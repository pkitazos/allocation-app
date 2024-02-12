"use client";
import { cn } from "@/lib/utils";
import { useAllocDetails } from "../allocation-store";

export function MatchingInfoTable() {
  const isValid = useAllocDetails((s) => s.validOverall);
  const profile = useAllocDetails((s) => s.profile);
  const weight = useAllocDetails((s) => s.weight);

  const rowConflicts = useAllocDetails((s) => s.rowConflicts);

  return (
    <div className={cn("flex flex-col", !isValid && "text-destructive")}>
      <p className="font-semibold text-black">matching info table</p>
      <p>isValid: {isValid.toString()}</p>
      <p>profile: {`(${profile.join(",")})`}</p>
      <p>weight: {weight}</p>
      <p>conflicts with:</p>
      {rowConflicts.map((row, i) => {
        return (
          <div className="border-t" key={i}>
            {row.map((id) => (
              <p className="pr-3" key={id}>
                {id}
              </p>
            ))}
          </div>
        );
      })}
    </div>
  );
}
