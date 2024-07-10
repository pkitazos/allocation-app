import { SubHeading } from "@/components/heading";

import { api } from "@/lib/trpc/server";
import { InstanceParams } from "@/lib/validations/params";

import { spacesLabels } from "@/content/spaces";

import { ForkedInstanceForm } from "./_components/forked-instance-form";

export default async function Page({ params }: { params: InstanceParams }) {
  const instance = await api.institution.instance.get({ params });
  const takenNames = await api.institution.subGroup.takenNames({ params });

  const currentInstance = { instanceName: instance.displayName, ...instance };
  return (
    <div className="mb-40 mt-6 flex h-max w-full max-w-5xl flex-col gap-10 px-6 pb-20">
      <SubHeading>Fork {spacesLabels.instance.full} Details</SubHeading>
      <ForkedInstanceForm
        currentInstance={currentInstance}
        takenNames={takenNames}
      />
    </div>
  );
}
