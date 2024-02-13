"use client";
import { DndContext, DragEndEvent, DragOverlay } from "@dnd-kit/core";
import { useState } from "react";
import { createPortal } from "react-dom";

import { removedItem } from "@/lib/utils/removed-item";

import { getProjectInfo, replaceUpdated } from "../_utils/get-project";
import { getStudent, inAllocatedTo } from "../_utils/get-student";
import { useAllocDetails } from "./allocation-store";
import { ProjectCard } from "./project-card";
import { RowRemovalButton } from "./row-removal-button";
import { StudentCard } from "./student-card";

export function AdjustmentRow({
  rowIdx,
  studentId,
}: {
  rowIdx: number;
  studentId: string;
}) {
  const [dragging, setDragging] = useState(false);

  const allStudents = useAllocDetails((s) => s.students);
  const allProjects = useAllocDetails((s) => s.projects);
  const updateProjects = useAllocDetails((s) => s.updateProjects);

  const rowStudent = getStudent(allStudents, studentId);
  const projects = rowStudent.projects.map((p) => ({
    ...getProjectInfo(allProjects, p.id),
    selected: p.selected,
  }));

  console.log("row projects ------->>", { projects });

  // function handleProfileChange(prevIdx: number, newIdx: number) {
  //   if (prevIdx === newIdx) return;

  //   const updatedProfile = profile.map((num, i) => {
  //     if (i === prevIdx) return profile[prevIdx] - 1;
  //     if (i === newIdx) return profile[newIdx] + 1;
  //     else return num;
  //   });

  //   const updatedWeight = updatedProfile.reduce((acc, val, i) => {
  //     return acc + val * (i + 1);
  //   }, 0);

  //   setWeight(updatedWeight);
  //   setProfile(updatedProfile);
  // }

  // function handleValidityChange(activeProjects: RowProject[]) {
  //   const isValid = activeProjects.reduce((acc, val) => {
  //     return acc && allocationWithinBounds(val);
  //   }, true);

  //   const updatedRowValidities = rowValidities.map((row, i) => {
  //     return i === rowIdx ? isValid : row;
  //   });
  //   setRowValidities(updatedRowValidities);

  //   const allValid = updatedRowValidities.every(Boolean);
  //   setValidity(allValid);
  // }

  function onDragEnd({ over }: DragEndEvent) {
    if (!over) return;

    const newProjects = projects.slice();
    const selectedIdx = inAllocatedTo(newProjects, studentId);
    const overIdx = newProjects.findIndex((e) => e.id === over.id);

    if (selectedIdx === overIdx) return;

    const { allocatedTo: prevAllocatedTo, ...restPrevProject } =
      newProjects[selectedIdx];

    newProjects[selectedIdx] = {
      ...restPrevProject,
      selected: false,
      allocatedTo: removedItem(prevAllocatedTo, studentId),
    };

    const { allocatedTo: newAllocatedTo, ...restNewProject } =
      newProjects[overIdx];

    newProjects[overIdx] = {
      ...restNewProject,
      selected: true,
      allocatedTo: [...newAllocatedTo, studentId],
    };

    const updatedProjects = replaceUpdated(allProjects, newProjects);

    updateProjects(updatedProjects);
    // handleValidityChange(projects);
    // updateConflicts(newAllocatedTo);

    // const updatedRows = visibleRows.map((row, i) => {
    //   if (i === rowIdx) return { ...row, projectPreferences: projects };
    //   else return row;
    // });

    // const updatedRowConflicts = rowConflicts.map((row, i) => {
    //   if (i === rowIdx) return newAllocatedTo;
    //   else return row;
    // });

    // updateProjects(updatedRows);
    // updateRowConflicts(updatedRowConflicts);

    setDragging(false);
  }

  return (
    <DndContext onDragStart={() => setDragging(true)} onDragEnd={onDragEnd}>
      <div className="flex items-start gap-3">
        <div className="flex items-center gap-2 border-r pr-3">
          <RowRemovalButton rowIdx={rowIdx} />
          <StudentCard studentId={studentId} />
        </div>
        {rowStudent.projects.map((p, i) => (
          <ProjectCard key={i} project={p} studentId={studentId} />
        ))}
      </div>
      {createPortal(
        <DragOverlay>
          {dragging && <StudentCard studentId={studentId} />}
        </DragOverlay>,
        document.body,
      )}
    </DndContext>
  );
}
