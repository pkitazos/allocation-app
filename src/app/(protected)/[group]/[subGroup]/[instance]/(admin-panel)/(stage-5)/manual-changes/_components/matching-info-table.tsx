"use client";
import { cn } from "@/lib/utils";
import { useAllocDetails } from "./allocation-store";

export function MatchingInfoTable() {
  const isValid = useAllocDetails((s) => s.conflicts).length === 0;
  const profile = useAllocDetails((s) => s.profile);
  const weight = useAllocDetails((s) => s.weight);

  return (
    <div className={cn("flex flex-col", !isValid && "text-destructive")}>
      <p className="font-semibold text-black">matching info table</p>
      <p>isValid: {isValid.toString()}</p>
      <p>profile: {`(${profile.join(",")})`}</p>
      <p>weight: {weight}</p>
    </div>
  );
}
