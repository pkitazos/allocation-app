import { ReactNode } from "react";
import { Role, Stage } from "@prisma/client";
import { Home } from "lucide-react";
import Link from "next/link";

import { AccessControl } from "@/components/access-control";
import { Button } from "@/components/ui/button";
import { Unauthorised } from "@/components/unauthorised";

import { api } from "@/lib/trpc/server";
import { formatParamsAsPath } from "@/lib/utils/general/get-instance-path";
import { stageLt } from "@/lib/utils/permissions/stage-check";
import { instanceTabs } from "@/lib/validations/instance-tabs";
import { InstanceParams } from "@/lib/validations/params";

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

  if (stageLt(stage, Stage.PROJECT_SELECTION)) {
    return (
      <Unauthorised message="You are not allowed to access the platform at this time" />
    );
  }

  const preAllocatedTitle = await api.user.student.isPreAllocated({ params });
  const showPrefs = (preAllocatedTitle === null);

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
          <SideButton
            title={instanceTabs.myPreferences.title}
            href={`${instancePath}/${instanceTabs.myPreferences.href}`}
            show={showPrefs}
          />
          <AccessControl allowedStages={[Stage.ALLOCATION_PUBLICATION]}>
            <SideButton
              title={instanceTabs.myAllocation.title}
              href={`${instancePath}/${instanceTabs.myAllocation.href}`}
            />
          </AccessControl>
        </div>
      </div>
      <section className="col-span-5 max-w-6xl pb-32">{children}</section>
    </div>
  );
}

function SideButton({ title, href, show }) {
  if (show) {
    return (
      <Button variant="outline" className="w-full" asChild>
        <Link href={href}>
          {title}
        </Link>
      </Button>
    )
  }
  return
}
