"use client";
import { cn } from "@/lib/utils";
import { useAllocDetails } from "./allocation-store";
import { allValid } from "../_utils/get-project";

export function MatchingInfoTable() {
  const profile = useAllocDetails((s) => s.profile);
  const weight = useAllocDetails((s) => s.weight);
  const allProjects = useAllocDetails((s) => s.projects);
  const isValid = allValid(allProjects);

  return (
    <div className={cn("flex flex-col", !isValid && "text-destructive")}>
      <p className="font-semibold text-black">matching info table</p>
      <p>isValid: {isValid.toString()}</p>
      <p>profile: {`(${profile.join(",")})`}</p>
      <p>weight: {weight}</p>
    </div>
  );
}
