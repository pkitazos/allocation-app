import { SubHeading } from "@/components/heading";
import { InviteTable } from "@/components/invite-table";
import { PanelWrapper } from "@/components/panel-wrapper";

import { api } from "@/lib/trpc/server";
import { InstanceParams } from "@/lib/validations/params";

export default async function Page({ params }: { params: InstanceParams }) {
  const { supervisors } =
    await api.institution.instance.invitedSupervisors.query({
      params,
    });

  return (
    <PanelWrapper className="mt-10 flex flex-col items-start gap-8 px-12">
      <SubHeading className="text-2xl">Supervisor Invite status</SubHeading>
      <InviteTable users={supervisors} />
    </PanelWrapper>
  );
}
