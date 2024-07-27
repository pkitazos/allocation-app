"use client";

import { parse } from "papaparse";
import React, { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { Input } from "@/components/ui/input";

import {
  addStudentsCsvHeaders,
  addStudentsCsvRowSchema,
} from "@/lib/validations/add-users/csv";
import { NewStudent } from "@/lib/validations/add-users/new-user";

export function CSVUploadButton({
  setNewStudents,
  requiredHeaders,
}: {
  setNewStudents: Dispatch<SetStateAction<NewStudent[]>>;
  requiredHeaders: string[];
}) {
  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const fileList = event.target.files;
    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      parse(file, {
        complete: (res) => {
          const headers = res.meta.fields;
          if (!headers) {
            toast.error("CSV does not contain headers");
            return;
          }

          if (requiredHeaders.join() !== headers.join()) {
            toast.error("CSV does not have the required headers");
            return;
          }

          const result = z.array(addStudentsCsvRowSchema).safeParse(res.data);
          if (!result.success) {
            toast.error("CSV data was not formatted correctly");
            return;
          }

          setNewStudents(
            result.data.map((e) => ({
              fullName: e.full_name,
              institutionId: e.matriculation_number,
              email: e.email,
              level: e.student_level,
            })),
          );
          toast.success("CSV parsed successfully!");
        },
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
      });
    }
  }

  return (
    <Input
      className="w-56 cursor-pointer"
      type="file"
      accept=".csv"
      onChange={handleFileChange}
    />
  );
}
