"use client";
import Papa from "papaparse";
import React, { Dispatch, SetStateAction } from "react";
import { z } from "zod";

import { Input } from "@/components/ui/input";

import { NewSupervisor, csvHeaders } from "./add-supervisors";

const csvRowSchema = z.object({
  full_name: z.string(),
  school_id: z.string(),
  email: z.string().email(),
  project_target: z.number().int(),
  project_upper_quota: z.number().int(),
});

type csvRow = z.infer<typeof csvRowSchema>;

export function CSVUploadButton({
  setNewSupervisors,
}: {
  setNewSupervisors: Dispatch<SetStateAction<NewSupervisor[]>>;
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

          setNewSupervisors(toCamelCaseRows(result.data));
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

function toCamelCaseRows(someData: csvRow[]): NewSupervisor[] {
  return someData.map((e) => ({
    fullName: e.full_name,
    schoolId: e.school_id,
    email: e.email,
    projectTarget: e.project_target,
    projectUpperQuota: e.project_upper_quota,
  }));
}
