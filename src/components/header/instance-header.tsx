"use client";
import { useParams } from "next/navigation";

import { api } from "@/lib/trpc/client";
import { formatParamsAsPath } from "@/lib/utils/general/get-instance-path";
import { InstanceParams, instanceParamsSchema } from "@/lib/validations/params";

import { InstanceLink } from "./instance-link";

export function InstanceHeader() {
  const params = useParams<InstanceParams>();
  const instancePath = formatParamsAsPath(params);
  const result = instanceParamsSchema.safeParse(params);

  const tabsData = api.institution.instance.headerTabs.useQuery({ params });

  if (!result.success || !tabsData.isSuccess) return;

  const tabs = tabsData.data;

  return (
    <div className="mx-auto flex items-center justify-center gap-6">
      {tabs.map(({ href, title }, i) => (
        <InstanceLink key={i} href={`${instancePath}/${href}`}>
          {title}
        </InstanceLink>
      ))}
    </div>
  );
}
