"use client";

import { AdjustmentRow } from "./adjustment-row";
import { useAllocDetails } from "./allocation-store";
import { MatchingInfoTable } from "./matching-info-table";
import { StudentSelector } from "./student-selector";

export function AdjustmentSpace() {
  const selectedStudents = useAllocDetails((s) => s.selectedStudentIds);

  return (
    <div className="flex w-full flex-col items-start gap-9">
      <div className="flex w-full items-center justify-between">
        <StudentSelector className="mb-4" />
        <div className="flex w-1/2 gap-2">
          <MatchingInfoTable />
        </div>
      </div>
      {selectedStudents.map((studentId, i) => (
        <AdjustmentRow key={i} rowIdx={i} studentId={studentId} />
      ))}
    </div>
  );
}
