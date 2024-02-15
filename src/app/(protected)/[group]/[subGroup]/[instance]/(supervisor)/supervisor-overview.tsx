import { api } from "@/lib/trpc/server";
import { InstanceParams } from "@/lib/validations/params";

export async function SupervisorOverview({
  params,
}: {
  params: InstanceParams;
}) {
  const stage = await api.institution.instance.currentStage.query({ params });

  return <>{stage}</>;
}
