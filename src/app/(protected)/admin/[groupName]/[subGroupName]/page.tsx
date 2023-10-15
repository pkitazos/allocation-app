import { prisma } from "@/lib/prisma";
import { ClientSection } from "./client-section";
import { Separator } from "@/components/ui/separator";

export default async function Page({
  params,
}: {
  params: { subGroupName: string };
}) {
  const allocationInstances = await prisma.allocationInstance.findMany({
    where: {
      allocationSubGroup: {
        slug: params.subGroupName,
      },
    },
  });

  const currentSubGroup = await prisma.allocationSubGroup.findFirstOrThrow({
    where: { slug: params.subGroupName },
  });

  const subGroupAdmins = await prisma.subGroupAdmin.findFirstOrThrow({
    where: { allocationSubGroupId: currentSubGroup.id },
  });

  return (
    <div className="mt-6 flex flex-col gap-10 px-6">
      <h2 className="text-4xl">{currentSubGroup.displayName}</h2>
      <div className="my-6 flex flex-col gap-2">
        <h3 className="mb-3 text-2xl underline">Sub-Group Admins</h3>
        {[subGroupAdmins].map(({ name, email }, i) => (
          <div className="flex items-center gap-5" key={i}>
            <div className="w-1/6 font-medium">{name}</div>
            <Separator orientation="vertical" />
            <div className="w-/4">{email}</div>
          </div>
        ))}
      </div>
      <h2 className="text-4xl">Manage Allocation Instances</h2>
      <div className="flex w-full flex-col gap-6">
        <ClientSection instances={allocationInstances} />
      </div>
    </div>
  );
}
