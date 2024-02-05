import { Role } from "@prisma/client";

import { api } from "@/lib/trpc/server";
import { getInstancePath } from "@/lib/utils/get-instance-path";
import { getSpaceParams } from "@/lib/utils/get-space-params";
import { roleCheck } from "@/lib/utils/role-check";
import { InstanceLink } from "./instance-link";
import { instanceParams } from "@/lib/validations/params";

export async function HeaderTabs() {
  const adminPanel = await api.user.adminPanelRoute.query();
  const { inInstance, spaceParams: params } = await getSpaceParams();

  console.log("-------->>", { inInstance });
  return (
    <div className="flex items-center gap-6">
      {inInstance && <InstanceTabs params={params} />}
      {adminPanel && <InstanceLink href={adminPanel}>Admin Panel</InstanceLink>}
    </div>
  );
}

async function InstanceTabs({ params }: { params: instanceParams }) {
  const instancePath = getInstancePath(params);
  const role = await api.user.role.query({ params });

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
