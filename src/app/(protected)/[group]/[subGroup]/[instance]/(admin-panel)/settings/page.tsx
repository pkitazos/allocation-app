import { PanelWrapper } from "@/components/panel-wrapper";

import { DangerZone } from "./_components/danger-zone";
import { spacesLabels } from "@/content/spaces";

export default async function Page() {
  return (
    <PanelWrapper>
      <div className="mt-16">
        <DangerZone spaceLabel={spacesLabels.instance.full} />
      </div>
    </PanelWrapper>
  );
}
