import { ListTodoIcon, ListVideoIcon } from "lucide-react";

import { SectionHeading, SubHeading } from "@/components/heading";
import { PanelWrapper } from "@/components/panel-wrapper";

import { api } from "@/lib/trpc/server";
import { InstanceParams } from "@/lib/validations/params";

import { AlgorithmDataTable } from "./_components/algorithm-data-table";
import { AlgorithmResultDataTable } from "./_components/algorithm-result-data-table";
import { NewAlgorithmSection } from "./_components/new-algorithm-section";

import { app, metadataTitle } from "@/content/config/app";
import { pages } from "@/content/pages";

export async function generateMetadata({ params }: { params: InstanceParams }) {
  const { displayName } = await api.institution.instance.get({ params });

  return {
    title: metadataTitle([pages.algorithms.title, displayName, app.name]),
  };
}

export default async function Page({ params }: { params: InstanceParams }) {
  const selectedAlgName = await api.institution.instance.selectedAlgName({
    params,
  });

  const takenNames = await api.institution.instance.algorithm.takenNames({
    params,
  });

  return (
    <PanelWrapper className="mt-10 flex flex-col items-start gap-16 px-12">
      <SubHeading className="mb-4">{pages.algorithms.title}</SubHeading>
      <section className="flex w-full flex-col">
        <SectionHeading className="mb-2 flex items-center">
          <ListVideoIcon className="mr-2 h-6 w-6 text-indigo-500" />
          <span>Select Algorithms to run</span>
        </SectionHeading>
        <AlgorithmDataTable />
        <NewAlgorithmSection takenNames={takenNames} />
      </section>
      <section className="mt-10 flex w-full flex-col">
        <SectionHeading className="mb-2 flex items-center">
          <ListTodoIcon className="mr-2 h-6 w-6 text-indigo-500" />
          <span>Results Summary</span>
        </SectionHeading>
        <AlgorithmResultDataTable selectedAlg={selectedAlgName} />
      </section>
    </PanelWrapper>
  );
}
