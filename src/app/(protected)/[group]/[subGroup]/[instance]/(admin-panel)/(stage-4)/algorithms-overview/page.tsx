import { api } from "@/lib/trpc/server";

import { instanceParams } from "@/lib/validations/params";
import { ResultsTable } from "./results-table";
import { RunAlgorithmButton } from "./run-algorithm-button";
import {
  GenerousAlgorithm,
  GreedyAlgorithm,
  GreedyGenAlgorithm,
  MinCostAlgorithm,
} from "@/lib/algorithms";

export default async function Page({ params }: { params: instanceParams }) {
  const matchingData =
    await api.institution.instance.matchingData.query(params);

  return (
    <div className="mt-20 flex flex-col items-center">
      <div className="flex min-w-[50%] flex-col gap-3">
        <h2 className="mb-6 text-2xl font-semibold">
          Select Algorithms to run
        </h2>
        <div className="flex w-full flex-col gap-5">
          <RunAlgorithmButton
            params={params}
            matchingData={matchingData}
            algorithm={GenerousAlgorithm}
          />
          <RunAlgorithmButton
            params={params}
            matchingData={matchingData}
            algorithm={GreedyAlgorithm}
          />
          <RunAlgorithmButton
            params={params}
            matchingData={matchingData}
            algorithm={MinCostAlgorithm}
          />
          <RunAlgorithmButton
            params={params}
            matchingData={matchingData}
            algorithm={GreedyGenAlgorithm}
          />
          <h2 className="mb-6 mt-16 text-2xl font-semibold">Results Summary</h2>
          <ResultsTable params={params} />
        </div>
      </div>
    </div>
  );
}
