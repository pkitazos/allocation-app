"use client";
import { cn } from "@/lib/utils";
import {
  allValid,
  getPreferenceRank,
  getUpdatedWeight,
} from "@/lib/utils/allocation-adjustment";
import { zeros } from "@/lib/utils/general/zeros";

import { useAllocDetails } from "./allocation-store";

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
