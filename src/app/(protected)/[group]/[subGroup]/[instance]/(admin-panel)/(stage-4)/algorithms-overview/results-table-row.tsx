"use client";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { api } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";
import { ServerResponseData, BuiltInAlg } from "@/lib/validations/algorithm";
import { instanceParams } from "@/lib/validations/params";

export function ResultsTableRow({
  isLoading,
  algName,
  algDisplayName,
  params,
  matching,
  selectedMatching,
  setSelectedMatching,
}: {
  isLoading: boolean;
  algName: BuiltInAlg;
  algDisplayName: string;
  params: instanceParams;
  matching: ServerResponseData | undefined;
  selectedMatching: BuiltInAlg | undefined;
  setSelectedMatching: Dispatch<SetStateAction<BuiltInAlg | undefined>>;
}) {
  const { mutateAsync: selectMatchingAsync } =
    api.institution.instance.selectMatching.useMutation();

  const handleSelection = (algName: BuiltInAlg) => {
    toast.promise(
      selectMatchingAsync({
        oldAlgName: selectedMatching,
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
