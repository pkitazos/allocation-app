"use client";

import { useState } from "react";
import { AdjustmentRow } from "./adjustment-row";
import { StudentSelectionSearch } from "./student-search-bar";

export type StudentRow = {
  student: {
    id: string;
    name: string;
  };
  projectPreferences: {
    id: string;
    selected: boolean;
  }[];
};

export function AllocationAdjustment({
  allPreferences,
}: {
  allPreferences: StudentRow[];
}) {
  const [studentRows, setStudentRows] = useState<StudentRow[]>([]);

  // TODO: clean this up
  const selectedIds = new Set(studentRows.map(({ student: { id } }) => id));

  const remainingStudentRows = allPreferences.filter(
    ({ student: { id } }) => !selectedIds.has(id),
  );

  return (
    <div className="flex w-full flex-col items-start gap-9">
      <div className="mb-4">
        <StudentSelectionSearch
          studentRows={remainingStudentRows}
          setStudentRows={setStudentRows}
        />
      </div>
      {studentRows.map((row, i) => (
        <AdjustmentRow key={i} studentRow={row} />
      ))}
    </div>
  );
}
