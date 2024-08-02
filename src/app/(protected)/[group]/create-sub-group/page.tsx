import { Unauthorised } from "@/components/unauthorised";

import { api } from "@/lib/trpc/server";

import { FormSection } from "./_components/form-section";
import { spacesLabels } from "@/content/spaces";
import { Heading } from "@/components/heading";

export default async function Page({ params }: { params: { group: string } }) {
  const access = await api.institution.group.access({ params });

  if (!access) {
    return (
      <Unauthorised message="You need to be a super-admin or group admin to access this page" />
    );
  }

  const takenNames = await api.institution.group.takenSubGroupNames({ params });

  return (
    <div className="mb-40 mt-6 flex h-max w-full max-w-5xl flex-col gap-10 px-6 pb-20">
      <Heading className="text-4xl">
        Create new {spacesLabels.subGroup.full}
      </Heading>
      <FormSection takenNames={takenNames} params={params} />
    </div>
  );
}
