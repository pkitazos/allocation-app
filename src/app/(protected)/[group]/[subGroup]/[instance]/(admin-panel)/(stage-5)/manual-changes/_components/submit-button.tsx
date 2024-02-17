"use client";
import { toast } from "sonner";

import { useInstanceParams } from "@/components/params-context";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/trpc/client";
import { allProjectsValid } from "@/lib/utils/allocation-adjustment";

import { useAllocDetails } from "./allocation-store";
import { allSupervisorsValid } from "@/lib/utils/allocation-adjustment/supervisor";

export function SubmitButton() {
  const params = useInstanceParams();
  const allProjects = useAllocDetails((s) => s.projects);
  const allStudents = useAllocDetails((s) => s.students);
  const allSupervisors = useAllocDetails((s) => s.supervisors);
  const setSelectedStudentIds = useAllocDetails((s) => s.setSelectedStudentIds);
  const valid =
    allProjectsValid(allProjects) &&
    allSupervisorsValid(allProjects, allSupervisors);

  const { mutateAsync } =
    api.institution.instance.matching.updateAllocation.useMutation();

  // TODO: fix refetch bug
  const utils = api.useUtils();
  const refetch = () =>
    utils.institution.instance.matching.rowData.refetch({
      params,
    });

  async function handleSubmission() {
    setSelectedStudentIds([]);
    void toast.promise(
      mutateAsync({
        params,
        allProjects: allProjects,
        allStudents: allStudents,
      }).then(refetch),
      {
        loading: "Updating project allocations",
        error: "Something went wrong",
        success: "Successfully updated project allocations",
      },
    );
  }

  return (
    <Button disabled={!valid} onClick={handleSubmission}>
      Submit Changes
    </Button>
  );
}
