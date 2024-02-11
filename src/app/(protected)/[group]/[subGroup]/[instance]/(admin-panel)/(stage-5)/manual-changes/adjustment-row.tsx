"use client";
import { DndContext, DragEndEvent, DragOverlay } from "@dnd-kit/core";
import { X } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";
import {
  RowProject,
  StudentRow,
} from "@/lib/validations/allocation-adjustment";

import { ProjectCard } from "./_components/project-card";
import { StudentCard } from "./_components/student-card";
import { useAllocDetailsContext } from "./allocation-store";

export function AdjustmentRow({
  studentRow: { student, projectPreferences },
  setStudentRows,
  rowIdx,
}: {
  studentRow: StudentRow;
  setStudentRows: Dispatch<SetStateAction<StudentRow[]>>;
  rowIdx: number;
}) {
  // const [{ student, projectPreferences }] = useState(studentRows[rowIdx]);
  // const { student, projectPreferences } = studentRows[rowIdx];

  const profile = useAllocDetailsContext((s) => s.profile);
  const setProfile = useAllocDetailsContext((s) => s.setProfile);
  const setWeight = useAllocDetailsContext((s) => s.setWeight);

  const updateConflicts = useAllocDetailsContext((s) => s.updateConflicts);
  const setValidity = useAllocDetailsContext((s) => s.setValidity);
  const rowValidities = useAllocDetailsContext((s) => s.rowValidities);
  const setRowValidities = useAllocDetailsContext((s) => s.setRowValidities);

  const [dragging, setDragging] = useState(false);
  const [projects, updateProjects] = useState<RowProject[]>(projectPreferences);

  // ! only works for removing last row
  function handleRowRemoval() {
    setStudentRows((prev) => prev.toSpliced(rowIdx, 1));
  }

  function removedItem<T>(array: T[], item: T) {
    const index = array.indexOf(item);
    if (index === -1) return array;
    return array.toSpliced(index, 1);
  }

  function handleProfileChange(prevIdx: number, newIdx: number) {
    if (prevIdx === newIdx) return;

    const updatedProfile = profile.map((num, i) => {
      if (i === prevIdx) return profile[prevIdx] - 1;
      if (i === newIdx) return profile[newIdx] + 1;
      else return num;
    });

    const updatedWeight = updatedProfile.reduce((acc, val, i) => {
      return acc + val * (i + 1);
    }, 0);

    setWeight(updatedWeight);
    setProfile(updatedProfile);
  }

  function handleValidityChange(activeProjects: RowProject[]) {
    const isValid = activeProjects.reduce((acc, val) => {
      return acc && allocationWithinBounds(val);
    }, true);

    const updatedRowValidities = rowValidities.map((val, i) => {
      if (i === rowIdx) return isValid;
      else return val;
    });

    setRowValidities(updatedRowValidities);

    const allValid = updatedRowValidities.every(Boolean);
    setValidity(allValid);
  }

  function onDragEnd({ over }: DragEndEvent) {
    if (!over) return;

    updateProjects((projects) => {
      const selectedIdx = projects.findIndex((e) => e.selected);
      const overIdx = projects.findIndex((e) => e.id === over.id);

      handleProfileChange(selectedIdx, overIdx);

      /*
       when I drop the student card onto a project card
       it sets that project as `selected=true` and sets the previously selected project as `selected=false`
      
       instead what I want to do is updated the list of students that said project is allocated to
       Basically, as things stand, each project has an array of studentId corresponding to all the students that have been allocated that project
       what I want to do, is update that array, by removing the active student's id from that array
       and then push the active student's id onto the `allocatedTo` array of the new project
      
       that array is given to me by `prevProject.allocatedTo` 
      
      */
      const { allocatedTo: prevAllocatedTo, ...restPrevProject } =
        projects[selectedIdx];

      projects[selectedIdx] = {
        ...restPrevProject,
        selected: false,
        allocatedTo: removedItem(prevAllocatedTo, student.id),
      };

      const { allocatedTo: newAllocatedTo, ...restNewProject } =
        projects[overIdx];

      projects[overIdx] = {
        ...restNewProject,
        selected: true,
        allocatedTo: [...newAllocatedTo, student.id],
      };

      handleValidityChange(projects);
      updateConflicts(newAllocatedTo);

      return projects;
    });

    setDragging(false);
  }

  return (
    <DndContext onDragStart={() => setDragging(true)} onDragEnd={onDragEnd}>
      <div className="flex items-start gap-3">
        <div className="flex items-center gap-2 border-r pr-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12"
            onClick={handleRowRemoval}
          >
            <X className="h-5 w-5" />
          </Button>
          <StudentCard studentId={student.id} />
        </div>
        {projects.map((p, i) => (
          <ProjectCard key={i} project={p} studentId={student.id} />
        ))}
      </div>
      {createPortal(
        <DragOverlay>
          {dragging && <StudentCard studentId={student.id} />}
        </DragOverlay>,
        document.body,
      )}
    </DndContext>
  );
}

export function allocationWithinBounds(project: RowProject) {
  const { capacityLowerBound, capacityUpperBound, allocatedTo } = project;
  return (
    capacityLowerBound <= allocatedTo.length &&
    allocatedTo.length <= capacityUpperBound
  );
}
