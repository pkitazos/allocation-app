"use client";
import { Button } from "@/components/ui/button";

import { allValid } from "../_utils";
import { useAllocDetails } from "./allocation-store";
import { api } from "@/lib/trpc/client";
import { toast } from "sonner";
import { instanceParams } from "@/lib/validations/params";

export function SubmitButton({ params }: { params: instanceParams }) {
  const allProjects = useAllocDetails((s) => s.projects);
  const allStudents = useAllocDetails((s) => s.students);
  const setSelectedStudentIds = useAllocDetails((s) => s.setSelectedStudentIds);
  const valid = allValid(allProjects);

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
