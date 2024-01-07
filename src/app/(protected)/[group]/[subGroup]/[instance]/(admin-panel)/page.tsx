import { api } from "@/lib/trpc/server";
import { StageControl } from "./stage-control";

export default async function Page({
  params,
}: {
  params: { group: string; subGroup: string; instance: string };
}) {
  const stage = await api.institution.instance.currentStage.query(params);

  return (
    <StageControl
      stage={stage}
      group={params.group}
      subGroup={params.subGroup}
      instance={params.instance}
    />
  );
}
