"use client";
import { DndContext, DragEndEvent, DragOverlay } from "@dnd-kit/core";
import { useState } from "react";
import { createPortal } from "react-dom";

import { removedItem } from "@/lib/utils/remove-item";
import { RowProject } from "@/lib/validations/allocation-adjustment";

import { useAllocDetails } from "../allocation-store";
import { ProjectCard } from "./project-card";
import { StudentCard } from "./student-card";
import { RowRemovalButton } from "./row-removal-button";
import { allocationWithinBounds } from "@/lib/utils/allocation-within-bounds";

export function AdjustmentRow({ rowIdx }: { rowIdx: number }) {
  const visibleRows = useAllocDetails((s) => s.visibleRows);
  const updateVisibleRows = useAllocDetails((s) => s.updateVisibleRows);
  const { student, projectPreferences } = visibleRows[rowIdx];

  const profile = useAllocDetails((s) => s.profile);
  const setProfile = useAllocDetails((s) => s.setProfile);
  const setWeight = useAllocDetails((s) => s.setWeight);

  const setValidity = useAllocDetails((s) => s.setValidOverall);
  const rowValidities = useAllocDetails((s) => s.rowValidities);
  const setRowValidities = useAllocDetails((s) => s.setRowValidities);

  const rowConflicts = useAllocDetails((s) => s.rowConflicts);
  const updateRowConflicts = useAllocDetails((s) => s.updateRowConflicts);

  const updateConflicts = useAllocDetails((s) => s.updateConflicts);

  const [dragging, setDragging] = useState(false);

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

    const updatedRowValidities = rowValidities.map((row, i) => {
      return i === rowIdx ? isValid : row;
    });
    setRowValidities(updatedRowValidities);

    const allValid = updatedRowValidities.every(Boolean);
    setValidity(allValid);
  }

  function onDragEnd({ over }: DragEndEvent) {
    if (!over) return;

    const projects = projectPreferences.slice();
    const selectedIdx = projects.findIndex((e) => e.selected);
    const overIdx = projects.findIndex((e) => e.id === over.id);

    handleProfileChange(selectedIdx, overIdx);

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

    const updatedRows = visibleRows.map((row, i) => {
      if (i === rowIdx) return { ...row, projectPreferences: projects };
      else return row;
    });

    const updatedRowConflicts = rowConflicts.map((row, i) => {
      if (i === rowIdx) return newAllocatedTo;
      else return row;
    });

    updateVisibleRows(updatedRows);
    updateRowConflicts(updatedRowConflicts);

    setDragging(false);
  }

  return (
    <DndContext onDragStart={() => setDragging(true)} onDragEnd={onDragEnd}>
      <div className="flex items-start gap-3">
        <div className="flex items-center gap-2 border-r pr-3">
          <RowRemovalButton rowIdx={rowIdx} />
          <StudentCard studentId={student.id} />
        </div>
        {projectPreferences.map((p, i) => (
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
