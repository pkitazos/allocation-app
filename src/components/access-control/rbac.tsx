"use client";
import { ReactNode } from "react";
import { Role } from "@prisma/client";

import { api } from "@/lib/trpc/client";

import { useInstanceParams } from "../params-context";

export function RBAC({
  children,
  allowedRoles,
  AND = true,
  OR = false,
}: {
  children: ReactNode;
  allowedRoles: Role[];
  AND?: boolean;
  OR?: boolean;
}) {
  const params = useInstanceParams();
  const { data: userRole, isSuccess } = api.user.role.useQuery({ params });

  if (!isSuccess) return <></>;
  if (OR || (AND && allowedRoles.includes(userRole))) return <>{children}</>;

  return <></>;
}
