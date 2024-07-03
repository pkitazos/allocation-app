import { Button } from "@/components/ui/button";
import { replaceUpdated } from "@/lib/utils/allocation-adjustment/project";
import {
  getProjectIdx,
  removeFromAllocations,
} from "@/lib/utils/allocation-adjustment/student";
import { TrashIcon } from "lucide-react";
import { useAllocDetails } from "./allocation-store";

export function UnmatchButton({ rowIdx }: { rowIdx: number }) {
  const selectedStudentIds = useAllocDetails((s) => s.selectedStudentIds);
  const allProjects = useAllocDetails((s) => s.projects);
  const updateProjects = useAllocDetails((s) => s.updateProjects);

  function handleClick() {
    const newProjects = structuredClone(allProjects);
    const studentId = selectedStudentIds[rowIdx];

    const selectedIdx = getProjectIdx(newProjects, studentId);

    const selectedProject = newProjects[selectedIdx]; // gets the project information for the project that the student has been allocated to

    const updatedSelected = removeFromAllocations(selectedProject, studentId); // removes the student in this row from the list of students allocated to the project

    newProjects[selectedIdx] = updatedSelected;
    const updatedProjects = replaceUpdated(allProjects, newProjects);

    updateProjects(updatedProjects);
  }

  return (
    <Button
      onClick={handleClick}
      size="icon"
      variant="destructive"
      className="h-12 w-12"
    >
      <TrashIcon className="h-5 w-5" />
    </Button>
  );
}
