import { Role } from "@prisma/client";

import { api } from "@/lib/trpc/server";
import { getInstancePath } from "@/lib/utils/general/get-instance-path";
import { roleCheck } from "@/lib/utils/permissions/role-check";
import { instanceParams } from "@/lib/validations/params";

import { InstanceLink } from "./instance-link";

export async function InstanceTabs({ params }: { params: instanceParams }) {
  const instancePath = getInstancePath(params);
  const role = await api.user.role.query({ params });

  console.log("---------------------------- in instance -------");

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
