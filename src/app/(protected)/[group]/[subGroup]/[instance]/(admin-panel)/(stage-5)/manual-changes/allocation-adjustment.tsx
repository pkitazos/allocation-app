"use client";
import { useState } from "react";

import { AdjustmentRow } from "./adjustment-row";
import { StudentSelector } from "./student-selector";

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

export function AllocationAdjustment({ allRows }: { allRows: StudentRow[] }) {
  const [studentRows, setStudentRows] = useState<StudentRow[]>([]);
  const remainingStudentRows = rowsDiff(allRows, studentRows);

  return (
    <div className="flex w-full flex-col items-start gap-9">
      <StudentSelector
        className="mb-4"
        studentRows={remainingStudentRows}
        setStudentRows={setStudentRows}
      />
      {studentRows.map((row, i) => (
        <AdjustmentRow key={i} studentRow={row} />
      ))}
    </div>
  );
}

const rowsDiff = (array: StudentRow[], subArray: StudentRow[]) => {
  const ids = new Set(subArray.map(({ student }) => student.id));
  return array.filter(({ student }) => !ids.has(student.id));
};
