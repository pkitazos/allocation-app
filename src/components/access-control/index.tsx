"use client";
import { AdminLevel, Role, Stage } from "@prisma/client";
import { ReactNode } from "react";
import { RBAC } from "./rbac";
import { SBAC } from "./sbac";
import { AdminLevelAC } from "./admin-level-ac";

export function AccessControl({
  children,
  allowedStages = [],
  allowedRoles = [],
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
