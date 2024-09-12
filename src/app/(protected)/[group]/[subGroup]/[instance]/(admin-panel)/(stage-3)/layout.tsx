import { Stage } from "@prisma/client";
import { redirect } from "next/navigation";

import { api } from "@/lib/trpc/server";
import { formatParamsAsPath } from "@/lib/utils/general/get-instance-path";
import { InstanceParams } from "@/lib/validations/params";
import { stageLt } from "@/lib/utils/permissions/stage-check";

export default async function Layout({
  params,
  children,
}: {
  params: InstanceParams;
  children: React.ReactNode;
}) {
  const stage = await api.institution.instance.currentStage({ params });
  const instancePath = formatParamsAsPath(params);

  if (stageLt(stage, Stage.PROJECT_SELECTION)) redirect(`${instancePath}/`);

  return <>{children}</>;
}
