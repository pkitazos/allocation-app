"use client";
import { Input } from "@/components/ui/input";
import Papa from "papaparse";
import React, { Dispatch, SetStateAction } from "react";
import { z } from "zod";
import { csvHeaders } from "./add-students";
import { NewStudent } from "@/lib/validations/csv";

const csvRowSchema = z.object({
  full_name: z.string(),
  school_id: z.string(),
  email: z.string().email(),
});

type csvRow = z.infer<typeof csvRowSchema>;

export function CSVUploadButton({
  setNewStudents,
}: {
  setNewStudents: Dispatch<SetStateAction<NewStudent[]>>;
}) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      Papa.parse(file, {
        complete: (res) => {
          const headers = res.meta.fields;
          if (!headers) {
            // TODO: display error in toast
            console.error("CSV does not contain headers");
            return;
          }

          const isValid = csvHeaders.every((field) => headers.includes(field));

          if (!isValid) {
            // TODO: display error in toast
            console.error("CSV does not have the required headers");
            return;
          }

          const result = z.array(csvRowSchema).safeParse(res.data);
          if (!result.success) {
            // TODO: display error in toast
            console.error("CSV data was not formatted correctly");
            return;
          }

          setNewStudents(toCamelCaseRows(result.data));
        },
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
      });
    }
  };

  return (
    <Input
      className="w-56 cursor-pointer"
      type="file"
      accept=".csv"
      onChange={handleFileChange}
    />
  );
}

function toCamelCaseRows(someData: csvRow[]) {
  return someData.map((e) => ({
    fullName: e.full_name,
    schoolId: e.school_id,
    email: e.email,
  }));
}
