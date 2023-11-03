import { Separator } from "@/components/ui/separator";
import { Unauthorised } from "@/components/unauthorised";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { ClientSection } from "./client-section";
import { Button } from "@/components/ui/button";

export default async function Page({
  params,
}: {
  params: { groupName: string };
}) {
  const session = await auth();
  const user = session!.user;

  if (user.role !== "SUPER_ADMIN" && user.role !== "GROUP_ADMIN") {
    return (
      <Unauthorised message="You need to be a super-admin or group admin to access this page" />
    );
  }

  const currentAllocationGroup = await db.allocationGroup.findFirstOrThrow({
    where: {
      slug: params.groupName,
    },
  });

  currentAllocationGroup.id;

  const allocationSubGroups = await db.allocationSubGroup.findMany({
    where: {
      allocationGroupId: currentAllocationGroup.id,
    },
  });

  const groupAdmins = await db.groupAdmin.findFirst({
    where: {
      id: currentAllocationGroup.groupAdminId,
    },
  });

  return (
    <div className="mt-6 flex flex-col gap-10 px-6">
      <h1 className="text-4xl">{currentAllocationGroup.displayName}</h1>
      <div className="my-10 flex flex-col gap-2 rounded-md bg-accent/50 px-5 pb-7 pt-5">
        <h3 className="mb-3 text-2xl underline">Group Admins</h3>
        {[groupAdmins!].map(({ name, email }, i) => (
          <div className="flex items-center gap-5" key={i}>
            <div className="w-1/6 font-medium">{name}</div>
            <Separator orientation="vertical" />
            <div className="w-/4">{email}</div>
            {user.role === "SUPER_ADMIN" && (
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
        <ClientSection subGroups={allocationSubGroups} />
      </div>
    </div>
  );
}
