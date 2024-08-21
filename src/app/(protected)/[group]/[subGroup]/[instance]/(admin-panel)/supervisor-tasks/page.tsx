import { SupervisorInstanceHome } from "@/components/pages/supervisor-instance-home";
import { PanelWrapper } from "@/components/panel-wrapper";

import { InstanceParams } from "@/lib/validations/params";

export default async function Page({ params }: { params: InstanceParams }) {
  return (
    <PanelWrapper>
      <SupervisorInstanceHome params={params} />
    </PanelWrapper>
  );
}
