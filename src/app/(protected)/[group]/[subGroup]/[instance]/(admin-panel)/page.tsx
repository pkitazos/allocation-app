import { api } from "@/lib/trpc/server";
import { StageControl } from "./client-section";

export default async function Page({
  params: { group, subGroup, instance },
}: {
  params: { group: string; subGroup: string; instance: string };
}) {
  const stage = await api.institution.instance.getStage.query({
    groupId: group,
    subGroupId: subGroup,
    instanceId: instance,
  });

  return (
    <StageControl
      stage={stage}
      groupId={group}
      subGroupId={subGroup}
      instanceId={instance}
    />
  );
}
