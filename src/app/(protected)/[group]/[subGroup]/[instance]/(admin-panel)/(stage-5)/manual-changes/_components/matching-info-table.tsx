"use client";
import { cn } from "@/lib/utils";
import {
  allProjectsValid,
  getPreferenceRank,
  getUpdatedWeight,
} from "@/lib/utils/allocation-adjustment";
import { zeros } from "@/lib/utils/general/zeros";

import { Separator } from "@/components/ui/separator";
import {
  allSupervisorsValid,
  getCurrentCapacity,
  withinCapacity,
} from "@/lib/utils/allocation-adjustment/supervisor";
import { useAllocDetails } from "./allocation-store";

export function MatchingInfoTable() {
  const allProjects = useAllocDetails((s) => s.projects);
  const allStudents = useAllocDetails((s) => s.students);
  const allSupervisors = useAllocDetails((s) => s.supervisors);

  const isValid =
    allProjectsValid(allProjects) &&
    allSupervisorsValid(allProjects, allSupervisors);

  const pref = allStudents.map((row) => getPreferenceRank(allProjects, row));

  const profile = zeros(Math.max(...pref) + 1);
  pref.forEach((idx) => (profile[idx] += 1));

  const weight = getUpdatedWeight(profile);
  const size = profile.reduce((acc, val) => acc + val, 0);

  const supervisors = useAllocDetails((s) => s.supervisors);

  return (
    <div className={cn("flex flex-col", !isValid && "text-destructive")}>
      <p className="font-semibold text-black">matching info table</p>
      <p>isValid: {isValid.toString()}</p>
      <p>profile: {`(${profile.join(",")})`}</p>
      <p>weight: {weight}</p>
      <p>size: {size}</p>
      <Separator />
      <div>
        {supervisors.map((s) => {
          const capacity = getCurrentCapacity(allProjects, s);
          const invalid = !withinCapacity(allProjects, s);
          return (
            <div
              className={cn("mt-5", invalid && "text-destructive")}
              key={s.supervisorId}
            >
              <p className="font-semibold">{s.supervisorId}</p>
              <p>projects: [{s.projects.join(", ")}]</p>
              <p>current capacity: {capacity}</p>
              <p>lowerBound: {s.lowerBound}</p>
              <p>target: {s.target}</p>
              <p>upperBound: {s.upperBound}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
