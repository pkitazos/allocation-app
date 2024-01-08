"use client";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/trpc/client";
import { MatchingData, BuiltInAlg } from "@/lib/validations/algorithm";
import { instanceParams } from "@/lib/validations/params";
import { toast } from "sonner";

export function RunAlgorithmButton({
  params,
  matchingData,
  algDisplayName,
  description = "description",
  algName,
  refetch,
}: {
  params: instanceParams;
  matchingData: MatchingData;
  algDisplayName: string;
  description?: string;
  algName: BuiltInAlg;
  refetch: () => void;
}) {
  const { isPending, mutateAsync } = api.algorithm.run.useMutation();

  return (
    <div className="flex justify-between gap-5">
      <p>
        {algDisplayName} - {description}
      </p>
      <Button
        disabled={isPending}
        onClick={() =>
          toast.promise(
            mutateAsync({ params, algorithm: algName, matchingData }).then(
              refetch,
            ),
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
