import { ZapIcon } from "lucide-react";

import { SectionHeading, SubHeading } from "@/components/heading";
import { PanelWrapper } from "@/components/panel-wrapper";
import { Card, CardContent } from "@/components/ui/card";

import { api } from "@/lib/trpc/server";
import { InstanceParams } from "@/lib/validations/params";
import { adminTabs } from "@/lib/validations/tabs/admin-panel";

import { AllocationDataTable } from "./_components/allocation-data-table";
import { ExportDataButton } from "./_components/export-button";

import { app, metadataTitle } from "@/content/config/app";
import { pages } from "@/content/pages";

export async function generateMetadata({ params }: { params: InstanceParams }) {
  const { displayName } = await api.institution.instance.get({ params });

  return {
    title: metadataTitle([pages.exportToCSV.title, displayName, app.name]),
  };
}

export default async function Page({ params }: { params: InstanceParams }) {
  const data = await api.institution.instance.matching.exportCsvData({
    params,
  });

  return (
    <PanelWrapper className="mt-10 flex flex-col gap-8 px-12">
      <SubHeading className="mb-6">{adminTabs.exportToCSV.title}</SubHeading>
      <section className="flex flex-col gap-5">
        <SectionHeading className="flex items-center">
          <ZapIcon className="mr-2 h-6 w-6 text-indigo-500" />
          <span>Quick Actions</span>
        </SectionHeading>
        <Card>
          <CardContent className="mt-6 flex items-center justify-between gap-10">
            <p>This will export all columns even if they are not in view</p>
            <ExportDataButton data={data} />
          </CardContent>
        </Card>
      </section>
      <AllocationDataTable data={data} />
    </PanelWrapper>
  );
}
