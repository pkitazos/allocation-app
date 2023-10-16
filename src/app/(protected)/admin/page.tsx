import { Separator } from "@/components/ui/separator";
import { Unauthorised } from "@/components/unauthorised";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ClientSection } from "./client-section";

export default async function AdminPanel() {
  const session = await auth();
  const user = session!.user;

  if (user.role !== "SUPER_ADMIN") {
    return (
      <Unauthorised message="You need to be a super-admin to access this page" />
    );
  }

  const allocationGroups = await prisma.allocationGroup.findMany({});

  const superAdmins = await prisma.superAdmin.findMany({});

  return (
    <div className="mt-6 flex flex-col gap-10 px-6">
      <h1 className="text-4xl">University of Glasgow</h1>
      <div className="my-10 flex flex-col gap-2 rounded-md bg-accent/50 px-5 pb-7 pt-5">
        <h3 className="mb-4 text-2xl underline">Super-Admins</h3>
        {superAdmins.map(({ name, email }, i) => (
          <div className="flex items-center gap-5" key={i}>
            <div className="w-1/6 font-medium">{name}</div>
            <Separator orientation="vertical" />
            <div className="w-/4">{email}</div>
          </div>
        ))}
      </div>

      <h2 className="text-3xl">Manage Allocation Groups</h2>
      <div className="flex w-full flex-col gap-6">
        <ClientSection groups={allocationGroups} />
      </div>
    </div>
  );
}
