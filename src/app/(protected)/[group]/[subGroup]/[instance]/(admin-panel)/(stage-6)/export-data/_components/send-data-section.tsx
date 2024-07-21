"use client";

import { Button } from "@/components/ui/button";

import { AllocationCsvData } from "@/lib/validations/allocation-csv-data";

export function SendDataSection({ data }: { data: AllocationCsvData[] }) {
  return (
    <div>
      <Button>Send</Button>
    </div>
  );
}
