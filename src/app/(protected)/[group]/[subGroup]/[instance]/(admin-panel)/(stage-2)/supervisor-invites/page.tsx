import { SubHeading } from "@/components/heading";
import { PanelWrapper } from "@/components/panel-wrapper";

import { api } from "@/lib/trpc/server";
import { InstanceParams } from "@/lib/validations/params";
import { adminTabs } from "@/lib/validations/tabs/admin-panel";

import { SupervisorInvitesDataTable } from "./_components/supervisor-invites-data-table";

import { app, metadataTitle } from "@/content/config/app";
import { pages } from "@/content/pages";

export async function generateMetadata({ params }: { params: InstanceParams }) {
  const { displayName } = await api.institution.instance.get({ params });

  return {
    title: metadataTitle([
      pages.supervisorInvites.title,
      displayName,
      app.name,
    ]),
  };
}

export default async function Page({ params }: { params: InstanceParams }) {
  const { supervisors } = await api.institution.instance.invitedSupervisors({
    params,
  });

  return (
    <PanelWrapper className="mt-10 flex flex-col items-start gap-8 px-12">
      <SubHeading className="text-2xl">
        {adminTabs.supervisorInvites.title}
      </SubHeading>
      <SupervisorInvitesDataTable data={supervisors} />
    </PanelWrapper>
  );
}
