"use client";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontalIcon as MoreIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import { useInstanceParams } from "@/components/params-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreInformation } from "@/components/ui/more-information";
import {
  YesNoActionContainer,
  YesNoActionTrigger,
} from "@/components/yes-no-action";

import { api } from "@/lib/trpc/client";
import { AlgorithmDto } from "@/lib/validations/algorithm";

import { RunAlgorithmButton } from "./run-algorithm-button";
import { useAlgorithmUtils } from "./use-algorithms";

export function useAlgorithmColumns(): ColumnDef<AlgorithmDto>[] {
  const params = useInstanceParams();
  const utils = useAlgorithmUtils();

  function refetchResults() {
    utils.getAll();
    utils.allStudentResults();
    utils.allSupervisorResults();
    utils.getAllSummaryResults();
  }

  const { mutateAsync: deleteAlgAsync } =
    api.institution.instance.algorithm.delete.useMutation();

  async function deleteAlgorithm(algName: string) {
    void toast.promise(
      deleteAlgAsync({ params, algName }).then(refetchResults),
      {
        loading: "Running...",
        success: `Successfully deleted algorithm "${algName}"`,
        error: "Something went wrong",
      },
    );
  }

  const columns: ColumnDef<AlgorithmDto>[] = [
    {
      accessorKey: "actions",
      id: "Actions",
      header: "",
      cell: ({
        row: {
          original: { algName, displayName, description },
        },
      }) => {
        if (description !== "") {
          return (
            <div className="flex w-14 items-start justify-center">
              <MoreInformation side="left">{description}</MoreInformation>
            </div>
          );
        }

        return (
          <div className="flex w-14 items-center justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost">
                  <span className="sr-only">Open menu</span>
                  <MoreIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <YesNoActionContainer
                action={async () => void deleteAlgorithm(algName)}
                title="Delete Algorithm?"
                description={`You are about to remove algorithm "${algName}". Do you wish to proceed?`}
              >
                <DropdownMenuContent align="center" side="bottom">
                  <DropdownMenuLabel>
                    Actions
                    <span className="ml-2 text-muted-foreground">
                      for {displayName}
                    </span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive focus:bg-red-100/40 focus:text-destructive">
                    <YesNoActionTrigger
                      trigger={
                        <button className="flex items-center gap-2">
                          <Trash2Icon className="h-4 w-4" />
                          <span>Delete algorithm</span>
                        </button>
                      }
                    />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </YesNoActionContainer>
            </DropdownMenu>
          </div>
        );
      },
    },
    {
      id: "Name",
      accessorFn: (a) => a.displayName,
      header: () => <p className="w-32 py-2 pl-2">Name</p>,
    },
    {
      id: "Flags",
      accessorFn: (a) => a.flags,
      header: () => <p className="py-2 pl-2">Flags</p>,
      cell: ({
        row: {
          original: { flags },
        },
      }) => (
        <div className="flex gap-2">
          {flags.map((flag, i) => (
            <Badge variant="outline" className="w-fit" key={flag + i}>
              {flag}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      id: "Target Modifier",
      accessorFn: (a) => a.targetModifier,
      header: () => <p className="w-20 text-wrap py-2">Target Modifier</p>,
      cell: ({
        row: {
          original: { targetModifier },
        },
      }) => (
        <p className="w-20 text-center">
          {targetModifier !== 0 ?? targetModifier}
        </p>
      ),
    },
    {
      id: "Upper Quota Modifier",
      accessorFn: (a) => a.upperBoundModifier,
      header: () => <p className="w-28 text-wrap py-2">Upper Quota Modifier</p>,
      cell: ({
        row: {
          original: { upperBoundModifier },
        },
      }) => (
        <p className="w-28 text-center">
          {upperBoundModifier !== 0 ?? upperBoundModifier}
        </p>
      ),
    },
    {
      id: "Run",
      header: "",
      cell: ({ row: { original: algorithm } }) => (
        <RunAlgorithmButton algorithm={algorithm} />
      ),
    },
  ];

  return columns;
}
