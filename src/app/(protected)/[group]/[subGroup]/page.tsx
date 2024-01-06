import { Separator } from "@/components/ui/separator";
import { ClientSection } from "./client-section";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { api } from "@/lib/trpc/server";
import { Unauthorised } from "@/components/unauthorised";

export default async function Page({
  params,
}: {
  params: { group: string; subGroup: string };
}) {
  const session = await auth();

  if (
    session &&
    session.user.role !== "SUPER_ADMIN" &&
    session.user.role !== "GROUP_ADMIN" &&
    session.user.role !== "SUB_GROUP_ADMIN"
  ) {
    return (
      <Unauthorised message="You need to be an admin to access this page" />
    );
  }

  const { subGroupAdmins, allocationInstances, displayName, admin } =
    await api.institution.subGroup.instanceManagement.query(params);

  return (
    <div className="mt-6 flex w-full max-w-5xl flex-col gap-10 px-6">
      <h1 className="text-4xl">{displayName}</h1>
      <div className="my-10 flex flex-col gap-2 rounded-md bg-accent/50 px-5 pb-7 pt-5">
        <h3 className="mb-3 text-2xl underline">Sub-Group Admins</h3>
        {subGroupAdmins.map(({ name, email }, i) => (
          <div className="flex items-center gap-5" key={i}>
            <div className="w-1/6 font-medium">{name}</div>
            <Separator orientation="vertical" />
            <div className="w-/4">{email}</div>
            {(admin === "SUPER_ADMIN" || admin === "GROUP_ADMIN") && (
              <>
                <Separator orientation="vertical" />
                <Button className="ml-8" variant="destructive">
                  remove
                </Button>
              </>
            )}
          </div>
        ))}
      </div>
      <h2 className="text-3xl">Manage Allocation Instances</h2>
      <div className="flex w-full flex-col gap-6">
        <ClientSection instances={allocationInstances} />
      </div>
    </div>
  );
}
