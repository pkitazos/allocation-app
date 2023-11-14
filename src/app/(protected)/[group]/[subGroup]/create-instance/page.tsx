import { Unauthorised } from "@/components/unauthorised";
import { auth } from "@/lib/auth";
import { FormSection } from "./form-section";
import { api } from "@/lib/trpc/server";

export default async function Page({
  params: { group, subGroup },
}: {
  params: { group: string; subGroup: string };
}) {
  const session = await auth();
  const user = session!.user;

  if (user.role !== "SUPER_ADMIN" && user.role !== "GROUP_ADMIN") {
    return (
      <Unauthorised message="You need to be a super-admin to access this page" />
    );
  }

  const takenNames = await api.institution.subGroup.getAllSubGroupNames.query({
    groupSlug: group,
    subGroupSlug: subGroup,
  });

  return (
    <div className="mb-40 mt-6 flex w-full max-w-5xl flex-col gap-10 px-6">
      <h2 className="text-4xl">
        Create new{" "}
        <span className="font-semibold text-sky-500">Allocation Instance</span>
      </h2>
      <FormSection
        takenNames={takenNames}
        allocationGroupSlug={group}
        allocationSubGroupSlug={subGroup}
      />
    </div>
  );
}
