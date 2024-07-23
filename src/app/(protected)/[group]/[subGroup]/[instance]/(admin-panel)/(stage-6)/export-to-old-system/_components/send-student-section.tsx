"use client";

import { ShareIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { StudentMatriculationData } from "@/lib/validations/allocation-export-data";

export function SendStudentSection({
  studentData,
}: {
  studentData: StudentMatriculationData[];
}) {
  return (
    <div>
      <Button
        variant="secondary"
        className="flex cursor-pointer items-center gap-2"
        onClick={() => console.log({ students: studentData })}
      >
        <ShareIcon className="h-4 w-4" />
        <p>Send students</p>
      </Button>
    </div>
  );
}
