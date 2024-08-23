import { SubHeading } from "@/components/heading";
import { Unauthorised } from "@/components/unauthorised";

import { api } from "@/lib/trpc/server";
import { InstanceParams } from "@/lib/validations/params";
import { adminTabs } from "@/lib/validations/tabs/admin-panel";

import { ForkedInstanceForm } from "./_components/forked-instance-form";

import { app, metadataTitle } from "@/content/config/app";
import { pages } from "@/content/pages";
import { spacesLabels } from "@/content/spaces";

export async function generateMetadata({ params }: { params: InstanceParams }) {
  const { displayName } = await api.institution.instance.get({ params });

  return {
    title: metadataTitle([pages.forkInstance.title, displayName, app.name]),
  };
}

export default async function Page({ params }: { params: InstanceParams }) {
  const instance = await api.institution.instance.get({ params });

  if (instance.parentInstanceId) {
    return (
      <Unauthorised
        message={`Can't fork an already forked ${spacesLabels.instance.short}`}
      />
    );
  }

  const takenNames = await api.institution.subGroup.takenInstanceNames({
    params,
  });

  const currentInstance = { instanceName: instance.displayName, ...instance };
  return (
    <div className="mb-40 mt-6 flex h-max w-full max-w-5xl flex-col gap-10 px-6 pb-20">
      <SubHeading>{adminTabs.forkInstance.title}</SubHeading>
      <ForkedInstanceForm
        currentInstance={currentInstance}
        takenNames={takenNames}
      />
    </div>
  );
}
