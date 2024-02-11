"use client";
import { cn } from "@/lib/utils";
import { useAllocDetailsContext } from "../allocation-store";

export function MatchingInfoTable() {
  const isValid = useAllocDetailsContext((s) => s.isValid);
  const profile = useAllocDetailsContext((s) => s.profile);
  const weight = useAllocDetailsContext((s) => s.weight);
  const conflictingWith = useAllocDetailsContext((s) => s.conflictingWith);
  return (
    <div className={cn("flex flex-col", !isValid && "text-destructive")}>
      <p className="font-semibold text-black">matching info table</p>
      <p>isValid: {isValid.toString()}</p>
      <p>profile: {`(${profile.join(",")})`}</p>
      <p>weight: {weight}</p>
      <p>conflicts with:</p>
      {conflictingWith.map((id) => (
        <p className="pr-3" key={id}>
          {id}
        </p>
      ))}
    </div>
  );
}
