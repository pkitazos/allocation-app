import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Unauthorised } from "@/components/unauthorised";
import { auth } from "@/lib/auth";
import { api } from "@/lib/trpc/server";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function Page({ params }: { params: { group: string } }) {
  const session = await auth();

  if (
    session &&
    session.user.role !== "SUPER_ADMIN" &&
    session.user.role !== "GROUP_ADMIN"
  ) {
    return (
      <Unauthorised message="You need to be a super-admin or group admin to access this page" />
    );
  }

  const { allocationSubGroups, groupAdmins, displayName, admin } =
    await api.institution.group.subGroupManagement.query(params);

  return (
    <div className="mt-6 flex w-full max-w-5xl flex-col gap-10 px-6">
      <h1 className="text-4xl">{displayName}</h1>
      <div className="my-10 flex flex-col gap-2 rounded-md bg-accent/50 px-5 pb-7 pt-5">
        <h3 className="mb-3 text-2xl underline">Group Admins</h3>
        {groupAdmins.length !== 0 &&
          groupAdmins.map(({ name, email }, i) => (
            <div className="flex items-center gap-5" key={i}>
              <div className="w-1/6 font-medium">{name}</div>
              <Separator orientation="vertical" />
              <div className="w-/4">{email}</div>
              {admin === "SUPER_ADMIN" && (
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

      <h2 className="text-3xl">Manage Allocation Sub-Groups</h2>

      <div className="flex w-full flex-col gap-6">
        <Link href={`/${params.group}/create-sub-group`} className="w-fit">
          <Button
            variant="outline"
            className="h-20 w-40 rounded-lg bg-accent/60 hover:bg-accent"
          >
            <Plus className="h-6 w-6 stroke-[3px]" />
          </Button>
        </Link>

        <div className="grid grid-cols-3 gap-6">
          {allocationSubGroups.map((subGroup, i) => (
            <Link
              className="col-span-1"
              href={`/${params.group}/${subGroup.slug}`}
              key={i}
            >
              <Button
                className="h-20 w-full text-base font-semibold"
                variant="outline"
                size="lg"
              >
                {subGroup.displayName}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
