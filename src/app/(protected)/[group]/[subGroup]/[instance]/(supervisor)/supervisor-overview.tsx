import { api } from "@/lib/trpc/server";
import { instanceParams } from "@/lib/validations/params";

export async function SupervisorOverview({
  params,
}: {
  params: instanceParams;
}) {
  const stage = await api.institution.instance.currentStage.query({ params });

  return <>{stage}</>;
}
