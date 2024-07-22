"use client";

import { Button } from "@/components/ui/button";

import { AllocationCsvData } from "@/lib/validations/allocation-csv-data";
import { ShareIcon } from "lucide-react";

export function SendDataSection({ data }: { data: AllocationCsvData[] }) {
  return (
    <div>
      <Button
        variant="secondary"
        className="flex cursor-pointer items-center gap-2"
      >
        <ShareIcon className="h-4 w-4" />
        <p>Send</p>
      </Button>
    </div>
  );
}
