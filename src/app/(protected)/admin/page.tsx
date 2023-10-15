import { auth } from "@/lib/auth";
import { ClientSection } from "./client-section";
import { prisma } from "@/lib/prisma";
import { Unauthorised } from "@/components/unauthorised";

export default async function AdminPanel() {
  const session = await auth();
  const user = session!.user;

  if (user.role !== "SUPER_ADMIN") {
    return (
      <Unauthorised message="You need to be a super-admin to access this page" />
    );
  }

  const allocationGroups = await prisma.allocationGroup.findMany({});

  return (
    <div className="mt-6 flex flex-col gap-10 px-6">
      <h2 className="text-4xl">Manage Groups</h2>
      <div className="flex w-full flex-col gap-6">
        <ClientSection groups={allocationGroups} />
      </div>
    </div>
  );
}
