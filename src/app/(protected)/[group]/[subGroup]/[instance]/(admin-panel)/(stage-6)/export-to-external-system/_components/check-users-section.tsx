"use client";

import { ForwardIcon } from "lucide-react";

import { useInstanceParams } from "@/components/params-context";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { api } from "@/lib/trpc/client";

import { ResultsCard } from "./results-card";
import { unparse } from "papaparse";
import { toast } from "sonner";

export function CheckUsersSection() {
  const params = useInstanceParams();
  const {
    data: studentData,
    status: studentStatus,
    mutateAsync: checkStudentsAsync,
  } = api.institution.instance.external.checkStudents.useMutation();

  const {
    data: supervisorData,
    status: supervisorStatus,
    mutateAsync: checkSupervisorsAsync,
  } = api.institution.instance.external.checkSupervisors.useMutation();

  async function handleExternalCheck() {
    void toast.promise(
      checkStudentsAsync({ params }).then((data) => {
        // TODO: refetch whether create button should be enabled
        return data;
      }),
      {
        loading: "Checking students...",
        success: (data) => `Successfully checked ${data.total} students`,
        error: "An error occurred while checking students",
      },
    );

    void toast.promise(
      checkSupervisorsAsync({ params }).then((data) => {
        // TODO: refetch whether create button should be enabled
        return data;
      }),
      {
        loading: "Checking supervisors...",
        success: (data) => `Successfully checked ${data.total} supervisors`,
        error: "An error occurred while checking supervisors",
      },
    );
  }

  return (
    <div className="flex flex-col items-start gap-4">
      <p>
        Check if all students and supervisors exist on the new system. If not,
        please contact [person to contact]
      </p>
      <Button
        variant="secondary"
        className="flex items-center gap-2"
        onClick={handleExternalCheck}
      >
        <ForwardIcon className="h-4 w-4" />
        <p>Check Users</p>
      </Button>
      {studentStatus === "pending" && <Skeleton className="h-16 w-full" />}
      {studentStatus === "success" && (
        <ResultsCard
          userRole="student"
          data={studentData}
          csvContent={unparse({
            fields: [
              "Student Matriculation Number",
              "Exists in Assessment System",
            ],
            data: studentData.checkedStudents.map((e) => [
              e.matriculation,
              e.exists,
            ]),
          })}
        />
      )}
    </div>
  );
}
