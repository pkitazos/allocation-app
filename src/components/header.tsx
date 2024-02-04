import { Role } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

import whiteLogo from "@/assets/uofg-white.png";
import { api } from "@/lib/trpc/server";
import { getInstancePath } from "@/lib/utils/get-instance-path";
import { getSpaceParams } from "@/lib/utils/get-space-params";
import { roleCheck } from "@/lib/utils/role-check";
import { InstanceLink } from "./instance-link";
import { UserButton } from "./user-button";

export async function Header() {
  const adminPanel = await api.user.adminPanelRoute.query();
  const { inInstance, spaceParams: params } = await getSpaceParams();

  const role = await api.user.role.query({ params });
  const instancePath = getInstancePath(params);

  return (
    <nav className="sticky top-0 z-50 flex h-[8dvh] max-h-[5rem] w-full items-center justify-between gap-6 bg-primary px-10 py-5">
      <Link href="/">
        <Image
          className="max-w-[10rem] object-scale-down"
          width={300}
          height={100}
          src={whiteLogo}
          alt=""
        />
      </Link>
      {inInstance && (
        <div className="flex items-center gap-6">
          {inInstance && (
            <>
              {
                <InstanceLink href={`${instancePath}/projects`}>
                  Projects
                </InstanceLink>
              }
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
                <InstanceLink href={`${instancePath}/students`}>
                  Students
                </InstanceLink>
              )}
            </>
          )}
          {roleCheck(role, [Role.ADMIN]) && adminPanel && (
            <InstanceLink href={adminPanel}>Admin Panel</InstanceLink>
          )}
        </div>
      )}
      <UserButton />
    </nav>
  );
}
