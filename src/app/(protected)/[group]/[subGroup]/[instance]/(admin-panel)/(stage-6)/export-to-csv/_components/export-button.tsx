"use client";
import { useEffect, useRef } from "react";
import { DownloadIcon } from "lucide-react";
import { unparse } from "papaparse";

import { Button } from "@/components/ui/button";

import { AllocationCsvData } from "@/lib/validations/allocation-csv-data";

export function ExportDataButton({ data }: { data: AllocationCsvData[] }) {
  const downloadLinkRef = useRef<HTMLAnchorElement>(null);

  const header = [
    "Project Internal ID",
    "Project External ID",
    "Student ID",
    "Project Title",
    "Project Description",
    "Project Special Technical Requirements",
    "Student Ranking",
  ];

  const rows = data.map((e) => [
    e.projectInternalId,
    e.projectExternalId,
    e.studentId,
    e.projectTitle,
    e.projectDescription,
    e.projectSpecialTechnicalRequirements,
    e.studentRanking,
  ]);

  const csvContent = unparse({
    fields: header,
    data: rows,
  });

  useEffect(() => {
    if (downloadLinkRef.current) {
      const link = downloadLinkRef.current;
      link.href = encodeURI(`data:text/csv;charset=utf-8,${csvContent}`);
      link.download = "project_allocation_data.csv";
    }
  }, [csvContent]);

  return (
    <div className="flex flex-col items-start gap-3">
      <Button
        variant="secondary"
        className="flex cursor-pointer items-center gap-2"
        onClick={() => downloadLinkRef.current?.click()}
      >
        <DownloadIcon className="h-4 w-4" />
        <p>Export Data to CSV</p>
        <a ref={downloadLinkRef} className="hidden" />
      </Button>
      {/* // TODO: convert to NoteCard after merging branches */}
      <p className="pl-1">
        Will export all columns even if they are not in view
      </p>
    </div>
  );
}
