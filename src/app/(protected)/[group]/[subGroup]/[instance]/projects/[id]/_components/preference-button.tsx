"use client";
import { useState } from "react";
import { PreferenceType } from "@prisma/client";
import { toast } from "sonner";
import { z } from "zod";

import { useInstanceParams } from "@/components/params-context";
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

import { api } from "@/lib/trpc/client";
import { useRouter } from "next/navigation";

export function PreferenceButton({
  projectId,
  defaultStatus,
}: {
  projectId: string;
  defaultStatus: string;
}) {
  const router = useRouter();
  const params = useInstanceParams();
  const [selectStatus, setSelectStatus] = useState(defaultStatus);

  const { mutateAsync: updateAsync } =
    api.user.student.preference.update.useMutation();

  const handleChange = (value: string) => {
    const preferenceChange =
      value === "None" ? "None" : z.nativeEnum(PreferenceType).parse(value);

    toast.promise(
      updateAsync({
        params,
        projectId,
        preferenceType: preferenceChange,
      }),
      {
        loading: "Loading...",
        success: "Success",
        error: "Error",
      },
    );
    setSelectStatus(value);
    router.refresh();
  };

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
          <DropdownMenuLabel>Save project in:</DropdownMenuLabel>
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
