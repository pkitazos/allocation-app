import { useInstanceParams } from "@/components/params-context";

import { api } from "@/lib/trpc/client";

export function useAlgorithmUtils() {
  const params = useInstanceParams();
  const utils = api.useUtils();

  function getAll() {
    utils.institution.instance.algorithm.getAll.refetch({ params });
  }

  function allStudentResults() {
    utils.institution.instance.algorithm.allStudentResults.refetch({ params });
  }

  function allSupervisorResults() {
    utils.institution.instance.algorithm.allSupervisorResults.refetch({
      params,
    });
  }

  function getAllSummaryResults() {
    utils.institution.instance.algorithm.getAllSummaryResults.refetch({
      params,
    });
  }

  function singleResult(algName: string) {
    utils.institution.instance.algorithm.singleResult.refetch({
      algName,
      params,
    });
  }

  return {
    getAll,
    allStudentResults,
    allSupervisorResults,
    getAllSummaryResults,
    singleResult,
  };
}
