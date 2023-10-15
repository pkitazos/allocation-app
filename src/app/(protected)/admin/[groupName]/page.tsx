import { Separator } from "@/components/ui/separator";
import { Unauthorised } from "@/components/unauthorised";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ClientSection } from "./client-section";

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

  const currentAllocationGroup = await prisma.allocationGroup.findFirstOrThrow({
    where: {
      slug: params.groupName,
    },
  });

  currentAllocationGroup.id;

  const allocationSubGroups = await prisma.allocationSubGroup.findMany({
    where: {
      allocationGroupId: currentAllocationGroup.id,
    },
  });

  const groupAdmins = await prisma.groupAdmin.findFirst({
    where: {
      id: currentAllocationGroup.groupAdminId,
    },
  });

  return (
    <div className="mt-6 flex flex-col gap-10 px-6">
      <h2 className="text-4xl">{currentAllocationGroup.displayName}</h2>
      <div className="my-6 flex flex-col gap-2">
        <h3 className="mb-3 text-2xl underline">Group Admins</h3>
        {[groupAdmins!].map(({ name, email }, i) => (
          <div className="flex items-center gap-5" key={i}>
            <div className="w-1/6 font-medium">{name}</div>
            <Separator orientation="vertical" />
            <div className="w-/4">{email}</div>
          </div>
        ))}
      </div>
      <h2 className="text-4xl">Manage Allocation Sub-Groups</h2>
      <div className="flex w-full flex-col gap-6">
        <ClientSection subGroups={allocationSubGroups} />
      </div>
    </div>
  );
}
