import { SubHeading } from "@/components/heading";
import { InviteTable } from "@/components/invite-table";
import { PanelWrapper } from "@/components/panel-wrapper";

import { api } from "@/lib/trpc/server";
import { InstanceParams } from "@/lib/validations/params";
import { adminTabs } from "@/lib/validations/tabs/admin-panel";

import { app, metadataTitle } from "@/content/config/app";
import { pages } from "@/content/pages";

export async function generateMetadata({ params }: { params: InstanceParams }) {
  const { displayName } = await api.institution.instance.get({ params });

  return {
    title: metadataTitle([pages.studentInvites.title, displayName, app.name]),
  };
}

export default async function Page({ params }: { params: InstanceParams }) {
  const { students } = await api.institution.instance.invitedStudents({
    params,
  });

  return (
    <PanelWrapper className="mt-10 flex flex-col items-start gap-8 px-12">
      <SubHeading className="text-2xl">
        {adminTabs.studentInvites.title}
      </SubHeading>
      <InviteTable users={students} />
    </PanelWrapper>
  );
}
