"use client";

import {
  MatchingInfo,
  StudentRow,
} from "@/lib/validations/allocation-adjustment";

import { AllocDetailsProvider } from "./allocation-store";
import { AdjustmentSpace } from "./adjustment-space";

export function AllocationAdjustment({
  allRows,
  matchingInfo: { profile, weight, isValid, rowValidities },
}: {
  allRows: StudentRow[];
  matchingInfo: MatchingInfo;
}) {
  return (
    <AllocDetailsProvider
      validOverall={isValid}
      profile={profile}
      weight={weight}
      rowValidities={rowValidities}
      allOriginalRows={allRows}
      allWorkingRows={allRows}
      conflictingWith={[]}
      visibleRows={[]}
      changedRows={[]}
      rowConflicts={[]}
    >
      <AdjustmentSpace />
    </AllocDetailsProvider>
  );
}
