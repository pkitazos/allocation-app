import { Stage } from "@prisma/client";
import Link from "next/link";
import { ReactNode } from "react";

import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { api } from "@/lib/trpc/server";
import { formatParamsAsPath } from "@/lib/utils/general/get-instance-path";
import { slugify } from "@/lib/utils/general/slugify";
import { InstanceParams } from "@/lib/validations/params";

const tabsRecord: Record<Stage, string[]> = {
  SETUP: ["Add Supervisors", "Add Students"],
  PROJECT_SUBMISSION: ["Invite Supervisors", "Projects Overview"],
  PROJECT_SELECTION: ["Invite Students", "Preferences Overview"],
  PROJECT_ALLOCATION: ["Algorithms Overview", "Algorithm Details"],
  ALLOCATION_ADJUSTMENT: ["Manual Changes"],
  ALLOCATION_PUBLICATION: ["Allocation Overview"],
};

export default async function Layout({
  params,
  children,
}: {
  params: InstanceParams;
  children: ReactNode;
}) {
  const instancePath = formatParamsAsPath(params);
  const stage = await api.institution.instance.currentStage.query({ params });
  const tabs = tabsRecord[stage];

  return (
    <div className="grid w-full grid-cols-6">
      <div className="col-span-1 mt-28 flex justify-center border-r">
        <div className="flex h-max w-fit flex-col items-center gap-2 bg-transparent">
          <Button variant="outline" className="w-full" asChild>
            <Link href={instancePath}>Stage Control</Link>
          </Button>
          <Separator className="my-1 w-3/4" />
          {tabs.map((tab, i) => (
            <Button key={i} variant="outline" className="w-full" asChild>
              <Link href={`${instancePath}/${slugify(tab)}`}>{tab}</Link>
            </Button>
          ))}
        </div>
      </div>
      <section className="col-span-5 max-w-6xl pb-32">
        <Heading>{params.instance}</Heading>
        {children}
      </section>
    </div>
  );
}
