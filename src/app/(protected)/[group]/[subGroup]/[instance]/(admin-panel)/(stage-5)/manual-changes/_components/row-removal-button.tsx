/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAllocDetails } from "./allocation-store";
import { ProjectInfo } from "@/lib/validations/allocation-adjustment";
import { removedItem } from "@/lib/utils/removed-item";
import { getProjectInfo, replaceUpdated } from "../_utils/get-project";
import {
  addToAllocations,
  findAllocation,
  getSelectedProject,
  getStudent,
  removeFromAllocations,
} from "../_utils/get-student";
import { handleProfileChange } from "../_utils/matching-info";

export function RowRemovalButton({ rowIdx }: { rowIdx: number }) {
  const studentsBackup = useAllocDetails((s) => s.studentsBackup);
  const allProjects = useAllocDetails((s) => s.projects);

  const selectedStudentIds = useAllocDetails((s) => s.selectedStudentIds);
  const setSelectedStudentIds = useAllocDetails((s) => s.setSelectedStudentIds);
  const updateProjects = useAllocDetails((s) => s.updateProjects);

  const profile = useAllocDetails((s) => s.profile);
  const setProfile = useAllocDetails((s) => s.setProfile);
  const setWeight = useAllocDetails((s) => s.setWeight);

  function updateProfile(prevIdx: number, newIdx: number) {
    return handleProfileChange(profile, prevIdx, newIdx, setProfile, setWeight);
  }

  function handleRowRemoval(idx: number) {
    /**
     * each row represents a student
     * presumably, when I add a new row, I do so to change that student's project allocation
     * when I remove the row however, I want to reset the allocation of that student back to its default
     *
     * I can do that, by finding which project the student was originally allocated to
     * and comparing that to the project the student is currently allocated to
     * if these are the same, just delete the row
     * otherwise remove the studentId from the project it is currently allocated to
     * and add the studentId to the project it was originally allocated to
     */

    const studentId = selectedStudentIds[idx];
    const student = getStudent(studentsBackup, studentId);

    const originalAlloc = getSelectedProject(allProjects, student);
    const currentAlloc = findAllocation(allProjects, studentId);

    const originalIdx = allProjects.findIndex((p) => p.id === originalAlloc.id);
    const currentIdx = allProjects.findIndex((p) => p.id === currentAlloc.id);

    if (originalAlloc.id !== currentAlloc.id) {
      const updatedOriginal = addToAllocations(originalAlloc, studentId);
      const updatedCurrent = removeFromAllocations(currentAlloc, studentId);

      const projects = structuredClone(allProjects);
      projects[originalIdx] = updatedOriginal;
      projects[currentIdx] = updatedCurrent;

      updateProjects(projects);
    }

    updateProfile(currentIdx, originalIdx);
    setSelectedStudentIds(selectedStudentIds.toSpliced(idx, 1));
    return;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-12 w-12"
      onClick={() => handleRowRemoval(rowIdx)}
    >
      <X className="h-5 w-5" />
    </Button>
  );
}
