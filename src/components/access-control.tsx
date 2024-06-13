import { Role, Stage } from "@prisma/client";
import { ReactNode } from "react";

import { api } from "@/lib/trpc/server";
import { InstanceParams } from "@/lib/validations/params";

export async function AccessControl({
  children,
  instanceParams: params,
  allowedStages: sbac = [],
  allowedRoles: rbac = [],
}: {
  children: ReactNode;
  instanceParams: InstanceParams;
  allowedStages?: Stage[];
  allowedRoles?: Role[];
}) {
  const role = await api.user.role({ params });
  const stage = await api.institution.instance.currentStage({ params });

  if (rbac.includes(role) && sbac.includes(stage)) return <>{children}</>;
  return <></>;
}
