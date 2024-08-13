"use client";

import React from "react";
import { parse } from "papaparse";
import { toast } from "sonner";
import { z } from "zod";

import { CSVParsingErrorCard } from "@/components/toast-card/csv-parsing-error";
import { Input } from "@/components/ui/input";

import { addStudentsCsvRowSchema } from "@/lib/validations/add-users/csv";
import { NewStudent } from "@/lib/validations/add-users/new-user";

export function CSVUploadButton({
  handleUpload,
  requiredHeaders,
}: {
  handleUpload: (data: NewStudent[]) => Promise<void>;
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
            const allErrors = result.error.errors;
            const uniqueErrors = [...new Set(allErrors)];
            toast.error(
              <CSVParsingErrorCard
                title="CSV data was not formatted correctly. Ensure all rows contain:"
                errors={uniqueErrors}
              />,
            );
            return;
          }
          toast.success("CSV parsed successfully!");

          handleUpload(
            result.data.map((e) => ({
              fullName: e.full_name,
              institutionId: e.guid,
              email: e.email,
              level: e.student_level,
            })),
          );
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
