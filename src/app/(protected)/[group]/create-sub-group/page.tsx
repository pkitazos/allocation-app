import { Unauthorised } from "@/components/unauthorised";
import { api } from "@/lib/trpc/server";
import { FormSection } from "./form-section";

export default async function Page({ params }: { params: { group: string } }) {
  const access = await api.institution.spaceMembership.query({ params });

  if (!access) {
    return (
      <Unauthorised message="You need to be a super-admin or group admin to access this page" />
    );
  }

  const takenNames = await api.institution.group.takenNames.query({ params });

  return (
    <div className="mt-6 flex w-full max-w-5xl flex-col gap-10 px-6">
      <h2 className="text-4xl">
        Create New{" "}
        <span className="font-semibold text-sky-500">Allocation Sub-Group</span>
      </h2>
      <FormSection takenNames={takenNames} params={params} />
    </div>
  );
}
