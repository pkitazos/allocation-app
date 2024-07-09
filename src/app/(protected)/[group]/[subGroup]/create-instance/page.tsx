import { Unauthorised } from "@/components/unauthorised";
import { Heading } from "@/components/heading";

import { api } from "@/lib/trpc/server";
import { SubGroupParams } from "@/lib/validations/params";

import { spacesLabels } from "@/content/spaces";

import { CreateInstanceForm } from "./_components/create-instance-form";

export default async function Page({ params }: { params: SubGroupParams }) {
  const access = await api.institution.subGroup.access({ params });

  if (!access) {
    return (
      <Unauthorised message="You need to be a super-admin or group admin to access this page" />
    );
  }

  const takenNames = await api.institution.subGroup.takenNames({ params });

  return (
    <div className="mb-40 mt-6 flex h-max w-full max-w-5xl flex-col gap-10 px-6 pb-20">
      <Heading className="text-4xl">
        Create new {spacesLabels.instance.full}
      </Heading>
      <CreateInstanceForm params={params} takenNames={takenNames} />
    </div>
  );
}
