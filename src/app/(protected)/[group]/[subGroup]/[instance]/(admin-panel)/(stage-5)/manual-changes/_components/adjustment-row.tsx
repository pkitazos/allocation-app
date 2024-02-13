"use client";
import { DndContext, DragEndEvent, DragOverlay } from "@dnd-kit/core";
import { useState } from "react";
import { createPortal } from "react-dom";

import { removedItem } from "@/lib/utils/removed-item";

import { getProjectInfo, replaceUpdated } from "../_utils/get-project";
import { getStudent, inAllocatedTo } from "../_utils/get-student";
import { handleProfileChange } from "../_utils/matching-info";
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

  const profile = useAllocDetails((s) => s.profile);
  const setProfile = useAllocDetails((s) => s.setProfile);
  const setWeight = useAllocDetails((s) => s.setWeight);

  const allStudents = useAllocDetails((s) => s.students);
  const allProjects = useAllocDetails((s) => s.projects);
  const updateProjects = useAllocDetails((s) => s.updateProjects);

  const rowStudent = getStudent(allStudents, studentId);
  const projects = rowStudent.projects.map((p) => ({
    ...getProjectInfo(allProjects, p.id),
    selected: p.selected,
  }));

  function updateProfile(prevIdx: number, newIdx: number) {
    return handleProfileChange(profile, prevIdx, newIdx, setProfile, setWeight);
  }

  function onDragEnd({ over }: DragEndEvent) {
    if (!over) return;

    const newProjects = structuredClone(projects);
    const selectedIdx = inAllocatedTo(newProjects, studentId);
    const overIdx = newProjects.findIndex((e) => e.id === over.id);

    if (selectedIdx === overIdx) return;

    const { allocatedTo: prevAllocatedTo, ...restPrevProject } =
      newProjects[selectedIdx];

    newProjects[selectedIdx] = {
      ...restPrevProject,
      // selected: false,
      allocatedTo: removedItem(prevAllocatedTo, studentId),
    };

    const { allocatedTo: newAllocatedTo, ...restNewProject } =
      newProjects[overIdx];

    newProjects[overIdx] = {
      ...restNewProject,
      // selected: true,
      allocatedTo: [...newAllocatedTo, studentId],
    };

    const updatedProjects = replaceUpdated(allProjects, newProjects);

    updateProfile(selectedIdx, overIdx);
    updateProjects(updatedProjects);
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
