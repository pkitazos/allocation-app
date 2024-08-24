import { SubHeading } from "@/components/heading";
import { PanelWrapper } from "@/components/panel-wrapper";

import { api } from "@/lib/trpc/server";
import { InstanceParams } from "@/lib/validations/params";
import { adminTabs } from "@/lib/validations/tabs/admin-panel";

import { LateProjectDataTable } from "./_components/late-project-data-table";

import { app, metadataTitle } from "@/content/config/app";
import { pages } from "@/content/pages";

export async function generateMetadata({ params }: { params: InstanceParams }) {
  const { displayName } = await api.institution.instance.get({ params });

  return {
    title: metadataTitle([pages.lateProposals.title, displayName, app.name]),
  };
}

export default async function Page({ params }: { params: InstanceParams }) {
  const projects = await api.project.getAllLateProposals({ params });
  return (
    <PanelWrapper className="mt-10 flex flex-col items-start gap-8 px-12">
      <SubHeading className="text-2xl">
        {adminTabs.lateProposals.title}
      </SubHeading>
      <LateProjectDataTable data={projects} />
    </PanelWrapper>
  );
}
