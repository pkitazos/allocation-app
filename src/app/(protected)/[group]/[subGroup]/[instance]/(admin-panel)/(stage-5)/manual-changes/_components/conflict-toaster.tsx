"use client";

import { cn } from "@/lib/utils";
import { withinBounds } from "@/lib/utils/allocation-adjustment/project";
import {
  getCurrentCapacity,
  withinCapacity,
} from "@/lib/utils/allocation-adjustment/supervisor";
import {
  ProjectInfo,
  SupervisorDetails,
} from "@/lib/validations/allocation-adjustment";

import { useAllocDetails } from ".";
import { ConflictBanner } from "./conflict-banner";
import { AccessControl } from "@/components/access-control";
import { AdminLevel, Role } from "@prisma/client";

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
      <AccessControl
        allowedRoles={[Role.ADMIN]}
        minimumAdminLevel={AdminLevel.SUPER}
      >
        <DebugComponent
          DEBUG={DEBUG}
          supervisors={supervisors}
          allProjects={allProjects}
        />
      </AccessControl>
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

function DebugComponent({
  DEBUG,
  supervisors,
  allProjects,
}: {
  DEBUG: boolean;
  supervisors: SupervisorDetails[];
  allProjects: ProjectInfo[];
}) {
  if (DEBUG)
    return (
      <>
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
        )
      </>
    );
}
