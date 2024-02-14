import { Role } from "@prisma/client";
import { Plus } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Unauthorised } from "@/components/unauthorised";
import { api } from "@/lib/trpc/server";
import { formatParamsAsPath } from "@/lib/utils/general/get-instance-path";
import { instanceParams } from "@/lib/validations/params";

export default async function Layout({
  params,
  children,
}: {
  params: instanceParams;
  children: ReactNode;
}) {
  const role = await api.user.role.query({ params });

  if (role !== Role.SUPERVISOR) {
    return (
      <Unauthorised message="You need to be a Supervisor to access this page" />
    );
  }

  const instancePath = formatParamsAsPath(params);

  return (
    <div className="grid w-full grid-cols-6">
      <div className="col-span-1 mt-28 flex justify-center border-r">
        <div className="flex h-max w-fit flex-col items-center gap-2 bg-transparent">
          <Button variant="secondary" className="w-full" asChild>
            <Link
              className="flex items-center gap-2"
              href={`${instancePath}/new-project`}
            >
              <Plus className="h-4 w-4" />
              <p>New Project</p>
            </Link>
          </Button>
        </div>
      </div>
      <section className="col-span-5 max-w-6xl pb-32">{children}</section>
    </div>
  );
}
