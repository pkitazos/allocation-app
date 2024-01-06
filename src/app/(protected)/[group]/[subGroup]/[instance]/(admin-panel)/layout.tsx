import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Unauthorised } from "@/components/unauthorised";
import { auth } from "@/lib/auth";
import { api } from "@/lib/trpc/server";
import { slugify } from "@/lib/utils";
import { Stage } from "@prisma/client";
import Link from "next/link";

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
  params: { group: string; subGroup: string; instance: string };
  children: React.ReactNode;
}) {
  const { group, subGroup, instance } = params;
  const session = await auth();
  console.log("session", session);

  if (
    session &&
    session.user.role !== "SUPER_ADMIN" &&
    session.user.role !== "GROUP_ADMIN" &&
    session.user.role !== "SUB_GROUP_ADMIN"
  ) {
    return (
      <Unauthorised message="You need to be a super-admin or group admin to access this page" />
    );
  }

  const stage = await api.institution.instance.currentStage.query(params);

  const tabs = tabsRecord[stage];
  return (
    <div className="grid w-full grid-cols-6">
      <div className="col-span-1 mt-28 flex justify-center border-r">
        <div className="flex h-max w-fit flex-col items-center gap-2 bg-transparent">
          <Button variant="outline" className="w-full" asChild>
            <Link href={`/${group}/${subGroup}/${instance}`}>
              Stage Control
            </Link>
          </Button>
          <Separator className="my-1 w-3/4" />
          {tabs.map((tab, i) => (
            <Button key={i} variant="outline" className="w-full" asChild>
              <Link href={`/${group}/${subGroup}/${instance}/${slugify(tab)}`}>
                {tab}
              </Link>
            </Button>
          ))}
        </div>
      </div>
      <section className="col-span-5 max-w-6xl">
        <Heading title={instance} />
        {children}
      </section>
    </div>
  );
}
