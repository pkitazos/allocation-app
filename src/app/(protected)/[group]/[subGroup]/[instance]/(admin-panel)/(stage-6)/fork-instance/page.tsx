import { SubHeading } from "@/components/heading";

import { api } from "@/lib/trpc/server";
import { InstanceParams } from "@/lib/validations/params";

import { ForkedInstanceForm } from "./_components/forked-instance-form";

import { spacesLabels } from "@/content/spaces";

export default async function Page({ params }: { params: InstanceParams }) {
  const currentInstance = await api.institution.instance.get({ params });

  const takenNames = await api.institution.subGroup.takenNames({ params });

  const formInstance = {
    ...currentInstance,
    instanceName: currentInstance.displayName,
  };
  return (
    <div className="mb-40 mt-6 flex h-max w-full max-w-5xl flex-col gap-10 px-6 pb-20">
      <SubHeading>Fork {spacesLabels.instance.full} Details</SubHeading>
      <ForkedInstanceForm
        currentInstance={formInstance}
        takenNames={takenNames}
      />
    </div>
  );
}
