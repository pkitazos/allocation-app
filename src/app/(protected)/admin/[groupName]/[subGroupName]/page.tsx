import { prisma } from "@/lib/prisma";
import { ClientSection } from "./client-section";

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

  return (
    <div className="mt-6 flex flex-col gap-10 px-6">
      <h2 className="text-4xl">Manage Sub-Groups</h2>
      <div className="flex w-full flex-col gap-6">
        <ClientSection instances={allocationInstances} />
      </div>
    </div>
  );
}
