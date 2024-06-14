"use client";
import { AdminLevel } from "@prisma/client";
import { ReactNode } from "react";

import { api } from "@/lib/trpc/client";
import { permissionCheck } from "@/lib/utils/permissions/permission-check";

export function AdminLevelAC({
  children,
  minimumAdminLevel = AdminLevel.SUB_GROUP,
}: {
  children: ReactNode;
  minimumAdminLevel?: AdminLevel;
}) {
  const { data: adminLevel, isSuccess } = api.user.adminLevel.useQuery();

  if (!isSuccess) return <></>;
  if (permissionCheck(adminLevel, minimumAdminLevel)) return <>{children}</>;

  return <></>;
}
