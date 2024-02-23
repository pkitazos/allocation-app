/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { cn } from "@/lib/utils";
import { withinBounds } from "@/lib/utils/allocation-adjustment/project";
import {
  getCurrentCapacity,
  withinCapacity,
} from "@/lib/utils/allocation-adjustment/supervisor";

import { ConflictBanner } from "./conflict-banner";
import { useAllocDetails } from ".";

export function ConflictToaster() {
  const DEBUG = false;

  const allProjects = useAllocDetails((s) => s.projects);
  const supervisors = useAllocDetails((s) => s.supervisors);

  const oversubscribedProjects = allProjects.filter((p) => !withinBounds(p));
  const overWorkedSupervisors = supervisors.filter(
    (s) => !withinCapacity(allProjects, s),
  );

  return (
    <div className="flex flex-col gap-3">
      {DEBUG &&
        supervisors.map((s) => {
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
      {oversubscribedProjects.map((p, i) => (
        <ConflictBanner key={i} type="project">
          Project {p.id} is oversubscribed
        </ConflictBanner>
      ))}
      {overWorkedSupervisors.map((s, i) => (
        <ConflictBanner key={i} type="supervisor">
          Supervisor {s.supervisorId} is assigned more students than
          they&apos;re able to take on
        </ConflictBanner>
      ))}
    </div>
  );
}
