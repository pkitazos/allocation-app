import {
  GenerousAlgorithm,
  GreedyAlgorithm,
  GreedyGenAlgorithm,
  MinCostAlgorithm,
} from "@/lib/algorithms";
import { api } from "@/lib/trpc/server";
import { instanceParams } from "@/lib/validations/params";
import { NewAlgorithmButton } from "./new-algorithm-button";
import { ResultsTable } from "./results-table";
import { RunAlgorithmButton } from "./run-algorithm-button";

export default async function Page({ params }: { params: instanceParams }) {
  const { matchingData, selectedAlgName } =
    await api.institution.instance.matchingData.query({ params });

  const takenNames = await api.institution.instance.takenAlgorithmNames.query({
    params,
  });

  const customAlgs = await api.institution.instance.customAlgs.query({
    params,
  });

  return (
    <div className="mt-20 flex flex-col items-center">
      <div className="flex min-w-[50%] flex-col gap-3">
        <h2 className="mb-6 text-2xl font-semibold">
          Select Algorithms to run
        </h2>
        <div className="flex w-[45rem] flex-col gap-5">
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
          {customAlgs.map((alg, i) => (
            // TODO: display configuration instead of description
            // TODO: add ability to delete custom algorithms
            <RunAlgorithmButton
              key={i}
              params={params}
              matchingData={matchingData}
              algorithm={alg}
            />
          ))}
          <NewAlgorithmButton params={params} takenNames={takenNames} />
          <h2 className="mb-6 mt-16 text-2xl font-semibold">Results Summary</h2>
          <ResultsTable
            selectedAlgName={selectedAlgName}
            params={params}
            customAlgs={customAlgs}
          />
        </div>
      </div>
    </div>
  );
}
