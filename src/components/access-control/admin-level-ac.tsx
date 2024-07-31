"use client";
import { AdminLevel } from "@prisma/client";
import { useParams } from "next/navigation";
import { ReactNode } from "react";

import { api } from "@/lib/trpc/client";
import { permissionCheck } from "@/lib/utils/permissions/permission-check";
import { RefinedSpaceParams } from "@/lib/validations/params";

export function AdminLevelAC({
  children,
  minimumAdminLevel = AdminLevel.SUB_GROUP,
}: {
  children: ReactNode;
  minimumAdminLevel?: AdminLevel;
}) {
  const params = useParams<RefinedSpaceParams>();
  // TODO: check if this still works
  const { data: adminLevel, isSuccess } = api.user.adminLevel.useQuery({
    params,
  });

  if (!isSuccess) return <></>;
  if (permissionCheck(adminLevel, minimumAdminLevel)) return <>{children}</>;

  return <></>;
}
