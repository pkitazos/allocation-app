"use client";
import { PreferenceType } from "@prisma/client";
import { Slot } from "@radix-ui/react-slot";
import { BookmarkIcon, LucideMoreHorizontal as MoreIcon } from "lucide-react";
import { ReactNode, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  StudentPreferenceType,
  studentPreferenceSchema,
} from "@/lib/validations/student-preference";

export function StudentPreferenceActionMenu({
  defaultType,
  changePreference,
  ...rest
}: {
  defaultType: StudentPreferenceType | undefined;
  changePreference: (newPreference: StudentPreferenceType) => Promise<void>;
  children?: ReactNode;
}) {
  const [preferenceType, setPreferenceType] = useState<
    StudentPreferenceType | undefined
  >(defaultType);

  async function handleChange(value: string) {
    const preferenceChange = studentPreferenceSchema.parse(value);
    await changePreference(preferenceChange);
    setPreferenceType(preferenceChange);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-68" align="center" side="bottom">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Slot {...rest} />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center gap-2 text-primary">
            <BookmarkIcon className="h-4 w-4" />
            <span>Change preference type to</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup
                value={preferenceType}
                onValueChange={handleChange}
              >
                <DropdownMenuRadioItem value={PreferenceType.SHORTLIST}>
                  Shortlist
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value={PreferenceType.PREFERENCE}>
                  Preference
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="None">None</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
