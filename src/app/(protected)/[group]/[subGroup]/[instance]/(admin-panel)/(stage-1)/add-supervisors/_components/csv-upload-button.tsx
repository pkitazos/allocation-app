"use client";

import Papa from "papaparse";
import React, { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import { NewSupervisor } from "@/lib/validations/csv";

import { csvHeaders } from "./add-supervisors";

const csvRowSchema = z.object({
  full_name: z.string(),
  university_id: z.string(),
  email: z.string().email(),
  project_target: z.number().int(),
  project_upper_quota: z.number().int(),
});

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
            toast.error("CSV does not contain headers");
            return;
          }

          console.log(headers);
          if (csvHeaders.join() !== headers.join()) {
            toast.error("CSV does not have the required headers");
            return;
          }

          const result = z.array(csvRowSchema).safeParse(res.data);
          if (!result.success) {
            toast.error("CSV data was not formatted correctly");
            return;
          }

          setNewSupervisors(
            result.data.map((e) => ({
              fullName: e.full_name,
              schoolId: e.university_id,
              email: e.email,
              projectTarget: e.project_target,
              projectUpperQuota: e.project_upper_quota,
            })),
          );
          toast.success("CSV parsed successfully!");
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
