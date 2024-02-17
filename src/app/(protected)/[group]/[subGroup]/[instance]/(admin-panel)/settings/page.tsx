import { PanelWrapper } from "@/components/panel-wrapper";
import { DangerZone } from "./_components/danger-zone";

export default async function Page() {
  return (
    <PanelWrapper>
      <DangerZone spaceTitle="Instance" />
    </PanelWrapper>
  );
}
