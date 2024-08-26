import { SubHeading } from "@/components/heading";
import { PanelWrapper } from "@/components/panel-wrapper";

import { api } from "@/lib/trpc/server";
import { InstanceParams } from "@/lib/validations/params";
import { adminTabs } from "@/lib/validations/tabs/admin-panel";

import { AddStudentsSection } from "./_components/add-students-section";

import { app, metadataTitle } from "@/content/config/app";
import { pages } from "@/content/pages";

export async function generateMetadata({ params }: { params: InstanceParams }) {
  const { displayName } = await api.institution.instance.get({ params });

  return {
    title: metadataTitle([pages.addStudents.title, displayName, app.name]),
  };
}

export default function Page() {
  return (
    <PanelWrapper className="mt-10">
      <SubHeading>{adminTabs.addStudents.title}</SubHeading>
      <AddStudentsSection />
    </PanelWrapper>
  );
}
