"use client";
import { rowsDiff } from "@/lib/utils/student-rows-diff";

import { AdjustmentRow } from "./_components/adjustment-row";
import { MatchingInfoTable } from "./_components/matching-info-table";
import { StudentSelector } from "./_components/student-selector";
import { SubmitButton } from "./_components/submit-button";
import { useAllocDetails } from "./allocation-store";

export function AdjustmentSpace() {
  const allRows = useAllocDetails((s) => s.allWorkingRows);
  const visibleRows = useAllocDetails((s) => s.visibleRows);
  const remainingStudentRows = rowsDiff(allRows, visibleRows);

  return (
    <div className="flex w-full flex-col items-start gap-9">
      <div className="flex w-full items-center justify-between">
        <StudentSelector
          className="mb-4"
          remainingRows={remainingStudentRows}
        />
        <div className="flex gap-2">
          <SubmitButton />
          <MatchingInfoTable />
        </div>
      </div>
      {visibleRows.map((_, i) => (
        <AdjustmentRow key={i} rowIdx={i} />
      ))}
    </div>
  );
}
