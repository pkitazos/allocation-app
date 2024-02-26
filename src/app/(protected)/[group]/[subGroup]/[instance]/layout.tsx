import { DataTableProvider } from "@/components/data-table-context";
import { InstanceParamsProvider } from "@/components/params-context";
import { Unauthorised } from "@/components/unauthorised";

import { api } from "@/lib/trpc/server";
import { InstanceParams } from "@/lib/validations/params";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: InstanceParams;
}) {
  const access = await api.institution.instance.access({ params });

  if (!access) {
    return (
      <Unauthorised message="You are not allowed to access the platform at this time" />
    );
  }

  const stage = await api.institution.instance.currentStage({ params });
  const { flags, tags } = await api.project.details({ params });

  return (
    <InstanceParamsProvider params={{ params, stage }}>
      <DataTableProvider details={{ flags, tags }}>
        {children}
      </DataTableProvider>
    </InstanceParamsProvider>
  );
}
