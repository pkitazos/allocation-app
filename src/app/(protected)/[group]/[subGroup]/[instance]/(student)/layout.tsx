import { ReactNode } from "react";
import { Role, Stage } from "@prisma/client";
import { Home } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Unauthorised } from "@/components/unauthorised";

import { api } from "@/lib/trpc/server";
import { formatParamsAsPath } from "@/lib/utils/general/get-instance-path";
import { stageCheck } from "@/lib/utils/permissions/stage-check";
import { InstanceParams } from "@/lib/validations/params";
import { instanceTabs } from "@/lib/validations/instance-tabs";
import { AccessControl } from "@/components/access-control";

export default async function Layout({
  params,
  children,
}: {
  params: InstanceParams;
  children: ReactNode;
}) {
  const role = await api.user.role({ params });
  const stage = await api.institution.instance.currentStage({ params });

  if (role !== Role.STUDENT) {
    return (
      <Unauthorised message="You need to be a Student to access this page" />
    );
  }
  if (!stageCheck(stage, Stage.PROJECT_SELECTION)) {
    return (
      <Unauthorised message="You are not allowed to access the platform at this time" />
    );
  }

  const instancePath = formatParamsAsPath(params);

  return (
    <div className="grid w-full grid-cols-6">
      <div className="col-span-1 mt-28 flex justify-center border-r">
        <div className="flex h-max w-fit flex-col items-center gap-2 bg-transparent">
          <Button variant="outline" asChild>
            <Link className="flex items-center gap-2" href={instancePath}>
              <Home className="h-4 w-4" />
              <p>{instanceTabs.instanceHome.title}</p>
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link
              className="w-full"
              href={`${instancePath}/${instanceTabs.myPreferences.href}`}
            >
              {instanceTabs.myPreferences.title}
            </Link>
          </Button>
          <AccessControl allowedStages={[Stage.ALLOCATION_PUBLICATION]}>
            <Button variant="outline" asChild>
              <Link
                className="w-full"
                href={`${instancePath}/${instanceTabs.myAllocation.href}`}
              >
                {instanceTabs.myAllocation.title}
              </Link>
            </Button>
          </AccessControl>
        </div>
      </div>
      <section className="col-span-5 max-w-6xl pb-32">{children}</section>
    </div>
  );
}
