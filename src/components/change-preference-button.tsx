"use client";
import { PreferenceType } from "@prisma/client";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  StudentPreferenceType,
  studentPreferenceType,
} from "@/lib/validations/student-preference";

export function ChangePreferenceButton({
  dropdownLabel = "Save Project in:",
  defaultStatus,
  changeFunction,
}: {
  dropdownLabel?: string;
  defaultStatus: StudentPreferenceType;
  changeFunction: (newPreferenceType: StudentPreferenceType) => Promise<void>;
}) {
  const [selectStatus, setSelectStatus] =
    useState<StudentPreferenceType>(defaultStatus);

  async function handleChange(value: string) {
    const preferenceChange = studentPreferenceType.parse(value);
    await changeFunction(preferenceChange);
    setSelectStatus(preferenceChange);
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary">
            {selectStatus === PreferenceType.PREFERENCE
              ? "In Preferences"
              : selectStatus === PreferenceType.SHORTLIST
                ? "In Shortlist"
                : "Select"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>{dropdownLabel}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={selectStatus}
            onValueChange={handleChange}
          >
            <DropdownMenuRadioItem value="None">None</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value={PreferenceType.SHORTLIST}>
              Shortlist
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value={PreferenceType.PREFERENCE}>
              Preference
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
