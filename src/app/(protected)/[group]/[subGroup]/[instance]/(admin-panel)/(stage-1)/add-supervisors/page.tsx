import { SubHeading } from "@/components/heading";
import { PanelWrapper } from "@/components/panel-wrapper";

import { api } from "@/lib/trpc/server";
import { InstanceParams } from "@/lib/validations/params";

import { AddSupervisorsSection } from "./_components/add-supervisors-section";

import { app, metadataTitle } from "@/content/config/app";
import { pages } from "@/content/pages";

export async function generateMetadata({ params }: { params: InstanceParams }) {
  const { displayName } = await api.institution.instance.get({ params });

  return {
    title: metadataTitle([pages.addSupervisors.title, displayName, app.name]),
  };
}

export default function Page() {
  return (
    <PanelWrapper className="mt-10">
      <SubHeading className="mb-4">{pages.addSupervisors.title}</SubHeading>
      <AddSupervisorsSection />
    </PanelWrapper>
  );
}
