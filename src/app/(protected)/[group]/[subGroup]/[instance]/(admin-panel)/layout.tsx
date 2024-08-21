import { ReactNode } from "react";
import Link from "next/link";

import { Heading } from "@/components/heading";
import { Icon } from "@/components/icons/sidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Unauthorised } from "@/components/unauthorised";

import { api } from "@/lib/trpc/server";
import { formatParamsAsPath } from "@/lib/utils/general/get-instance-path";
import { InstanceParams } from "@/lib/validations/params";

export default async function Layout({
  params,
  children,
}: {
  params: InstanceParams;
  children: ReactNode;
}) {
  const access = await api.ac.adminInInstance({ params });
  if (!access) {
    // could potentially throw error as this should be caught by the layout one level up
    return (
      <Unauthorised message="You need to be an admin to access this page" />
    );
  }

  const instancePath = formatParamsAsPath(params);
  const instance = await api.institution.instance.get({ params });
  const tabs = await api.institution.instance.adminPanelTabs({ params });

  return (
    <div className="grid w-full grid-cols-6">
      <div className="col-span-1 mt-28 flex justify-center border-r pr-2.5">
        <div className="flex h-max w-fit flex-col items-center gap-2 bg-transparent">
          <Button variant="outline" asChild>
            <Link
              href={`${instancePath}/settings`}
              className="flex w-full items-center gap-2"
            >
              <Icon type="settings" />
              <p>Settings</p>
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={instancePath} className="w-full">
              Stage Control
            </Link>
          </Button>
          <Separator className="my-1 w-3/4" />
          {tabs.map(({ title, href, actionType }, i) => (
            <Button
              key={i}
              variant={actionType ? "secondary" : "outline"}
              asChild
            >
              <Link
                href={`${instancePath}/${href}`}
                className="flex w-full items-center gap-2 py-3 text-center"
              >
                {actionType && <Icon type={actionType} />}
                {title}
              </Link>
            </Button>
          ))}
        </div>
      </div>
      <section className="col-span-5 max-w-6xl pb-32">
        <Heading>{instance.displayName}</Heading>
        {children}
      </section>
    </div>
  );
}
