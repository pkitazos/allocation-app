"use client";

import { Button } from "@/components/ui/button";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import { api } from "@/lib/trpc/client";
import { MatchingData } from "@/server/routers/algorithm";
import { toast } from "react-hot-toast";

export function ClientSection({
  matchingData,
}: {
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
    mutateAsync: (data: MatchingData) => Promise<void>,
  ) => {
    toast.promise(mutateAsync(matchingData), {
      loading: "Running...",
      error: "Something went wrong",
      success: "Succcess",
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between gap-5">
        <p>Generous - description</p>
        <Button
          disabled={generousLoading}
          onClick={() => handleClick(runGenerousAsync)}
        >
          run
        </Button>
      </div>
      <div className="flex justify-between gap-5">
        <p>Greedy - description</p>
        <Button
          disabled={greedyLoading}
          onClick={() => handleClick(runGreedyAsync)}
        >
          run
        </Button>
      </div>
      <div className="flex justify-between gap-5">
        <p>Minimum Cost - description</p>
        <Button
          disabled={minCostLoading}
          onClick={() => handleClick(runMinCostAsync)}
        >
          run
        </Button>
      </div>
      <div className="flex justify-between gap-5">
        <p>Greedy-Generous - description</p>
        <Button
          disabled={greedyGenLoading}
          onClick={() => handleClick(runGreedyGenAsync)}
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
            <TableCell className="text-center"> - </TableCell>
            <TableCell className="text-center">()</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Greedy</TableCell>
            <TableCell className="text-center"> - </TableCell>
            <TableCell className="text-center">()</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Greedy-Generous</TableCell>
            <TableCell className="text-center"> - </TableCell>
            <TableCell className="text-center">()</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Min-cost</TableCell>
            <TableCell className="text-center"> - </TableCell>
            <TableCell className="text-center">()</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
