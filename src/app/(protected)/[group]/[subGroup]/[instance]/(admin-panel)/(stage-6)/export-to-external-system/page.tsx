import { Unauthorised } from "@/components/unauthorised";

import { api } from "@/lib/trpc/server";
import { InstanceParams } from "@/lib/validations/params";

import { app, metadataTitle } from "@/content/config/app";
import { pages } from "@/content/pages";

export async function generateMetadata({ params }: { params: InstanceParams }) {
  const { displayName } = await api.institution.instance.get({ params });

  return {
    title: metadataTitle([
      pages.exportToExternalSystem.title,
      displayName,
      app.name,
    ]),
  };
}

export default async function Page({ params }: { params: InstanceParams }) {
  console.log(params);
  return (
    <Unauthorised
      title="Coming Soon"
      message="This page is still under development. How did you even find it?"
    />
  );
  {
    /* 
    <PanelWrapper className="flex flex-col items-center justify-center gap-5 pt-8">
      // TODO: add to NoteCard after merging branches 
      <p>Include note card here explaining the steps/what will happen?</p>
     
      <SubHeading className="mt-3">
        Check users exist on Assessment System
      </SubHeading>
      <SubHeading className="mt-16">
        Create Projects on Assessment System
      </SubHeading>
      <CreateProjectsSection /> 
      </PanelWrapper>
      */
  }
}
