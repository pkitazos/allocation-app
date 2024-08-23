"use client";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

import { useInstanceParams } from "@/components/params-context";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";

import { api } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";

export function ResultsTableRow({
  algName,
  algDisplayName,

  selectedAlgName,
  setSelectedMatching,
}: {
  algName: string;
  algDisplayName: string;
  selectedAlgName: string | undefined;
  setSelectedMatching: Dispatch<SetStateAction<string | undefined>>;
}) {
  const params = useInstanceParams();

  const { isLoading, data } =
    api.institution.instance.algorithm.singleResult.useQuery({
      params,
      algName,
    });

  const { mutateAsync: selectMatchingAsync } =
    api.institution.instance.matching.select.useMutation();

  const handleSelection = (algName: string) => {
    toast.promise(
      selectMatchingAsync({
        algName,
        params,
      }).then(() => {
        setSelectedMatching(algName);
      }),
      {
        loading: "Changing selection...",
        error: "Something went wrong",
        success: "Successfully updated selection",
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
        {isLoading || !data || Number.isNaN(data.size) ? "-" : data.size}
      </TableCell>
      <TableCell className="text-center">
        {isLoading || !data || data.profile.length === 0
          ? "-"
          : `(${data.profile.join(", ")})`}
      </TableCell>
      <TableCell className="text-center">
        <Button
          variant={selectedAlgName === algName ? "secondary" : "ghost"}
          className={cn()}
          onClick={() => handleSelection(algName)}
        >
          {selectedAlgName === algName ? "Selected" : "Select"}
        </Button>
      </TableCell>
    </TableRow>
  );
}
