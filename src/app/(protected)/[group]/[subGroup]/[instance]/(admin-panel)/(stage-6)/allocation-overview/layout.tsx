import { Stage } from "@prisma/client";
import { redirect } from "next/navigation";

import { api } from "@/lib/trpc/server";
import { formatParamsAsPath } from "@/lib/utils/general/get-instance-path";
import { instanceParams } from "@/lib/validations/params";

export default async function Layout({
  params,
  children,
}: {
  params: instanceParams;
  children: React.ReactNode;
}) {
  const stage = await api.institution.instance.currentStage.query({ params });
  const instancePath = formatParamsAsPath(params);

  if (stage !== Stage.ALLOCATION_PUBLICATION) redirect(`${instancePath}/`);

  return <>{children}</>;
}
