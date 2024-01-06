import { Separator } from "@/components/ui/separator";
import { api } from "@/lib/trpc/server";
import { ClientSection } from "./client-section";

export default async function Page() {
  const allocationGroups = await api.institution.getAllGroups.query();

  const superAdmin = await api.institution.getSuperAdmin.query();

  return (
    <div className="mt-6 flex flex-col gap-10 px-6 pb-20">
      <h1 className="text-4xl">University of Glasgow</h1>
      <div className="my-10 flex flex-col gap-2 rounded-md bg-accent/50 px-5 pb-7 pt-5">
        <h3 className="mb-4 text-2xl underline">Super-Admins</h3>
        <div className="flex items-center gap-5">
          <div className="w-1/6 font-medium">{superAdmin.name}</div>
          <Separator orientation="vertical" />
          <div className="w-/4">{superAdmin.email}</div>
        </div>
      </div>

      <h2 className="text-3xl">Manage Allocation Groups</h2>
      <div className="flex w-full flex-col gap-6">
        <ClientSection allocationGroups={allocationGroups} />
      </div>
    </div>
  );
}
