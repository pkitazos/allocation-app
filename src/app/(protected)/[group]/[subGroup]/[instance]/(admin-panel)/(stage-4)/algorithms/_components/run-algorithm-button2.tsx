import { toast } from "sonner";

import { useInstanceParams } from "@/components/params-context";
import { Button } from "@/components/ui/button";

import { api } from "@/lib/trpc/client";
import { AlgorithmDto } from "@/lib/validations/algorithm";

export function RunAlgorithmButton2({
  algorithm,
}: {
  algorithm: AlgorithmDto;
}) {
  const params = useInstanceParams();
  const utils = api.useUtils();

  const { isPending, mutateAsync: runAlgAsync } =
    api.institution.instance.algorithm.run.useMutation();

  const refetchAlgorithmResult = (algName: string) =>
    utils.institution.instance.algorithm.singleResult.refetch({
      algName,
      params,
    });

  const refetchAllResults = () =>
    utils.institution.instance.algorithm.allStudentResults.refetch({ params });

  async function runAlgorithm(a: AlgorithmDto) {
    const algorithm = {
      ...a,
      flag1: a.flags.at(0)!,
      flag2: a.flags.at(1) ?? null,
      flag3: a.flags.at(2) ?? null,
    };

    void toast.promise(
      runAlgAsync({ params, algorithm }).then((data) => {
        refetchAlgorithmResult(a.algName);
        refetchAllResults();
        return data;
      }),
      {
        loading: "Running...",
        success: (data) =>
          `Successfully matched ${data.matchedStudents} of ${data.totalStudents} submitted students`,
        error: (err) =>
          err.message === "Infeasible"
            ? "Matching is infeasible with current configuration"
            : `Something went wrong`,
      },
    );
  }

  return (
    <Button onClick={() => runAlgorithm(algorithm)} disabled={isPending}>
      run
    </Button>
  );
}
