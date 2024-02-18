import { PanelWrapper } from "@/components/panel-wrapper";

import { DangerZone } from "./_components/danger-zone";

export default async function Page() {
  return (
    <PanelWrapper>
      <div className="mt-16">
        <DangerZone spaceTitle="Instance" />
      </div>
    </PanelWrapper>
  );
}
