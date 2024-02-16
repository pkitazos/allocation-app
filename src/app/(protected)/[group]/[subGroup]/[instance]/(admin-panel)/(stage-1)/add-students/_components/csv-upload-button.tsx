"use client";

import Papa from "papaparse";
import React, { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import { NewStudent } from "@/lib/validations/csv";

import { csvHeaders } from "./add-students";

const csvRowSchema = z.object({
  full_name: z.string(),
  university_id: z.string(),
  email: z.string().email(),
});

export function CSVUploadButton({
  setNewStudents,
}: {
  setNewStudents: Dispatch<SetStateAction<NewStudent[]>>;
}) {
  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      Papa.parse(file, {
        complete: (res) => {
          const headers = res.meta.fields;
          if (!headers) {
            toast.error("CSV does not contain headers");
            return;
          }

          if (csvHeaders.join() !== headers.join()) {
            toast.error("CSV does not have the required headers");
            return;
          }

          const result = z.array(csvRowSchema).safeParse(res.data);
          if (!result.success) {
            toast.error("CSV data was not formatted correctly");
            return;
          }

          setNewStudents(
            result.data.map((e) => ({
              fullName: e.full_name,
              schoolId: e.university_id,
              email: e.email,
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
