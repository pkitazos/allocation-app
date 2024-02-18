import { Unauthorised } from "@/components/unauthorised";

import { api } from "@/lib/trpc/server";
import { SubGroupParams } from "@/lib/validations/params";

import { FormSection } from "./_components/form-section";

export default async function Page({ params }: { params: SubGroupParams }) {
  const access = await api.institution.subGroup.access.query({ params });

  if (!access) {
    return (
      <Unauthorised message="You need to be a super-admin or group admin to access this page" />
    );
  }

  const takenNames = await api.institution.subGroup.takenNames.query({
    params,
  });

  return (
    <div className="mb-40 mt-6 flex h-max w-full max-w-5xl flex-col gap-10 px-6 pb-20">
      <h2 className="text-4xl">
        Create new{" "}
        <span className="font-semibold text-sky-500">Allocation Instance</span>
      </h2>
      <FormSection takenNames={takenNames} params={params} />
    </div>
  );
}
