"use client";

import { ShareIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { SupervisorGuidData } from "@/lib/validations/allocation-export-data";

export function SendSupervisorSection({
  supervisorData,
}: {
  supervisorData: SupervisorGuidData[];
}) {
  return (
    <div>
      <Button
        variant="secondary"
        className="flex cursor-pointer items-center gap-2"
        onClick={() => console.log({ supervisors: supervisorData })}
      >
        <ShareIcon className="h-4 w-4" />
        <p>Send</p>
      </Button>
    </div>
  );
}
