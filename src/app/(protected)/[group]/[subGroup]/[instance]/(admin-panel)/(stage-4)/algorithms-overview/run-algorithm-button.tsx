"use client";
import { Button } from "@/components/ui/button";
import { Algorithm } from "@/lib/algorithms";
import { api } from "@/lib/trpc/client";
import { MatchingData } from "@/lib/validations/algorithm";
import { instanceParams } from "@/lib/validations/params";
import { toast } from "sonner";

export function RunAlgorithmButton({
  params,
  matchingData,
  algorithm,
}: {
  params: instanceParams;
  matchingData: MatchingData;
  algorithm: Algorithm;
}) {
  const utils = api.useUtils();

  const refetch = () =>
    utils.institution.instance.singleAlgorithmResult.refetch({
      algName: algorithm.algName,
      params,
    });

  const { isPending, mutateAsync } = api.algorithm.run.useMutation();

  return (
    <div className="flex justify-between gap-5">
      <p>
        {algorithm.displayName} - {algorithm.description}
      </p>
      <Button
        disabled={isPending}
        onClick={() =>
          toast.promise(
            mutateAsync({ params, algorithm, matchingData }).then(refetch),
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
