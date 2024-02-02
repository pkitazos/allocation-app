import { Unauthorised } from "@/components/unauthorised";
import { auth } from "@/lib/auth";
import { FormSection } from "./form-section";
import { api } from "@/lib/trpc/server";

export default async function Page({ params }: { params: { group: string } }) {
  const session = await auth();

  // TODO: add persmission level check
  if (session && session.user.role !== "ADMIN") {
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
