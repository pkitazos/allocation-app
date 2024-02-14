"use client";
import { Role } from "@prisma/client";
import { useParams } from "next/navigation";
import { InstanceLink } from "./instance-link";

import { api } from "@/lib/trpc/client";
import { formatParamsAsPath } from "@/lib/utils/general/get-instance-path";
import { roleCheck } from "@/lib/utils/permissions/role-check";
import { instanceParams, instanceParamsSchema } from "@/lib/validations/params";

export function ClientHeader() {
  const params = useParams<instanceParams>();
  const instancePath = formatParamsAsPath(params);
  const result = instanceParamsSchema.safeParse(params);

  const { data: role, isError } = api.user.role.useQuery(
    { params },
    { refetchOnWindowFocus: false, retry: false },
  );

  if (!result.success || isError || !role) return;

  return (
    <>
      <InstanceLink href={`${instancePath}/projects`}>Projects</InstanceLink>
      {roleCheck(role, [Role.ADMIN, Role.SUPERVISOR]) && (
        <InstanceLink href={`${instancePath}/supervisors`}>
          Supervisors
        </InstanceLink>
      )}
      {roleCheck(role, [Role.STUDENT]) && (
        <InstanceLink href={`${instancePath}/my-preferences`}>
          My Preferences
        </InstanceLink>
      )}
      {roleCheck(role, [Role.SUPERVISOR]) && (
        <InstanceLink href={`${instancePath}/my-projects`}>
          My Projects
        </InstanceLink>
      )}
      {roleCheck(role, [Role.ADMIN, Role.SUPERVISOR]) && (
        <InstanceLink href={`${instancePath}/students`}>Students</InstanceLink>
      )}
    </>
  );
}
