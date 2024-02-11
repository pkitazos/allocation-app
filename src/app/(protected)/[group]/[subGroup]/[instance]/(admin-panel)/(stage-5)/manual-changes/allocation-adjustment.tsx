"use client";
import { useState } from "react";

import {
  MatchingInfo,
  StudentRow,
} from "@/lib/validations/allocation-adjustment";

import { MatchingInfoTable } from "./_components/matching-info-table";
import { SubmitButton } from "./_components/submit-button";
import { AdjustmentRow } from "./adjustment-row";
import { AllocDetailsProvider } from "./allocation-store";
import { StudentSelector } from "./student-selector";

export function AllocationAdjustment({
  allRows,
  matchingInfo: { profile, weight, isValid, rowValidities },
}: {
  allRows: StudentRow[];
  matchingInfo: MatchingInfo;
}) {
  const [studentRows, setStudentRows] = useState<StudentRow[]>([]);
  const remainingStudentRows = rowsDiff(allRows, studentRows);

  return (
    <AllocDetailsProvider
      isValid={isValid}
      profile={profile}
      weight={weight}
      rowValidities={rowValidities}
      conflictingWith={[]}
    >
      <div className="flex w-full flex-col items-start gap-9">
        <div className="flex w-full items-center justify-between">
          <StudentSelector
            className="mb-4"
            studentRows={remainingStudentRows}
            setStudentRows={setStudentRows}
          />
          <div className="flex gap-2">
            <SubmitButton />
            <MatchingInfoTable />
          </div>
        </div>
        {studentRows.map((row, i) => (
          <AdjustmentRow
            key={i}
            studentRow={row}
            rowIdx={i}
            setStudentRows={setStudentRows}
          />
        ))}
      </div>
    </AllocDetailsProvider>
  );
}

const rowsDiff = (array: StudentRow[], subArray: StudentRow[]) => {
  const ids = new Set(subArray.map(({ student }) => student.id));
  return array.filter(({ student }) => !ids.has(student.id));
};
