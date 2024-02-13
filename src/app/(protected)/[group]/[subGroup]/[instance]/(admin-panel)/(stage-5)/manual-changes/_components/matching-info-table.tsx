"use client";
import { cn } from "@/lib/utils";
import { zeros } from "@/lib/utils/zeros";

import { useAllocDetails } from "./allocation-store";
import { allValid, getPreferenceRank, getUpdatedWeight } from "../_utils";

export function MatchingInfoTable() {
  const allProjects = useAllocDetails((s) => s.projects);
  const allStudents = useAllocDetails((s) => s.students);
  const isValid = allValid(allProjects);

  const pref = allStudents.map((row) => getPreferenceRank(allProjects, row));

  const profile = zeros(Math.max(...pref) + 1);
  pref.forEach((idx) => (profile[idx] += 1));

  const weight = getUpdatedWeight(profile);

  return (
    <div className={cn("flex flex-col", !isValid && "text-destructive")}>
      <p className="font-semibold text-black">matching info table</p>
      <p>isValid: {isValid.toString()}</p>
      <p>profile: {`(${profile.join(",")})`}</p>
      <p>weight: {weight}</p>
    </div>
  );
}
