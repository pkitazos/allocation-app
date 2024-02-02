"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { api } from "@/lib/trpc/client";
import { Algorithm, MatchingData } from "@/lib/validations/algorithm";
import { instanceParams } from "@/lib/validations/params";
import { InfoIcon } from "lucide-react";

import { toast } from "sonner";

export function RunAlgorithmButton({
  params,
  matchingData,
  algorithm,
  custom = false,
}: {
  params: instanceParams;
  matchingData: MatchingData;
  algorithm: Algorithm;
  custom?: boolean;
}) {
  const utils = api.useUtils();

  const refetch = () =>
    utils.institution.instance.algorithm.singleResult.refetch({
      algName: algorithm.algName,
      params,
    });

  const { isPending, mutateAsync: runAlgAsync } =
    api.institution.instance.algorithm.run.useMutation();

  const Info = custom ? Flags : Description;

  return (
    <div className="flex justify-between gap-5">
      <p className="flex items-center gap-2">
        {algorithm.displayName} - <Info algorithm={algorithm} />
      </p>
      <Button
        disabled={isPending}
        onClick={() =>
          toast.promise(
            runAlgAsync({ params, algorithm, matchingData }).then(refetch),
            {
              loading: "Running...",
              error: "Something went wrong",
              success: "Succcess",
            },
          )
        }
      >
        run
      </Button>
    </div>
  );
}

function Description({ algorithm }: { algorithm: Algorithm }) {
  return (
    <Popover>
      <PopoverTrigger>
        <InfoIcon className="h-4 w-4 stroke-slate-400" />
      </PopoverTrigger>
      <PopoverContent>{algorithm.description}</PopoverContent>
    </Popover>
  );
}

function Flags({ algorithm }: { algorithm: Algorithm }) {
  return (
    <div className="flex items-center gap-2">
      <Badge variant="outline" className="">
        {algorithm.flag1}
      </Badge>
      {algorithm.flag2 && (
        <Badge variant="outline" className="">
          {algorithm.flag2}
        </Badge>
      )}
      {algorithm.flag3 && (
        <Badge variant="outline" className="">
          {algorithm.flag3}
        </Badge>
      )}
    </div>
  );
}
