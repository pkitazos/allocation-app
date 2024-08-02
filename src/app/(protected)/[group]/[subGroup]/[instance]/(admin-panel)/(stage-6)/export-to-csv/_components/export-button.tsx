"use client";
import { useEffect, useRef } from "react";
import { DownloadIcon } from "lucide-react";
import { unparse } from "papaparse";

import { Button } from "@/components/ui/button";

import { AllocationCsvData } from "@/lib/validations/allocation-csv-data";
import { NoteCard } from "@/components/ui/note-card";

export function ExportDataButton({ data }: { data: AllocationCsvData[] }) {
  const downloadLinkRef = useRef<HTMLAnchorElement>(null);

  const header = [
    "Project Internal ID",
    "Student ID",
    "Student Level",
    "Project Title",
    "Project Description",
    "Project Special Technical Requirements",
    "Student Ranking",
  ];

  const rows = data.map((e) => [
    e.projectInternalId,
    e.studentId,
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
        variant="secondary"
        className="flex cursor-pointer items-center gap-2"
        onClick={() => downloadLinkRef.current?.click()}
      >
        <DownloadIcon className="h-4 w-4" />
        <p>Export Data to CSV</p>
        <a ref={downloadLinkRef} className="hidden" />
      </Button>
      <NoteCard>
        This will export all columns even if they are not in view
      </NoteCard>
    </div>
  );
}
