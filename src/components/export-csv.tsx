"use client";
import { DownloadIcon } from "lucide-react";

import { useCsvExport } from "@/lib/utils/csv/use-csv-download";

export function ExportCSVButton<T>({
  header,
  data,
}: {
  header: string[];
  data: T[];
}) {
  const { downloadLinkRef, downloadCsv } = useCsvExport({
    header: header,
    rows: data,
    filename: "project-submissions.csv",
  });

  return (
    <>
      <button className="flex items-center gap-2 text-sm" onClick={downloadCsv}>
        <DownloadIcon className="h-4 w-4" />
        <span>Download selected rows</span>
      </button>
      <a ref={downloadLinkRef} className="hidden" />
    </>
  );
}
