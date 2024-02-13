"use client";

import { AdjustmentRow } from "./adjustment-row";
import { StudentSelector } from "./student-selector";
import { SubmitButton } from "./submit-button";
import { useAllocDetails } from "./allocation-store";

export function AdjustmentSpace() {
  const visibleRows = useAllocDetails((s) => s.selectedStudentIds);
  // const remainingStudentRows = rowsDiff(allRows, visibleRows);

  console.log({ visibleRows });

  return (
    <div className="flex w-full flex-col items-start gap-9">
      <div className="flex w-full items-center justify-between">
        <StudentSelector className="mb-4" />
        <div className="flex gap-2">
          <SubmitButton />
          {/* <MatchingInfoTable /> */}
        </div>
      </div>
      {visibleRows.map((studentId, i) => (
        <AdjustmentRow key={i} rowIdx={i} studentId={studentId} />
      ))}
    </div>
  );
}
