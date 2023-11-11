import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/prisma";
import { ClientSection } from "./client-section";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";

export default async function Page({
  params,
}: {
  params: { subGroupName: string };
}) {
  const session = await auth();
  const user = session?.user;

  const allocationInstances = await db.allocationInstance.findMany({
    where: {
      allocationSubGroup: {
        slug: params.subGroupName,
      },
    },
  });

  const currentSubGroup = await db.allocationSubGroup.findFirstOrThrow({
    where: { slug: params.subGroupName },
  });

  const subGroupAdmins = await db.subGroupAdmin.findFirstOrThrow({
    where: { allocationSubGroupId: currentSubGroup.id },
  });

  return (
    <div className="mt-6 flex flex-col gap-10 px-6">
      <h1 className="text-4xl">{currentSubGroup.displayName}</h1>
      <div className="my-10 flex flex-col gap-2 rounded-md bg-accent/50 px-5 pb-7 pt-5">
        <h3 className="mb-3 text-2xl underline">Sub-Group Admins</h3>
        {[subGroupAdmins].map(({ name, email }, i) => (
          <div className="flex items-center gap-5" key={i}>
            <div className="w-1/6 font-medium">{name}</div>
            <Separator orientation="vertical" />
            <div className="w-/4">{email}</div>
            {(user!.role === "SUPER_ADMIN" || user!.role === "GROUP_ADMIN") && (
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
