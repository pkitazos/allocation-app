"use client";
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
import { useState } from "react";
import toast from "react-hot-toast";

export function ClientSection({
  projectId,
  studentId,
  defaultStatus,
}: {
  projectId: string;
  studentId: string;
  defaultStatus: string;
}) {
  const [selectStatus, setSelectStatus] = useState(defaultStatus);

  const handleChange = async (value: string) => {
    if (selectStatus === value) return;

    if (selectStatus === "shortlist" || selectStatus === "preference") {
      let res = fetch(`/api/${selectStatus}`, {
        method: "DELETE",
        body: JSON.stringify({
          studentId,
          projectId,
        }),
      });

      toast.promise(res, {
        loading: "loading",
        success: "success",
        error: "error",
      });
    }
    await fetch(`/api/${value}`, {
      method: "POST",
      body: JSON.stringify({
        studentId,
        projectId,
      }),
    });
    setSelectStatus(value);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            {selectStatus === "preference"
              ? "In Preferences"
              : selectStatus === "shortlist"
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
            <DropdownMenuRadioItem value="none">None</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="shortlist">
              Shortlist
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="preference">
              Preference
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
