import { prisma } from "@/lib/prisma";
import { ClientSection } from "./client-section";
import { Unauthorised } from "@/components/unauthorised";
import { auth } from "@/lib/auth";

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

  const allocationSubGroups = await prisma.allocationSubGroup.findMany({
    where: {
      allocationGroup: {
        slug: params.groupName,
      },
    },
  });

  return (
    <div className="mt-6 flex flex-col gap-10 px-6">
      <h2 className="text-4xl">Manage Sub-Groups</h2>
      <div className="flex w-full flex-col gap-6">
        <ClientSection subGroups={allocationSubGroups} />
      </div>
    </div>
  );
}
