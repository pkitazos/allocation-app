"use client";
import { Role, Stage } from "@prisma/client";
import { ReactNode } from "react";
import { RBAC } from "./rbac";
import { SBAC } from "./sbac";

export function AccessControl({
  children,
  allowedStages = [],
  allowedRoles = [],
  extraConditions,
}: {
  children: ReactNode;
  allowedStages?: Stage[];
  allowedRoles?: Role[];
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
        {children}
      </SBAC>
    </RBAC>
  );
}
