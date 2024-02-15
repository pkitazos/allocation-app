import {
  GenerousAlgorithm,
  GreedyAlgorithm,
  GreedyGenAlgorithm,
  MinCostAlgorithm,
} from "@/lib/algorithms";
import { api } from "@/lib/trpc/server";
import { instanceParams } from "@/lib/validations/params";
import {
  NewAlgorithmButton,
  ResultsTable,
  RunAlgorithmButton,
} from "./_components";

export default async function Page({ params }: { params: instanceParams }) {
  const { matchingData, selectedAlgName } =
    await api.institution.instance.matching.data.query({ params });

  const takenNames = await api.institution.instance.algorithm.takenNames.query({
    params,
  });

  const customAlgs = await api.institution.instance.algorithm.customAlgs.query({
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
            matchingData={matchingData}
            algorithm={GenerousAlgorithm}
          />
          <RunAlgorithmButton
            matchingData={matchingData}
            algorithm={GreedyAlgorithm}
          />
          <RunAlgorithmButton
            matchingData={matchingData}
            algorithm={GreedyGenAlgorithm}
          />
          <RunAlgorithmButton
            matchingData={matchingData}
            algorithm={MinCostAlgorithm}
          />
          {customAlgs.map((alg, i) => (
            // TODO: add ability to delete custom algorithms
            <RunAlgorithmButton
              key={i}
              matchingData={matchingData}
              algorithm={alg}
              custom
            />
          ))}
          <NewAlgorithmButton takenNames={takenNames} />
          <h2 className="mb-6 mt-16 text-2xl font-semibold">Results Summary</h2>
          <ResultsTable
            selectedAlgName={selectedAlgName}
            customAlgs={customAlgs}
          />
        </div>
      </div>
    </div>
  );
}
