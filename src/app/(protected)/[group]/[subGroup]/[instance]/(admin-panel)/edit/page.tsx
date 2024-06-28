import { Unauthorised } from "@/components/unauthorised";

import { api } from "@/lib/trpc/server";
import { InstanceParams, SubGroupParams } from "@/lib/validations/params";

import { FormSection } from "./_components/form-section";
import { spacesLabels } from "@/content/space-labels";
import { SubHeading } from "@/components/heading";

export default async function Page({ params }: { params: InstanceParams }) {
  const access = await api.institution.subGroup.access({ params });

  if (!access) {
    return (
      <Unauthorised message="You need to be a super-admin or group admin to access this page" />
    );
  }

  const currentInstance = await api.institution.instance.getEditFormDetails({
    params,
  });

  const takenNames = await api.institution.subGroup.takenNames({
    params,
  });

  return (
    <div className="mb-40 mt-6 flex h-max w-full max-w-5xl flex-col gap-10 px-6 pb-20">
      <SubHeading>Edit {spacesLabels.instance.full}</SubHeading>
      <FormSection
        currentInstance={currentInstance as any}
        takenNames={takenNames}
        params={params}
      />
    </div>
  );
}
