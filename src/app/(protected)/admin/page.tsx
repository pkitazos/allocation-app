import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { api } from "@/lib/trpc/server";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function Page() {
  const { superAdmin, groups } = await api.institution.groupManagement.query();

  return (
    <div className="mt-6 flex w-full max-w-5xl flex-col gap-10 px-6 pb-20">
      <h1 className="text-4xl">University of Glasgow</h1>

      <div className="my-10 flex min-h-40 flex-col gap-2 rounded-md bg-accent/50 px-5 pb-7 pt-5">
        <h3 className="mb-4 text-2xl underline">Super-Admins</h3>
        <div className="flex h-9 items-center gap-5">
          <div className="w-1/6 font-medium">{superAdmin.name}</div>
          <Separator orientation="vertical" />
          <div className="w-/4">{superAdmin.email}</div>
        </div>
      </div>

      <h2 className="text-3xl">Manage Allocation Groups</h2>

      <div className="flex w-full flex-col gap-6">
        <Link href="/admin/create-group" className="w-fit">
          <Button
            variant="outline"
            className="h-20 w-40 rounded-lg bg-accent/60 hover:bg-accent"
          >
            <Plus className="h-6 w-6 stroke-[3px]" />
          </Button>
        </Link>

        <div className="grid w-full grid-cols-3 gap-6">
          {groups.map((group, i) => (
            <Link className="col-span-1" href={`/${group.id}`} key={i}>
              <Button
                className="h-20 w-full text-base font-semibold"
                variant="outline"
                size="lg"
              >
                {group.displayName}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
