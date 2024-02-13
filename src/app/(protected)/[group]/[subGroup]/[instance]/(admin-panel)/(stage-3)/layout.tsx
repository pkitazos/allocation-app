import { Stage } from "@prisma/client";
import { redirect } from "next/navigation";

import { api } from "@/lib/trpc/server";
import { getInstancePath } from "@/lib/utils/general/get-instance-path";
import { instanceParams } from "@/lib/validations/params";

export default async function Layout({
  params,
  children,
}: {
  params: instanceParams;
  children: React.ReactNode;
}) {
  const stage = await api.institution.instance.currentStage.query({ params });
  const instancePath = getInstancePath(params);

  if (stage !== Stage.PROJECT_SELECTION) redirect(`${instancePath}/`);

  return <>{children}</>;
}
