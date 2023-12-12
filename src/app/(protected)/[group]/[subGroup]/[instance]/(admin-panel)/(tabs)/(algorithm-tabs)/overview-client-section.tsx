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
import { MatchingData, ServerResponseData } from "@/server/routers/algorithm";
import { toast } from "react-hot-toast";

export function OverviewClientSection({
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
          refetch();
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

  return (
    <div className="flex flex-col gap-5">
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
            <TableHead className="text-center">Profile</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Generous</TableCell>
            <TableCell className="text-center">
              {generousDataLoading
                ? "-"
                : generous &&
                  (Number.isNaN(generous.weight) ? "-" : generous.weight)}
            </TableCell>
            <TableCell className="text-center">
              {generousDataLoading
                ? "-"
                : generous &&
                  (Number.isNaN(generous.profile)
                    ? "-"
                    : `(${generous.profile.join(", ")})`)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Greedy</TableCell>
            <TableCell className="text-center">
              {greedyDataLoading
                ? "-"
                : greedy && (Number.isNaN(greedy.weight) ? "-" : greedy.weight)}
            </TableCell>
            <TableCell className="text-center">
              {greedyDataLoading
                ? "-"
                : greedy &&
                  (Number.isNaN(greedy.profile)
                    ? "-"
                    : `(${greedy.profile.join(", ")})`)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Minimum Cost</TableCell>
            <TableCell className="text-center">
              {minCostDataLoading
                ? "-"
                : minCost &&
                  (Number.isNaN(minCost.weight) ? "-" : minCost.weight)}
            </TableCell>
            <TableCell className="text-center">
              {minCostDataLoading
                ? "-"
                : minCost &&
                  (Number.isNaN(minCost.profile)
                    ? "-"
                    : `(${minCost.profile.join(", ")})`)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Greedy-Generous</TableCell>
            <TableCell className="text-center">
              {greedyGenDataLoading
                ? "-"
                : greedyGen &&
                  (Number.isNaN(greedyGen.weight) ? "-" : greedyGen.weight)}
            </TableCell>
            <TableCell className="text-center">
              {greedyGenDataLoading
                ? "-"
                : greedyGen &&
                  (Number.isNaN(greedyGen.profile)
                    ? "-"
                    : `(${greedyGen.profile.join(", ")})`)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
