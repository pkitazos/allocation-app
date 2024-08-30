"use client";
import { useEffect, useRef } from "react";
import { DownloadIcon } from "lucide-react";
import { unparse } from "papaparse";

import { Button } from "@/components/ui/button";

import { AllocationCsvData } from "@/lib/validations/allocation-csv-data";

// TODO: replace with hook and component

export function ExportDataButton({ data }: { data: AllocationCsvData[] }) {
  const downloadLinkRef = useRef<HTMLAnchorElement>(null);

  const header = [
    "Project Internal ID",
    "Student GUID",
    "Student Matric.",
    "Student Level",
    "Project Title",
    "Project Description",
    "Project Special Technical Requirements",
    "Student Ranking",
  ];

  const rows = data.map((e) => [
    e.projectInternalId,
    e.studentId,
    e.studentMatric,
    e.studentLevel,
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
        variant="outline"
        className="flex cursor-pointer items-center gap-2"
        onClick={() => downloadLinkRef.current?.click()}
      >
        <DownloadIcon className="h-4 w-4" />
        <p>Export Data to CSV</p>
        <a ref={downloadLinkRef} className="hidden" />
      </Button>
    </div>
  );
}
