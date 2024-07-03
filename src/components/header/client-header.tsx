"use client";
import { Role, Stage } from "@prisma/client";
import { useParams } from "next/navigation";

import { api } from "@/lib/trpc/client";
import { formatParamsAsPath } from "@/lib/utils/general/get-instance-path";
import { roleCheck } from "@/lib/utils/permissions/role-check";
import { stageGte } from "@/lib/utils/permissions/stage-check";
import { InstanceParams, instanceParamsSchema } from "@/lib/validations/params";

import { InstanceLink } from "./instance-link";

export function InstanceTabs() {
  const params = useParams<InstanceParams>();
  const instancePath = formatParamsAsPath(params);
  const result = instanceParamsSchema.safeParse(params);

  const { data: role, isError: roleError } = api.user.role.useQuery(
    { params },
    { refetchOnWindowFocus: false, retry: false },
  );
  const { data: stage } = api.institution.instance.currentStage.useQuery(
    { params },
    { refetchOnWindowFocus: false, retry: false },
  );

  if (!result.success || roleError || !role || !stage) return;

  return (
    <>
      {((roleCheck(role, [Role.ADMIN, Role.SUPERVISOR]) &&
        stageGte(stage, Stage.PROJECT_SUBMISSION)) ||
        stageGte(stage, Stage.PROJECT_SELECTION)) && (
        <InstanceLink href={`${instancePath}/projects`}>Projects</InstanceLink>
      )}
      {roleCheck(role, [Role.ADMIN]) && (
        <InstanceLink href={`${instancePath}/supervisors`}>
          Supervisors
        </InstanceLink>
      )}
      {roleCheck(role, [Role.ADMIN, Role.SUPERVISOR]) && (
        <InstanceLink href={`${instancePath}/students`}>Students</InstanceLink>
      )}
      {roleCheck(role, [Role.STUDENT]) &&
        stageGte(stage, Stage.PROJECT_SELECTION) && (
          <InstanceLink href={`${instancePath}/my-preferences`}>
            My Preferences
          </InstanceLink>
        )}
      {roleCheck(role, [Role.STUDENT]) &&
        stageGte(stage, Stage.ALLOCATION_PUBLICATION) && (
          <InstanceLink href={`${instancePath}/my-allocation`}>
            My Allocation
          </InstanceLink>
        )}
      {roleCheck(role, [Role.SUPERVISOR]) && (
        <InstanceLink href={`${instancePath}/my-projects`}>
          My Projects
        </InstanceLink>
      )}
      {roleCheck(role, [Role.SUPERVISOR]) &&
        stageGte(stage, Stage.ALLOCATION_PUBLICATION) && (
          <InstanceLink href={`${instancePath}/my-allocations`}>
            My Allocations
          </InstanceLink>
        )}
    </>
  );
}
