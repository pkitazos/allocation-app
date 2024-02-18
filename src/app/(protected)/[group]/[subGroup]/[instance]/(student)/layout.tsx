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

export default async function Layout({
  params,
  children,
}: {
  params: InstanceParams;
  children: ReactNode;
}) {
  const role = await api.user.role.query({ params });
  const stage = await api.institution.instance.currentStage.query({ params });

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
          <Button variant="outline" className="w-full" asChild>
            <Link className="flex items-center gap-2" href={instancePath}>
              <Home className="h-4 w-4" />
              <p>Home</p>
            </Link>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href={`${instancePath}/my-preferences`}>My Preferences</Link>
          </Button>
          {stage === Stage.ALLOCATION_PUBLICATION && (
            <Button variant="outline" className="w-full" asChild>
              <Link href={`${instancePath}/my-allocation`}>My Allocation</Link>
            </Button>
          )}
        </div>
      </div>
      <section className="col-span-5 max-w-6xl pb-32">{children}</section>
    </div>
  );
}
