"use client";

import { AdjustmentRow } from "./adjustment-row";
import { StudentSelector } from "./student-selector";
import { SubmitButton } from "./submit-button";
import { useAllocDetails } from "./allocation-store";
import { MatchingInfoTable } from "./matching-info-table";
import { instanceParams } from "@/lib/validations/params";

export function AdjustmentSpace({ params }: { params: instanceParams }) {
  const selectedStudents = useAllocDetails((s) => s.selectedStudentIds);

  return (
    <div className="flex w-full flex-col items-start gap-9">
      <div className="flex w-full items-center justify-between">
        <StudentSelector className="mb-4" />
        <div className="flex gap-2">
          <SubmitButton params={params} />
          <MatchingInfoTable />
        </div>
      </div>
      {selectedStudents.map((studentId, i) => (
        <AdjustmentRow key={i} rowIdx={i} studentId={studentId} />
      ))}
    </div>
  );
}
