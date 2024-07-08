import { ReactNode } from "react";
import { Role, Stage } from "@prisma/client";
import { Home, Plus } from "lucide-react";
import Link from "next/link";

import { AccessControl } from "@/components/access-control";
import { Button } from "@/components/ui/button";
import { Unauthorised } from "@/components/unauthorised";

import { api } from "@/lib/trpc/server";
import { formatParamsAsPath } from "@/lib/utils/general/get-instance-path";
import { instanceTabs } from "@/lib/validations/instance-tabs";
import { InstanceParams } from "@/lib/validations/params";
import { AccessControl } from "@/components/access-control";

export default async function Layout({
  params,
  children,
}: {
  params: InstanceParams;
  children: ReactNode;
}) {
  const role = await api.user.role({ params });

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
          <Button variant="outline" className="w-full" asChild>
            <Link className="flex items-center gap-2" href={instancePath}>
              <Home className="h-4 w-4" />
              <p>{instanceTabs.instanceHome.title}</p>
            </Link>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href={`${instancePath}/${instanceTabs.myProjects.href}`}>
              {instanceTabs.myProjects.title}
            </Link>
          </Button>
          <AccessControl allowedStages={[Stage.PROJECT_SUBMISSION]}>
            <Button variant="secondary" className="w-full" asChild>
              <Link
                className="flex items-center gap-2"
                href={`${instancePath}/${instanceTabs.newProject.href}`}
              >
                <Plus className="h-4 w-4" />
                <p>{instanceTabs.newProject.title}</p>
              </Link>
            </Button>
          </AccessControl>
          <AccessControl allowedStages={[Stage.ALLOCATION_PUBLICATION]}>
            <Button variant="outline" className="w-full" asChild>
              <Link href={`${instancePath}/${instanceTabs.myAllocations.href}`}>
                {instanceTabs.myAllocations.title}
              </Link>
            </Button>
          </AccessControl>
        </div>
      </div>
      <section className="col-span-5 max-w-6xl pb-32">{children}</section>
    </div>
  );
}
