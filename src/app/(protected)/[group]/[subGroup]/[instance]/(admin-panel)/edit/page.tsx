import { SubHeading } from "@/components/heading";

import { api } from "@/lib/trpc/server";
import { InstanceParams } from "@/lib/validations/params";

import { EditInstanceForm } from "./_components/edit-instance-form";

import { app, metadataTitle } from "@/content/config/app";
import { pages } from "@/content/pages";
import { spacesLabels } from "@/content/spaces";

export async function generateMetadata({ params }: { params: InstanceParams }) {
  const { displayName } = await api.institution.instance.get({ params });

  return {
    title: metadataTitle([pages.instanceEdit.title, displayName, app.name]),
  };
}

export default async function Page({ params }: { params: InstanceParams }) {
  const currentInstance = await api.institution.instance.getEditFormDetails({
    params,
  });

  return (
    <div className="mb-40 mt-6 flex h-max w-full max-w-5xl flex-col gap-10 px-6 pb-20">
      <SubHeading>Edit {spacesLabels.instance.full} Details</SubHeading>
      <EditInstanceForm
        currentInstance={currentInstance}
        params={params}
        isForked={!!currentInstance.parentInstanceId}
      />
    </div>
  );
}
