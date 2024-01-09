"use client";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { api } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";
import { BuiltInAlg } from "@/lib/validations/algorithm";
import { instanceParams } from "@/lib/validations/params";

export function ResultsTableRow({
  algName,
  algDisplayName,
  params,
  selectedMatching,
  setSelectedMatching,
}: {
  algName: BuiltInAlg;
  algDisplayName: string;
  params: instanceParams;
  selectedMatching: BuiltInAlg | undefined;
  setSelectedMatching: Dispatch<SetStateAction<BuiltInAlg | undefined>>;
}) {
  const { isLoading, data } =
    api.institution.instance.singleAlgorithmResult.useQuery({
      params,
      algName,
    });

  const { mutateAsync: selectMatchingAsync } =
    api.institution.instance.selectMatching.useMutation();

  const handleSelection = (algName: BuiltInAlg) => {
    toast.promise(
      selectMatchingAsync({
        algName,
        params,
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
    <TableRow className="items-center">
      <TableCell className="font-medium">{algDisplayName}</TableCell>
      <TableCell className="text-center">
        {isLoading || !data || Number.isNaN(data.weight) ? "-" : data.weight}
      </TableCell>
      <TableCell className="text-center">
        {isLoading || !data || data.profile.length === 0
          ? "-"
          : `(${data.profile.join(", ")})`}
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
