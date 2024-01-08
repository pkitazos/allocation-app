"use client";
import { useState } from "react";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/lib/trpc/client";
import {
  BuiltInAlg,
  MatchingData,
  builtInAlgSchema,
} from "@/lib/validations/algorithm";
import { instanceParams } from "@/lib/validations/params";
import { ResultsTableRow } from "./results-table-row";
import { RunAlgorithmButton } from "./run-algorithm-button";

export function ClientSection({
  params,
  matchingData,
}: {
  params: instanceParams;
  matchingData: MatchingData;
}) {
  const [selectedMatching, setSelectedMatching] = useState<BuiltInAlg>();

  const [
    { isLoading: generousLoading, data: generous, refetch: refetchGenerous },
    { isLoading: greedyLoading, data: greedy, refetch: refetchGreedy },
    { isLoading: minCostLoading, data: minCost, refetch: refetchMinCost },
    { isLoading: greedyGenLoading, data: greedyGen, refetch: refetchGreedyGen },
  ] = api.useQueries((t) =>
    builtInAlgSchema.options.map((algName) =>
      t.institution.instance.singleAlgorithmResult({
        params,
        algName,
      }),
    ),
  );

  return (
    <div className="flex w-full flex-col gap-5">
      <RunAlgorithmButton
        params={params}
        matchingData={matchingData}
        algDisplayName={"Generous"}
        algName={"generous"}
        refetch={refetchGenerous}
      />
      <RunAlgorithmButton
        params={params}
        matchingData={matchingData}
        algDisplayName={"Greedy"}
        algName={"greedy"}
        refetch={refetchGreedy}
      />
      <RunAlgorithmButton
        params={params}
        matchingData={matchingData}
        algDisplayName={"Minimum Cost"}
        algName={"minimum-cost"}
        refetch={refetchMinCost}
      />
      <RunAlgorithmButton
        params={params}
        matchingData={matchingData}
        algDisplayName={"Greedy-Generous"}
        algName={"greedy-generous"}
        refetch={refetchGreedyGen}
      />
      <h2 className="mb-6 mt-16 text-2xl font-semibold">Results Summary</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">Matching Type</TableHead>
            <TableHead className="text-center">Weight</TableHead>
            <TableHead className="w-fit min-w-[8rem] text-center">
              Profile
            </TableHead>
            <TableHead className="w-32 text-center">&nbsp;</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <ResultsTableRow
            isLoading={generousLoading}
            matching={generous}
            algName={"generous"}
            algDisplayName={"Generous"}
            params={params}
            selectedMatching={selectedMatching}
            setSelectedMatching={setSelectedMatching}
          />
          <ResultsTableRow
            isLoading={greedyLoading}
            matching={greedy}
            algName={"greedy"}
            algDisplayName={"Greedy"}
            params={params}
            selectedMatching={selectedMatching}
            setSelectedMatching={setSelectedMatching}
          />
          <ResultsTableRow
            isLoading={minCostLoading}
            matching={minCost}
            algName={"minimum-cost"}
            algDisplayName={"Minimum Cost"}
            params={params}
            selectedMatching={selectedMatching}
            setSelectedMatching={setSelectedMatching}
          />
          <ResultsTableRow
            isLoading={greedyGenLoading}
            matching={greedyGen}
            algName={"greedy-generous"}
            algDisplayName={"Greedy-Generous"}
            params={params}
            selectedMatching={selectedMatching}
            setSelectedMatching={setSelectedMatching}
          />
        </TableBody>
      </Table>
    </div>
  );
}
