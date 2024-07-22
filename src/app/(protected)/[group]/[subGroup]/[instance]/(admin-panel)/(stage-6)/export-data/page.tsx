import { SubHeading } from "@/components/heading";
import { PanelWrapper } from "@/components/panel-wrapper";

import { api } from "@/lib/trpc/server";
import { InstanceParams } from "@/lib/validations/params";

import { AllocationDataTable } from "./_components/allocation-data-table";
import { ExportDataButton } from "./_components/export-button";
import { SendDataSection } from "./_components/send-data-section";

export default async function Page({ params }: { params: InstanceParams }) {
  const data = await api.institution.instance.matching.exportData({ params });

  return (
    <PanelWrapper className="flex flex-col gap-5 pt-8">
      <SubHeading className="mt-3">Send Data to Assessment System</SubHeading>
      <SendDataSection data={data} />
      <SubHeading className="mt-3">Export Data to CSV</SubHeading>
      <ExportDataButton data={data} />
      <AllocationDataTable data={data} />
    </PanelWrapper>
  );
}
