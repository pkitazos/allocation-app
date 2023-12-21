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
  builtInAlg,
} from "@/server/routers/algorithm";
import { useState } from "react";
import { toast } from "react-hot-toast";

export function ClientSection({
  groupId,
  subGroupId,
  instanceId,
  matchingData,
}: {
  groupId: string;
  subGroupId: string;
  instanceId: string;
  matchingData: MatchingData;
}) {
  const [selectedMatching, setSelectedMatching] = useState<builtInAlg>();
  const { mutateAsync: selectMatchingAsync } =
    api.institution.instance.selectMatching.useMutation();

  const { isLoading: generousLoading, mutateAsync: runGenerousAsync } =
    api.algorithm.generous.useMutation();

  const { isLoading: greedyLoading, mutateAsync: runGreedyAsync } =
    api.algorithm.greedy.useMutation();

  const { isLoading: minCostLoading, mutateAsync: runMinCostAsync } =
    api.algorithm.minCost.useMutation();

  const { isLoading: greedyGenLoading, mutateAsync: runGreedyGenAsync } =
    api.algorithm.greedyGen.useMutation();

  const handleClick = async (
    mutateAsync: ({
      groupId,
      subGroupId,
      instanceId,
      matchingData,
    }: {
      groupId: string;
      subGroupId: string;
      instanceId: string;
      matchingData: MatchingData;
    }) => Promise<ServerResponseData | undefined>,
    refetch: () => void,
  ) => {
    toast.promise(
      mutateAsync({ groupId, subGroupId, instanceId, matchingData }).then(
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
  } = api.institution.instance.getAlgorithmResult.useQuery({
    algName: "generous",
    groupId,
    subGroupId,
    instanceId,
  });

  const {
    isLoading: greedyDataLoading,
    data: greedy,
    refetch: refetchGreedy,
  } = api.institution.instance.getAlgorithmResult.useQuery({
    algName: "greedy",
    groupId,
    subGroupId,
    instanceId,
  });
  const {
    isLoading: minCostDataLoading,
    data: minCost,
    refetch: refetchMinCost,
  } = api.institution.instance.getAlgorithmResult.useQuery({
    algName: "minimum-cost",
    groupId,
    subGroupId,
    instanceId,
  });
  const {
    isLoading: greedyGenDataLoading,
    data: greedyGen,
    refetch: refetchGreedyGen,
  } = api.institution.instance.getAlgorithmResult.useQuery({
    algName: "greedy-generous",
    groupId,
    subGroupId,
    instanceId,
  });

  const handleSelection = (algName: builtInAlg) => {
    toast.promise(
      selectMatchingAsync({
        oldAlgName: selectedMatching,
        algName,
        groupId,
        subGroupId,
        instanceId,
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
          onClick={() => handleClick(runGenerousAsync, refetchGenerous)}
        >
          run
        </Button>
      </div>
      <div className="flex justify-between gap-5">
        <p>Greedy - description</p>
        <Button
          disabled={greedyLoading}
          onClick={() => handleClick(runGreedyAsync, refetchGreedy)}
        >
          run
        </Button>
      </div>
      <div className="flex justify-between gap-5">
        <p>Minimum Cost - description</p>
        <Button
          disabled={minCostLoading}
          onClick={() => handleClick(runMinCostAsync, refetchMinCost)}
        >
          run
        </Button>
      </div>
      <div className="flex justify-between gap-5">
        <p>Greedy-Generous - description</p>
        <Button
          disabled={greedyGenLoading}
          onClick={() => handleClick(runGreedyGenAsync, refetchGreedyGen)}
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
  algName: builtInAlg;
  algDisplayName: string;
  selectedMatching: builtInAlg | undefined;
  handleSelection: (algName: builtInAlg) => void;
}) {
  // const selected = !isLoading && matching !== undefined && matching.selected;

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
