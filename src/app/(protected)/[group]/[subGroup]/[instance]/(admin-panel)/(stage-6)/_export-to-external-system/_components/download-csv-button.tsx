"use client";
import { DownloadIcon } from "lucide-react";
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";

export function DownloadCSVButton({
  itemName,
  csvContent,
}: {
  itemName: string;
  csvContent: string;
}) {
  const downloadLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (downloadLinkRef.current) {
      const link = downloadLinkRef.current;
      link.href = encodeURI(`data:text/csv;charset=utf-8,${csvContent}`);
      link.download = `${itemName}_check_result.csv`;
    }
  }, [csvContent]);

  return (
    <Button
      variant="outline"
      className="flex cursor-pointer items-center gap-2"
      onClick={() => downloadLinkRef.current?.click()}
    >
      <DownloadIcon className="h-4 w-4" />
      <p>Download list of {itemName}s</p>
      <a ref={downloadLinkRef} className="hidden" />
    </Button>
  );
}
