"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";
import {
  MatchingData,
  ServerResponseData,
  BuiltInAlg,
} from "@/server/routers/algorithm";
import { useState } from "react";
import { toast } from "sonner";

export function ClientSection({
  group,
  subGroup,
  instance,
  matchingData,
}: {
  group: string;
  subGroup: string;
  instance: string;
  matchingData: MatchingData;
}) {
  const [selectedMatching, setSelectedMatching] = useState<BuiltInAlg>();

  const { mutateAsync: selectMatchingAsync } =
    api.institution.instance.selectMatching.useMutation();

  const { isPending: generousLoading, mutateAsync: runGenerousAsync } =
    api.algorithm.run.useMutation();

  const { isPending: greedyLoading, mutateAsync: runGreedyAsync } =
    api.algorithm.run.useMutation();

  const { isPending: minCostLoading, mutateAsync: runMinCostAsync } =
    api.algorithm.run.useMutation();

  const { isPending: greedyGenLoading, mutateAsync: runGreedyGenAsync } =
    api.algorithm.run.useMutation();

  const handleClick = async (
    algorithm: BuiltInAlg,
    mutateAsync: ({
      group,
      subGroup,
      instance,
      algorithm,
      matchingData,
    }: {
      group: string;
      subGroup: string;
      instance: string;
      algorithm: BuiltInAlg;
      matchingData: MatchingData;
    }) => Promise<ServerResponseData | undefined>,
    refetch: () => void,
  ) => {
    toast.promise(
      mutateAsync({ group, subGroup, instance, algorithm, matchingData }).then(
        () => {
          console.log("from handleClick pre-refetch", generous);
          refetch();
          console.log("from handleClick post-prefetch", generous);
        },
      ),
      {
        loading: "Running...",
        error: "Something went wrong",
        success: "Succcess",
      },
    );
  };

  const {
    isLoading: generousDataLoading,
    data: generous,
    refetch: refetchGenerous,
  } = api.institution.instance.singleAlgorithmResult.useQuery({
    algName: "generous",
    group,
    subGroup,
    instance,
  });

  const {
    isLoading: greedyDataLoading,
    data: greedy,
    refetch: refetchGreedy,
  } = api.institution.instance.singleAlgorithmResult.useQuery({
    algName: "greedy",
    group,
    subGroup,
    instance,
  });

  const {
    isLoading: minCostDataLoading,
    data: minCost,
    refetch: refetchMinCost,
  } = api.institution.instance.singleAlgorithmResult.useQuery({
    algName: "minimum-cost",
    group,
    subGroup,
    instance,
  });

  const {
    isLoading: greedyGenDataLoading,
    data: greedyGen,
    refetch: refetchGreedyGen,
  } = api.institution.instance.singleAlgorithmResult.useQuery({
    algName: "greedy-generous",
    group,
    subGroup,
    instance,
  });

  const handleSelection = (algName: BuiltInAlg) => {
    toast.promise(
      selectMatchingAsync({
        oldAlgName: selectedMatching,
        algName,
        group,
        subGroup,
        instance,
      }).then(() => {
        setSelectedMatching(algName);
      }),
      {
        loading: "Running...",
        error: "Something went wrong",
        success: "Succcess",
      },
    );
  };

  return (
    <div className="flex w-full flex-col gap-5">
      <div className="flex justify-between gap-5">
        <p>Generous - description</p>
        <Button
          disabled={generousLoading}
          onClick={() =>
            handleClick("generous", runGenerousAsync, refetchGenerous)
          }
        >
          run
        </Button>
      </div>
      <div className="flex justify-between gap-5">
        <p>Greedy - description</p>
        <Button
          disabled={greedyLoading}
          onClick={() => handleClick("greedy", runGreedyAsync, refetchGreedy)}
        >
          run
        </Button>
      </div>
      <div className="flex justify-between gap-5">
        <p>Minimum Cost - description</p>
        <Button
          disabled={minCostLoading}
          onClick={() =>
            handleClick("minimum-cost", runMinCostAsync, refetchMinCost)
          }
        >
          run
        </Button>
      </div>
      <div className="flex justify-between gap-5">
        <p>Greedy-Generous - description</p>
        <Button
          disabled={greedyGenLoading}
          onClick={() =>
            handleClick("greedy-generous", runGreedyGenAsync, refetchGreedyGen)
          }
        >
          run
        </Button>
      </div>
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
            isLoading={generousDataLoading}
            matching={generous}
            algName={"generous"}
            algDisplayName={"Generous"}
            selectedMatching={selectedMatching}
            handleSelection={handleSelection}
          />
          <ResultsTableRow
            isLoading={greedyDataLoading}
            matching={greedy}
            algName={"greedy"}
            algDisplayName={"Greedy"}
            selectedMatching={selectedMatching}
            handleSelection={handleSelection}
          />
          <ResultsTableRow
            isLoading={minCostDataLoading}
            matching={minCost}
            algName={"minimum-cost"}
            algDisplayName={"Minimum Cost"}
            selectedMatching={selectedMatching}
            handleSelection={handleSelection}
          />
          <ResultsTableRow
            isLoading={greedyGenDataLoading}
            matching={greedyGen}
            algName={"greedy-generous"}
            algDisplayName={"Greedy-Generous"}
            selectedMatching={selectedMatching}
            handleSelection={handleSelection}
          />
        </TableBody>
      </Table>
    </div>
  );
}

function ResultsTableRow({
  isLoading,
  matching,
  algName,
  algDisplayName,
  selectedMatching,
  handleSelection,
}: {
  isLoading: boolean;
  matching: ServerResponseData | undefined;
  algName: BuiltInAlg;
  algDisplayName: string;
  selectedMatching: BuiltInAlg | undefined;
  handleSelection: (algName: BuiltInAlg) => void;
}) {
  return (
    <TableRow className="items-center">
      <TableCell className="font-medium">{algDisplayName}</TableCell>
      <TableCell className="text-center">
        {isLoading || !matching || Number.isNaN(matching.weight)
          ? "-"
          : matching.weight}
      </TableCell>
      <TableCell className="text-center">
        {isLoading || !matching || matching.profile.length === 0
          ? "-"
          : `(${matching.profile.join(", ")})`}
      </TableCell>
      <TableCell className="text-center">
        <Button
          variant={selectedMatching === algName ? "secondary" : "ghost"}
          className={cn()}
          onClick={() => handleSelection(algName)}
        >
          {selectedMatching === algName ? "Selected" : "Select"}
        </Button>
      </TableCell>
    </TableRow>
  );
}
