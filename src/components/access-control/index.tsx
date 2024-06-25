"use client";
import { ReactNode } from "react";
import { AdminLevel, Role, Stage } from "@prisma/client";

import { stageSchema } from "@/lib/validations/stage";

import { AdminLevelAC } from "./admin-level-ac";
import { RBAC } from "./rbac";
import { SBAC } from "./sbac";

export function AccessControl({
  children,
  allowedStages = stageSchema.options,
  allowedRoles = [Role.ADMIN, Role.SUPERVISOR, Role.STUDENT],
  minimumAdminLevel,
  extraConditions,
}: {
  children: ReactNode;
  allowedStages?: Stage[];
  allowedRoles?: Role[];
  minimumAdminLevel?: AdminLevel;
  extraConditions?: {
    RBAC?: { AND?: boolean; OR?: boolean };
    SBAC?: { AND?: boolean; OR?: boolean };
  };
}) {
  return (
    <RBAC
      allowedRoles={allowedRoles}
      AND={extraConditions?.RBAC?.AND}
      OR={extraConditions?.RBAC?.OR}
    >
      <SBAC
        allowedStages={allowedStages}
        AND={extraConditions?.SBAC?.AND}
        OR={extraConditions?.SBAC?.OR}
      >
        <AdminLevelAC minimumAdminLevel={minimumAdminLevel}>
          {children}
        </AdminLevelAC>
      </SBAC>
    </RBAC>
  );
}
