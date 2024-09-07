import { SubHeading } from "@/components/heading";
import { PanelWrapper } from "@/components/panel-wrapper";

import { api } from "@/lib/trpc/server";
import { InstanceParams } from "@/lib/validations/params";

import { AlgorithmDataTable } from "./_components/algorithm-data-table";
import { AlgorithmResultDataTable } from "./_components/algorithm-result-data-table";
import { NewAlgorithmButton2 } from "./_components/new-algorithm-button-2";

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
    <PanelWrapper className="mt-20 flex flex-col items-center">
      <div className="flex w-full flex-col gap-3">
        <SubHeading className="mb-6">Select Algorithms to run</SubHeading>
        <div className="flex flex-col gap-5">
          <AlgorithmDataTable />
          <NewAlgorithmButton2 takenNames={takenNames} />
          <SubHeading className="mb-6 mt-16 text-2xl ">
            Results Summary
          </SubHeading>
          <AlgorithmResultDataTable selectedAlg={selectedAlgName} />
        </div>
      </div>
    </PanelWrapper>
  );
}
