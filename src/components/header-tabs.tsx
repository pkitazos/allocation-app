import { api } from "@/lib/trpc/server";
import { getSpaceParams } from "@/lib/utils/get-space-params";
import { InstanceLink } from "./instance-link";
import { InstanceTabs } from "./instance-tabs";

export async function HeaderTabs() {
  const adminPanel = await api.user.adminPanelRoute.query();
  const { inInstance, spaceParams: params } = await getSpaceParams();

  console.log("-------->>", { adminPanel });
  return (
    <div className="flex items-center gap-6">
      {inInstance && <InstanceTabs params={params} />}
      {adminPanel && <InstanceLink href={adminPanel}>Admin Panel</InstanceLink>}
    </div>
  );
}
